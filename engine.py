"""
Alpha Aerosols (Kot Abdul Malik) — Production & Operations Database Engine
Single Source of Truth: aerosol.db (SQLite with Write-Ahead Logging WAL mode)
Enforces Physical Yield-Inverse Mass Balance: Req = Net / (1 - Scrap)
Zero Windows COM Automation: Pure Python + SQLite + openpyxl
"""

import os
import sqlite3
import math
import json
from datetime import datetime, date, timedelta
from typing import Dict, List, Any, Optional

DB_PATH = os.path.join(os.path.dirname(__file__), 'data', 'aerosol.db')
JSON_PATH = os.path.join(os.path.dirname(__file__), 'data', 'production.json')

# Production line capacity constants
CANS_PER_SHIFT_NOMINAL = 30000  # Nominal target output per 12h shift
CAN_SIZES = {
    "45x160mm": {
        "diameter_mm": 45.0,
        "height_mm": 160.0,
        "wall_thickness_mm": 0.40,
        "slug_weight_g": 20.0,
        "outer_surface_m2": math.pi * 0.045 * 0.160, # 0.022619 m²
        # Inner: dia = 45 - 2*0.40 = 44.20 mm
        "inner_surface_m2": (math.pi * 0.0442 * 0.160) + (math.pi * (0.0221 ** 2)), # 0.023751 m²
    },
    "45x150mm": {
        "diameter_mm": 45.0,
        "height_mm": 150.0,
        "wall_thickness_mm": 0.35,
        "slug_weight_g": 19.0,
        "outer_surface_m2": math.pi * 0.045 * 0.150, # 0.021206 m²
        # Inner: dia = 45 - 2*0.35 = 44.30 mm
        "inner_surface_m2": (math.pi * 0.0443 * 0.150) + (math.pi * (0.02215 ** 2)), # 0.022417 m²
    }
}

# Locked Scrap Factors (Transfer Losses)
SCRAP_FACTORS = {
    "lacquer": 0.35,     # 35% airless spray transfer loss
    "base_coat": 0.10,   # 10% roller coater loss
    "varnish": 0.10,     # 10% roller coater loss
    "ink": 0.10,         # 10% dry offset ink loss
    "slugs": 0.10,       # 10% overall mechanical line scrap
    "lubricant": 0.10,   # 10% process loss
    "cleaner": 0.10,     # 10% wash bath loss
}

def get_connection(db_path: Optional[str] = None) -> sqlite3.Connection:
    """Returns a SQLite connection configured with WAL mode and foreign keys enabled."""
    if db_path is None:
        db_path = DB_PATH
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode = WAL;")
    conn.execute("PRAGMA foreign_keys = ON;")
    conn.execute("PRAGMA synchronous = NORMAL;")
    return conn

def init_db(db_path: Optional[str] = None):
    """Initializes the database schema."""
    if db_path is None:
        db_path = DB_PATH
    conn = get_connection(db_path)
    with conn:
        conn.execute("""
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pof_number TEXT UNIQUE NOT NULL,
            customer_name TEXT NOT NULL,
            product_name TEXT NOT NULL,
            product_size TEXT NOT NULL,
            order_qty INTEGER NOT NULL,
            tolerance_pct REAL NOT NULL DEFAULT 0.05,
            order_date TEXT NOT NULL,
            due_date TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'In Production',
            artwork_ref TEXT,
            notes TEXT,
            created_at TEXT NOT NULL
        );
        """)

        conn.execute("""
        CREATE TABLE IF NOT EXISTS shifts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            shift_date TEXT NOT NULL,
            shift_type TEXT NOT NULL,
            pof_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
            product_size TEXT NOT NULL,
            good_cans INTEGER NOT NULL,
            line_scrap INTEGER NOT NULL,
            downtime_hours REAL NOT NULL DEFAULT 0.0,
            downtime_reason TEXT,
            supervisor TEXT NOT NULL,
            created_at TEXT NOT NULL
        );
        """)

        conn.execute("""
        CREATE TABLE IF NOT EXISTS inventory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            item_code TEXT UNIQUE NOT NULL,
            category TEXT NOT NULL,
            item_name TEXT NOT NULL,
            uom TEXT NOT NULL,
            balance_qty REAL NOT NULL,
            min_stock_level REAL NOT NULL DEFAULT 0,
            unit_cost_pkr REAL DEFAULT 0,
            batch_number TEXT,
            received_date TEXT NOT NULL,
            shelf_life_days INTEGER NOT NULL,
            storage_condition TEXT NOT NULL,
            location TEXT DEFAULT 'Kot Abdul Malik Central Stores',
            updated_at TEXT NOT NULL
        );
        """)

        conn.execute("""
        CREATE TABLE IF NOT EXISTS dispatches (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            challan_number TEXT UNIQUE NOT NULL,
            dispatch_date TEXT NOT NULL,
            pof_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
            dispatched_cans INTEGER NOT NULL,
            carton_count INTEGER NOT NULL,
            pallet_count INTEGER NOT NULL,
            vehicle_number TEXT NOT NULL,
            driver_name TEXT,
            receiver_party TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'Dispatched',
            created_at TEXT NOT NULL
        );
        """)

        conn.execute("""
        CREATE TABLE IF NOT EXISTS bom_standards (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_size TEXT NOT NULL,
            material_group TEXT NOT NULL,
            item_code TEXT NOT NULL,
            item_name TEXT NOT NULL,
            uom TEXT NOT NULL,
            net_rate_per_1000 REAL NOT NULL,
            scrap_rate REAL NOT NULL,
            gross_rate_per_1000 REAL NOT NULL,
            calculation_rule TEXT NOT NULL
        );
        """)
    conn.close()

def calculate_yield_inverse(net_rate: float, scrap_factor: float) -> float:
    """
    Physical Yield-Inverse Mass Balance:
    Gross = Net / (1 - Scrap)
    Avoids Tubex additive error of Net * (1 + Scrap).
    """
    if scrap_factor >= 1.0:
        raise ValueError("Scrap factor must be less than 1.0")
    return net_rate / (1.0 - scrap_factor)

def calculate_bom(product_size: str, can_qty: int, options: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    Computes rigorous mass-balance requirements for any order quantity.
    Supports 45x160mm (standard) and 45x150mm.
    Enforces yield-inverse physics: Req = Net / (1 - Scrap).
    """
    size_spec = CAN_SIZES.get(product_size, CAN_SIZES["45x160mm"])
    thousand_units = can_qty / 1000.0

    # Net Specs based on geometry & High-End TDS values
    # Internal Lacquer (SCHEKOSOL INT PROT Gold - 44 g/m² vs Beige - 48 g/m²)
    lacquer_type = (options and options.get("lacquer_type")) or "gold"
    if str(lacquer_type).lower() == "beige":
        lacquer_item_code = "505"
        lacquer_item_name = "SCHEKOSOL INT BEIGE (400 4 902)"
        net_lacquer_per_1000 = 1.140 # kg/1000 cans
        lacquer_formula = "Inner Area (m²) x 48g/m² / (1 - 0.35) [Transfer efficiency 65%]"
    else:
        lacquer_item_code = "504"
        lacquer_item_name = "SCHEKOSOL INT PROT Gold (400 9 901)"
        net_lacquer_per_1000 = size_spec["inner_surface_m2"] * 44.0 # kg/1000 cans
        lacquer_formula = "Inner Area (m²) x 44g/m² / (1 - 0.35) [Transfer efficiency 65%]"
    gross_lacquer_per_1000 = calculate_yield_inverse(net_lacquer_per_1000, SCRAP_FACTORS["lacquer"])

    # Base Coat (SCHEKOSOL WH BC - 43 g/m² vs CLEAR BC - 31 g/m²)
    base_coat_type = (options and options.get("base_coat_type")) or "white"
    if str(base_coat_type).lower() == "clear":
        base_item_code = "507"
        base_item_name = "SCHEKOSOL CLEAR BC (422 9 918)"
        net_base_per_1000 = 0.701 # kg/1000 cans
        base_formula = "Outer Area (m²) x 31g/m² / (1 - 0.10) [Transfer efficiency 90%]"
    else:
        base_item_code = "506"
        base_item_name = "SCHEKOSOL WH BC (422 0 903)"
        net_base_per_1000 = size_spec["outer_surface_m2"] * 43.0 # kg/1000 cans
        base_formula = "Outer Area (m²) x 43g/m² / (1 - 0.10) [Transfer efficiency 90%]"
    gross_base_per_1000 = calculate_yield_inverse(net_base_per_1000, SCRAP_FACTORS["base_coat"])

    # Varnish (SCHEKOSOL OPV GLOSSY - 19 g/m² vs SILKMATT - 17 g/m²)
    varnish_type = (options and options.get("varnish_type")) or "glossy"
    if str(varnish_type).lower() == "silkmatt":
        varnish_item_code = "509"
        varnish_item_name = "SCHEKOSOL OPV SILKMATT (422 9 903)"
        net_varnish_per_1000 = 0.385 # kg/1000 cans
        varnish_formula = "Outer Area (m²) x 17g/m² / (1 - 0.10) [Transfer efficiency 90%]"
    else:
        varnish_item_code = "508"
        varnish_item_name = "SCHEKOSOL OPV GLOSSY (422 9 900)"
        net_varnish_per_1000 = size_spec["outer_surface_m2"] * 19.0 # kg/1000 cans
        varnish_formula = "Outer Area (m²) x 19g/m² / (1 - 0.10) [Transfer efficiency 90%]"
    gross_varnish_per_1000 = calculate_yield_inverse(net_varnish_per_1000, SCRAP_FACTORS["varnish"])

    # Slugs
    net_slug_per_1000 = size_spec["slug_weight_g"] # 20.0 kg/1000 for 160mm, 19.0 for 150mm
    gross_slug_per_1000 = calculate_yield_inverse(net_slug_per_1000, SCRAP_FACTORS["slugs"])

    # Extrusion Lubricant (105g per 100kg slugs)
    net_lubricant_per_1000 = (net_slug_per_1000 * 0.105) / 100.0 # 0.021 kg/1000
    gross_lubricant_per_1000 = calculate_yield_inverse(net_lubricant_per_1000, SCRAP_FACTORS["lubricant"])

    # Washer Cleaner (5.0 kg/1000 cans empirical startup buffer)
    net_cleaner_per_1000 = 5.0
    gross_cleaner_per_1000 = calculate_yield_inverse(net_cleaner_per_1000, SCRAP_FACTORS["cleaner"])

    # Printing Inks (Locked at 0.280 kg/1000 net per color station)
    num_colors = (options and options.get("num_colors")) or 4
    net_ink_per_color_per_1000 = 0.280
    gross_ink_per_color_per_1000 = calculate_yield_inverse(net_ink_per_color_per_1000, SCRAP_FACTORS["ink"])
    total_net_ink_per_1000 = net_ink_per_color_per_1000 * num_colors
    total_gross_ink_per_1000 = gross_ink_per_color_per_1000 * num_colors

    items = [
        {
            "item_code": "501",
            "material_group": "Aluminum Slugs",
            "item_name": f"{size_spec['diameter_mm']:.0f}mm Aluminum Slug (Al99.7%)",
            "uom": "kg",
            "net_rate_per_1000": round(net_slug_per_1000, 3),
            "scrap_pct": 10.0,
            "gross_rate_per_1000": round(gross_slug_per_1000, 3),
            "net_total": round(net_slug_per_1000 * thousand_units, 2),
            "gross_total": round(gross_slug_per_1000 * thousand_units, 2),
            "formula": "Slug wt (g) x 1,000 / (1 - 0.10)"
        },
        {
            "item_code": "502",
            "material_group": "Extrusion Lubricant",
            "item_name": "SAPILUB LUBRIMET GR8",
            "uom": "kg",
            "net_rate_per_1000": round(net_lubricant_per_1000, 4),
            "scrap_pct": 10.0,
            "gross_rate_per_1000": round(gross_lubricant_per_1000, 4),
            "net_total": round(net_lubricant_per_1000 * thousand_units, 3),
            "gross_total": round(gross_lubricant_per_1000 * thousand_units, 3),
            "formula": "105g / 100kg Slugs / (1 - 0.10)"
        },
        {
            "item_code": "503",
            "material_group": "Alkaline Cleaner",
            "item_name": "SAPILUB ALULIQUID 13",
            "uom": "kg",
            "net_rate_per_1000": round(net_cleaner_per_1000, 3),
            "scrap_pct": 10.0,
            "gross_rate_per_1000": round(gross_cleaner_per_1000, 3),
            "net_total": round(net_cleaner_per_1000 * thousand_units, 2),
            "gross_total": round(gross_cleaner_per_1000 * thousand_units, 2),
            "formula": "Empirical 5.0 kg / 1,000 / (1 - 0.10)"
        },
        {
            "item_code": lacquer_item_code,
            "material_group": "Internal Lacquer",
            "item_name": lacquer_item_name,
            "uom": "kg",
            "net_rate_per_1000": round(net_lacquer_per_1000, 3),
            "scrap_pct": 35.0,
            "gross_rate_per_1000": round(gross_lacquer_per_1000, 3),
            "net_total": round(net_lacquer_per_1000 * thousand_units, 2),
            "gross_total": round(gross_lacquer_per_1000 * thousand_units, 2),
            "formula": lacquer_formula
        },
        {
            "item_code": base_item_code,
            "material_group": "External Base Coat",
            "item_name": base_item_name,
            "uom": "kg",
            "net_rate_per_1000": round(net_base_per_1000, 3),
            "scrap_pct": 10.0,
            "gross_rate_per_1000": round(gross_base_per_1000, 3),
            "net_total": round(net_base_per_1000 * thousand_units, 2),
            "gross_total": round(gross_base_per_1000 * thousand_units, 2),
            "formula": base_formula
        },
        {
            "item_code": varnish_item_code,
            "material_group": "Overprint Varnish",
            "item_name": varnish_item_name,
            "uom": "kg",
            "net_rate_per_1000": round(net_varnish_per_1000, 3),
            "scrap_pct": 10.0,
            "gross_rate_per_1000": round(gross_varnish_per_1000, 3),
            "net_total": round(net_varnish_per_1000 * thousand_units, 2),
            "gross_total": round(gross_varnish_per_1000 * thousand_units, 2),
            "formula": varnish_formula
        },
        {
            "item_code": "510",
            "material_group": "Printing Ink",
            "item_name": f"SunAltec MB PLUS Dry-Offset Inks ({num_colors} Colors)",
            "uom": "kg",
            "net_rate_per_1000": round(total_net_ink_per_1000, 3),
            "scrap_pct": 10.0,
            "gross_rate_per_1000": round(total_gross_ink_per_1000, 3),
            "net_total": round(total_net_ink_per_1000 * thousand_units, 2),
            "gross_total": round(total_gross_ink_per_1000 * thousand_units, 2),
            "formula": f"{num_colors} colors x 0.280 kg / 1,000 / (1 - 0.10)"
        }
    ]

    estimated_shifts = math.ceil(can_qty / (CANS_PER_SHIFT_NOMINAL * 0.90)) # 90% OEE
    slug_tonnage = (gross_slug_per_1000 * thousand_units) / 1000.0

    return {
        "product_size": product_size,
        "can_qty": can_qty,
        "geometry": size_spec,
        "estimated_shifts": estimated_shifts,
        "slug_tonnage": round(slug_tonnage, 3),
        "items": items,
        "summary": {
            "slug_gross_kg": round(gross_slug_per_1000 * thousand_units, 1),
            "lacquer_gross_kg": round(gross_lacquer_per_1000 * thousand_units, 2),
            "base_coat_gross_kg": round(gross_base_per_1000 * thousand_units, 2),
            "varnish_gross_kg": round(gross_varnish_per_1000 * thousand_units, 2),
            "total_ink_gross_kg": round(total_gross_ink_per_1000 * thousand_units, 2),
            "cleaner_gross_kg": round(gross_cleaner_per_1000 * thousand_units, 1),
        }
    }

def evaluate_shelf_life(received_date_str: str, shelf_life_days: int, as_of_date_str: Optional[str] = None) -> Dict[str, Any]:
    """
    Computes shelf-life countdown and categorization:
    🟢 Normal: < 120 days
    🟡 Warning: 120 <= age < 150 days
    🔴 Critical: >= 150 days (approaching 180d expiration)
    """
    as_of = date.fromisoformat(as_of_date_str) if as_of_date_str else date.today()
    rec = date.fromisoformat(received_date_str)
    age_days = (as_of - rec).days
    remaining_days = max(0, shelf_life_days - age_days)

    if age_days >= 150:
        status = "critical"
        badge_color = "#ef4444" # red
        label = "Critical Shelf-Life (>=150d)"
    elif age_days >= 120:
        status = "warning"
        badge_color = "#f59e0b" # amber
        label = "Warning Shelf-Life (>=120d)"
    else:
        status = "normal"
        badge_color = "#10b981" # emerald
        label = "Normal / Fresh (<120d)"

    return {
        "age_days": age_days,
        "remaining_days": remaining_days,
        "shelf_life_days": shelf_life_days,
        "status": status,
        "badge_color": badge_color,
        "label": label,
        "expiry_date": (rec + timedelta(days=shelf_life_days)).isoformat()
    }

def seed_master_data(db_path: Optional[str] = None, as_of_date: str = "2026-09-12", force_reseed: bool = False, demo_data: bool = False):
    """
    Populates operational records for Alpha Aerosols (Kot Abdul Malik).
    When demo_data=False (default): Sets up the pre-production environment with 'Aerosol Customer',
    0 shift entries, 0 dispatches, and active raw material inventory ready for plant startup.
    When demo_data=True: Seeds historical test shifts and multi-customer orders for automated test suites.
    """
    if db_path is None:
        db_path = DB_PATH
    init_db(db_path)
    conn = get_connection(db_path)
    cur = conn.cursor()

    if force_reseed:
        cur.execute("DELETE FROM dispatches;")
        cur.execute("DELETE FROM shifts;")
        cur.execute("DELETE FROM orders;")
        cur.execute("DELETE FROM inventory;")
        cur.execute("DELETE FROM bom_standards;")
        try:
            cur.execute("DELETE FROM sqlite_sequence WHERE name IN ('orders', 'shifts', 'inventory', 'dispatches', 'bom_standards');")
        except Exception:
            pass
    else:
        # Check if already seeded
        cur.execute("SELECT COUNT(*) FROM orders;")
        if cur.fetchone()[0] > 0:
            conn.close()
            return

    if demo_data:
        # 1. Historical Demo Orders
        orders_data = [
            (
                1,
                "POF-2026-081",
                "Golden Pearl Cosmetics",
                "Golden Pearl Body Spray 150ml",
                "45x160mm",
                120000,
                0.05,
                "2026-08-25",
                "2026-09-18",
                "In Production",
                "GP-BS-150-REV3",
                "Priority export run. High gloss finish required.",
                "2026-08-25T09:00:00"
            ),
            (
                2,
                "POF-2026-082",
                "Alpha Aerosols Stock",
                "Standard Deodorant Can 45x160 White",
                "45x160mm",
                80000,
                0.05,
                "2026-09-01",
                "2026-09-22",
                "In Production",
                "AL-STD-160-W",
                "Buffer stock for spot domestic orders.",
                "2026-09-01T10:30:00"
            ),
            (
                3,
                "POF-2026-083",
                "CareLine Personal Care",
                "CareLine Fresh Deodorant 45x150",
                "45x150mm",
                100000,
                0.05,
                "2026-09-03",
                "2026-09-28",
                "Pending",
                "CL-DEO-150-B",
                "Silk-matt overprint varnish specified. 0.35mm wall.",
                "2026-09-03T14:15:00"
            ),
            (
                4,
                "POF-2026-079",
                "Meditech Aerosols",
                "Meditech Disinfectant Spray 45x160",
                "45x160mm",
                60000,
                0.05,
                "2026-08-10",
                "2026-09-05",
                "Completed",
                "MT-DIS-160-G",
                "Gold protective lacquer double coat specified.",
                "2026-08-10T11:00:00"
            )
        ]

        # 2. Historical Demo Shifts
        shifts_data = [
            ("2026-08-28", "Day", 4, "45x160mm", 14800, 620, 1.0, "Washer nozzle clean", "Tariq Mahmood", "2026-08-28T20:05:00"),
            ("2026-08-28", "Night", 4, "45x160mm", 15100, 580, 0.5, "Ink viscosity adjust", "M. Aslam", "2026-08-29T08:10:00"),
            ("2026-08-29", "Day", 4, "45x160mm", 15250, 510, 0.5, "Minor slug jam at chute", "Tariq Mahmood", "2026-08-29T20:00:00"),
            ("2026-08-29", "Night", 4, "45x160mm", 15400, 460, 0.0, "None", "M. Aslam", "2026-08-30T08:00:00"),
            ("2026-09-08", "Day", 1, "45x160mm", 13800, 780, 1.5, "Print mandrel registration tuning", "Tariq Mahmood", "2026-09-08T20:00:00"),
            ("2026-09-08", "Night", 1, "45x160mm", 14600, 610, 0.75, "OPV coater doctor blade adjustment", "M. Aslam", "2026-09-09T08:00:00"),
            ("2026-09-09", "Day", 1, "45x160mm", 15200, 540, 0.5, "Curing oven temperature stabilization", "Tariq Mahmood", "2026-09-09T20:00:00"),
            ("2026-09-09", "Night", 1, "45x160mm", 15050, 590, 0.5, "Necker guide rail wiper change", "M. Aslam", "2026-09-10T08:00:00"),
            ("2026-09-10", "Day", 1, "45x160mm", 15500, 480, 0.25, "Slug feeder refill", "Tariq Mahmood", "2026-09-10T20:00:00"),
            ("2026-09-10", "Night", 1, "45x160mm", 14900, 520, 0.5, "Printer ink station 2 top-up", "M. Aslam", "2026-09-11T08:00:00"),
            ("2026-09-11", "Day", 1, "45x160mm", 15600, 440, 0.25, "Scheduled line lubrication", "Tariq Mahmood", "2026-09-11T20:00:00"),
            ("2026-09-11", "Night", 1, "45x160mm", 15300, 490, 0.5, "Palletizer sensor cleaning", "M. Aslam", "2026-09-12T08:00:00"),
            ("2026-09-12", "Day", 1, "45x160mm", 8200, 240, 0.25, "Press punch temperature check", "Tariq Mahmood", "2026-09-12T12:30:00"),
        ]

        # 3. Historical Demo Inventory
        inventory_data = [
            ("501", "Aluminum Slugs", "45mm Aluminum Slug (Al99.7%)", "kg", 18500.0, 5000.0, 780.0, "SLUG-2026-07A", "2026-07-15", 1080, "Ambient Dry Store (5°C - 30°C)", "Kot Abdul Malik Central Stores", "2026-09-12T10:00:00"),
            ("502", "Extrusion Lubricant", "SAPILUB LUBRIMET GR8", "kg", 145.0, 30.0, 2400.0, "LUB-2026-03", "2026-06-20", 1080, "Ambient Dry Store (5°C - 30°C)", "Chemical Room Bay 1", "2026-09-12T10:00:00"),
            ("503", "Alkaline Cleaner", "SAPILUB ALULIQUID 13", "kg", 1250.0, 400.0, 850.0, "ALU-2026-02", "2026-06-15", 1080, "Ambient Chemical Bay (5°C - 35°C)", "Washer Chemical Storage", "2026-09-12T10:00:00"),
            ("504", "Internal Lacquer", "SCHEKOSOL INT PROT Gold (400 9 901)", "kg", 860.0, 200.0, 3200.0, "LAC-2026-G1", "2026-07-28", 240, "Air Conditioned (20°C - 25°C)", "Cold Room Rack A1", "2026-09-12T10:00:00"),
            ("505", "Internal Lacquer", "SCHEKOSOL INT BEIGE (400 4 902)", "kg", 320.0, 150.0, 3400.0, "LAC-2026-B1", "2026-04-12", 240, "Air Conditioned (20°C - 25°C)", "Cold Room Rack A2", "2026-09-12T10:00:00"),
            ("506", "External Base Coat", "SCHEKOSOL WH BC (422 0 903)", "kg", 1100.0, 300.0, 2100.0, "BC-2026-W2", "2026-08-05", 240, "Air Conditioned (20°C - 25°C)", "Cold Room Rack B1", "2026-09-12T10:00:00"),
            ("507", "External Base Coat", "SCHEKOSOL CLEAR BC (422 9 918)", "kg", 240.0, 150.0, 2300.0, "BC-2026-C1", "2026-05-10", 180, "Air Conditioned (20°C - 25°C)", "Cold Room Rack B2", "2026-09-12T10:00:00"),
            ("508", "Overprint Varnish", "SCHEKOSOL OPV GLOSSY (422 9 900)", "kg", 650.0, 200.0, 1900.0, "OPV-2026-G3", "2026-08-12", 180, "Air Conditioned (20°C - 25°C)", "Cold Room Rack C1", "2026-09-12T10:00:00"),
            ("509", "Overprint Varnish", "SCHEKOSOL OPV SILKMATT (422 9 903)", "kg", 180.0, 150.0, 2250.0, "OPV-2026-S1", "2026-04-18", 180, "Air Conditioned (20°C - 25°C)", "Cold Room Rack C2", "2026-09-12T10:00:00"),
            ("510", "Printing Ink", "SunAltec MB PLUS 169766 Opaque White", "kg", 85.0, 20.0, 4200.0, "INK-2026-OW", "2026-06-01", 1080, "Ambient Dry Store (15°C - 30°C)", "Ink Dispensing Station", "2026-09-12T10:00:00"),
            ("599", "Printing Ink", "SunAltec MB PLUS 168391 Yellow G/S", "kg", 45.0, 15.0, 4600.0, "INK-2026-Y1", "2026-06-01", 1080, "Ambient Dry Store (15°C - 30°C)", "Ink Dispensing Station", "2026-09-12T10:00:00"),
            ("600", "Printing Ink", "SunAltec MB PLUS 168396 Magenta", "kg", 42.0, 15.0, 4800.0, "INK-2026-M1", "2026-06-01", 1080, "Ambient Dry Store (15°C - 30°C)", "Ink Dispensing Station", "2026-09-12T10:00:00"),
            ("601", "Printing Ink", "SunAltec MB PLUS 168404 Black Conc.", "kg", 55.0, 15.0, 4300.0, "INK-2026-BK", "2026-06-01", 1080, "Ambient Dry Store (15°C - 30°C)", "Ink Dispensing Station", "2026-09-12T10:00:00"),
            ("603", "Printing Ink", "SunAltec MB PLUS 168402 Reflex Blue", "kg", 38.0, 15.0, 4900.0, "INK-2026-RB", "2026-06-01", 1080, "Ambient Dry Store (15°C - 30°C)", "Ink Dispensing Station", "2026-09-12T10:00:00"),
        ]

        # 4. Historical Demo Dispatches
        dispatches_data = [
            ("DC-2026-039", "2026-09-02", 4, 30000, 150, 10, "LES-4412", "Muhammad Akram", "Meditech Aerosols Ltd.", "Delivered", "2026-09-02T16:30:00"),
            ("DC-2026-040", "2026-09-04", 4, 30550, 153, 11, "LZT-8921", "Abdul Rashid", "Meditech Aerosols Ltd.", "Delivered", "2026-09-04T15:45:00"),
            ("DC-2026-041", "2026-09-10", 1, 45000, 225, 15, "LES-4412", "Muhammad Akram", "Golden Pearl Cosmetics", "Delivered", "2026-09-10T17:00:00"),
            ("DC-2026-042", "2026-09-12", 1, 35000, 175, 12, "LZT-8921", "Abdul Rashid", "Golden Pearl Cosmetics", "In Transit", "2026-09-12T11:15:00"),
        ]
    else:
        # Pre-Production Setup: "Aerosol Customer", 0 finished shifts, 0 dispatches
        orders_data = [
            (
                1,
                "POF-2026-001",
                "Aerosol Customer",
                "Aerosol Container 45x160mm",
                "45x160mm",
                100000,
                0.05,
                "2026-09-12",
                "2026-10-15",
                "In Production",
                "AC-CAN-160-REV1",
                "Inaugural pre-production commercial run. Monobloc aluminum container 45x160mm.",
                "2026-09-12T08:00:00"
            )
        ]
        shifts_data = [
            ("2026-09-12", "Day", 1, "45x160mm", 0, 0, 0.0, "Pre-production tooling readiness", "Tariq Mahmood", "2026-09-12T08:00:00")
        ]
        dispatches_data = [
            ("DC-2026-001", "2026-09-12", 1, 0, 0, 0, "Line 1 - Pre-Production", "Pending Assignment", "Aerosol Customer", "Scheduled", "2026-09-12T08:00:00")
        ]
        # Full warehouse inventory ready for plant startup (all fresh batches)
        inventory_data = [
            ("501", "Aluminum Slugs", "45mm Aluminum Slug (Al99.7%)", "kg", 25000.0, 5000.0, 780.0, "SLUG-2026-08A", "2026-08-15", 1080, "Ambient Dry Store (5°C - 30°C)", "Kot Abdul Malik Central Stores", "2026-09-12T10:00:00"),
            ("502", "Extrusion Lubricant", "SAPILUB LUBRIMET GR8", "kg", 200.0, 30.0, 2400.0, "LUB-2026-04", "2026-08-15", 1080, "Ambient Dry Store (5°C - 30°C)", "Chemical Room Bay 1", "2026-09-12T10:00:00"),
            ("503", "Alkaline Cleaner", "SAPILUB ALULIQUID 13", "kg", 1500.0, 400.0, 850.0, "ALU-2026-03", "2026-08-15", 1080, "Ambient Chemical Bay (5°C - 35°C)", "Washer Chemical Storage", "2026-09-12T10:00:00"),
            ("504", "Internal Lacquer", "SCHEKOSOL INT PROT Gold (400 9 901)", "kg", 1000.0, 200.0, 3200.0, "LAC-2026-G2", "2026-08-25", 240, "Air Conditioned (20°C - 25°C)", "Cold Room Rack A1", "2026-09-12T10:00:00"),
            ("505", "Internal Lacquer", "SCHEKOSOL INT BEIGE (400 4 902)", "kg", 500.0, 150.0, 3400.0, "LAC-2026-B2", "2026-08-25", 240, "Air Conditioned (20°C - 25°C)", "Cold Room Rack A2", "2026-09-12T10:00:00"),
            ("506", "External Base Coat", "SCHEKOSOL WH BC (422 0 903)", "kg", 1200.0, 300.0, 2100.0, "BC-2026-W3", "2026-08-28", 240, "Air Conditioned (20°C - 25°C)", "Cold Room Rack B1", "2026-09-12T10:00:00"),
            ("507", "External Base Coat", "SCHEKOSOL CLEAR BC (422 9 918)", "kg", 400.0, 150.0, 2300.0, "BC-2026-C2", "2026-08-28", 180, "Air Conditioned (20°C - 25°C)", "Cold Room Rack B2", "2026-09-12T10:00:00"),
            ("508", "Overprint Varnish", "SCHEKOSOL OPV GLOSSY (422 9 900)", "kg", 800.0, 200.0, 1900.0, "OPV-2026-G4", "2026-09-01", 180, "Air Conditioned (20°C - 25°C)", "Cold Room Rack C1", "2026-09-12T10:00:00"),
            ("509", "Overprint Varnish", "SCHEKOSOL OPV SILKMATT (422 9 903)", "kg", 350.0, 150.0, 2250.0, "OPV-2026-S2", "2026-09-01", 180, "Air Conditioned (20°C - 25°C)", "Cold Room Rack C2", "2026-09-12T10:00:00"),
            ("510", "Printing Ink", "SunAltec MB PLUS 169766 Opaque White", "kg", 100.0, 20.0, 4200.0, "INK-2026-OW", "2026-08-15", 1080, "Ambient Dry Store (15°C - 30°C)", "Ink Dispensing Station", "2026-09-12T10:00:00"),
            ("599", "Printing Ink", "SunAltec MB PLUS 168391 Yellow G/S", "kg", 50.0, 15.0, 4600.0, "INK-2026-Y1", "2026-08-15", 1080, "Ambient Dry Store (15°C - 30°C)", "Ink Dispensing Station", "2026-09-12T10:00:00"),
            ("600", "Printing Ink", "SunAltec MB PLUS 168396 Magenta", "kg", 50.0, 15.0, 4800.0, "INK-2026-M1", "2026-08-15", 1080, "Ambient Dry Store (15°C - 30°C)", "Ink Dispensing Station", "2026-09-12T10:00:00"),
            ("601", "Printing Ink", "SunAltec MB PLUS 168404 Black Conc.", "kg", 60.0, 15.0, 4300.0, "INK-2026-BK", "2026-08-15", 1080, "Ambient Dry Store (15°C - 30°C)", "Ink Dispensing Station", "2026-09-12T10:00:00"),
            ("603", "Printing Ink", "SunAltec MB PLUS 168402 Reflex Blue", "kg", 50.0, 15.0, 4900.0, "INK-2026-RB", "2026-08-15", 1080, "Ambient Dry Store (15°C - 30°C)", "Ink Dispensing Station", "2026-09-12T10:00:00"),
        ]

    cur.executemany("""
    INSERT INTO orders (
        id, pof_number, customer_name, product_name, product_size, order_qty,
        tolerance_pct, order_date, due_date, status, artwork_ref, notes, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, orders_data)

    if shifts_data:
        cur.executemany("""
        INSERT INTO shifts (
            shift_date, shift_type, pof_id, product_size, good_cans, line_scrap,
            downtime_hours, downtime_reason, supervisor, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, shifts_data)

    cur.executemany("""
    INSERT INTO inventory (
        item_code, category, item_name, uom, balance_qty, min_stock_level,
        unit_cost_pkr, batch_number, received_date, shelf_life_days,
        storage_condition, location, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, inventory_data)

    if dispatches_data:
        cur.executemany("""
        INSERT INTO dispatches (
            challan_number, dispatch_date, pof_id, dispatched_cans,
            carton_count, pallet_count, vehicle_number, driver_name,
            receiver_party, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, dispatches_data)

    # 5. BOM Standards
    for size in ["45x160mm", "45x150mm"]:
        bom_calc = calculate_bom(size, 1000)
        for itm in bom_calc["items"]:
            cur.execute("""
            INSERT INTO bom_standards (
                product_size, material_group, item_code, item_name, uom,
                net_rate_per_1000, scrap_rate, gross_rate_per_1000, calculation_rule
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
            """, (
                size,
                itm["material_group"],
                itm["item_code"],
                itm["item_name"],
                itm["uom"],
                itm["net_rate_per_1000"],
                itm["scrap_pct"] / 100.0,
                itm["gross_rate_per_1000"],
                itm["formula"]
            ))

    conn.commit()
    conn.close()

def export_production_json(db_path: Optional[str] = None, json_path: Optional[str] = None, as_of_date: Optional[str] = None) -> Dict[str, Any]:
    """
    Generates the standalone JSON snapshot consumed by the frontend.
    Computes real-time KPIs, tolerance bounds, shelf-life indicators,
    and inventory days-of-stock cover.
    """
    if db_path is None:
        db_path = DB_PATH
    if json_path is None:
        json_path = JSON_PATH
    conn = get_connection(db_path)
    cur = conn.cursor()

    ref_date = date.fromisoformat(as_of_date) if as_of_date else date.today()
    ref_date_str = ref_date.isoformat()
    month_prefix = ref_date_str[:7] # e.g. "2026-09"

    # 1. Fetch Orders and calculate production progress
    cur.execute("SELECT * FROM orders ORDER BY id DESC;")
    orders_raw = [dict(r) for r in cur.fetchall()]

    orders = []
    for ord_row in orders_raw:
        cur.execute("""
        SELECT COALESCE(SUM(good_cans), 0) as total_good,
               COALESCE(SUM(line_scrap), 0) as total_scrap
        FROM shifts WHERE pof_id = ?;
        """, (ord_row["id"],))
        shift_stat = cur.fetchone()
        produced_good = shift_stat["total_good"]
        produced_scrap = shift_stat["total_scrap"]
        total_line_run = produced_good + produced_scrap

        cur.execute("""
        SELECT COALESCE(SUM(dispatched_cans), 0) as total_dispatched
        FROM dispatches WHERE pof_id = ?;
        """, (ord_row["id"],))
        disp_stat = cur.fetchone()
        dispatched_total = disp_stat["total_dispatched"]

        order_qty = ord_row["order_qty"]
        tol_pct = ord_row["tolerance_pct"]
        min_qty = math.floor(order_qty * (1.0 - tol_pct))
        max_qty = math.ceil(order_qty * (1.0 + tol_pct))
        completion_pct = round((produced_good / order_qty) * 100.0, 1) if order_qty > 0 else 0.0
        remaining_qty = max(0, order_qty - produced_good)
        scrap_pct = round((produced_scrap / total_line_run) * 100.0, 2) if total_line_run > 0 else 0.0

        orders.append({
            **ord_row,
            "produced_good": produced_good,
            "produced_scrap": produced_scrap,
            "total_line_run": total_line_run,
            "dispatched_total": dispatched_total,
            "min_acceptable_qty": min_qty,
            "max_acceptable_qty": max_qty,
            "completion_pct": completion_pct,
            "remaining_qty": remaining_qty,
            "order_scrap_pct": scrap_pct,
            "is_within_tolerance": (min_qty <= produced_good <= max_qty) if produced_good >= min_qty else False
        })

    # 2. Fetch Shifts (with joined POF info)
    cur.execute("""
    SELECT s.*, o.pof_number, o.customer_name, o.product_name
    FROM shifts s
    JOIN orders o ON s.pof_id = o.id
    ORDER BY s.shift_date DESC, s.id DESC;
    """)
    shifts_raw = [dict(r) for r in cur.fetchall()]

    shifts = []
    for s in shifts_raw:
        total_cans = s["good_cans"] + s["line_scrap"]
        scrap_pct = round((s["line_scrap"] / total_cans) * 100.0, 2) if total_cans > 0 else 0.0
        shifts.append({
            **s,
            "total_cans": total_cans,
            "scrap_pct": scrap_pct
        })

    # 3. Fetch Inventory and compute live shelf-life and daily burn cover
    cur.execute("SELECT * FROM inventory ORDER BY category ASC, item_code ASC;")
    inventory_raw = [dict(r) for r in cur.fetchall()]

    # Estimate average daily can output from the last 14 recorded production days to compute days-of-stock
    cur.execute("""
    SELECT COALESCE(SUM(good_cans), 0) as total_cans, COUNT(DISTINCT shift_date) as active_days
    FROM shifts
    WHERE shift_date >= date(?, '-14 days');
    """, (ref_date_str,))
    recent = cur.fetchone()
    avg_daily_cans = (recent["total_cans"] / recent["active_days"]) if (recent["active_days"] and recent["active_days"] > 0) else 0.0

    # Rigorous gross consumption reference rates per 1,000 cans for 45x160mm standard container
    ITEM_GROSS_RATES = {
        "501": 22.222,  # 45mm Aluminum Slug (20.0 / 0.90)
        "502": 0.0233,  # SAPILUB LUBRIMET GR8 (0.021 / 0.90)
        "503": 5.556,   # SAPILUB ALULIQUID 13 (5.0 / 0.90)
        "504": 1.6077,  # SCHEKOSOL INT PROT Gold (1.045 / 0.65)
        "505": 1.7538,  # SCHEKOSOL INT BEIGE (1.140 / 0.65)
        "506": 1.0811,  # SCHEKOSOL WH BC (0.973 / 0.90)
        "507": 0.7789,  # SCHEKOSOL CLEAR BC (0.701 / 0.90)
        "508": 0.4778,  # SCHEKOSOL OPV GLOSSY (0.430 / 0.90)
        "509": 0.4278,  # SCHEKOSOL OPV SILKMATT (0.385 / 0.90)
        "510": 0.3111,  # SunAltec Opaque White (0.280 / 0.90 per station)
        "599": 0.3111,  # SunAltec Yellow (0.280 / 0.90 per station)
        "600": 0.3111,  # SunAltec Magenta (0.280 / 0.90 per station)
        "601": 0.3111,  # SunAltec Black (0.280 / 0.90 per station)
        "603": 0.3111   # SunAltec Reflex Blue (0.280 / 0.90 per station)
    }

    inventory = []
    for item in inventory_raw:
        shelf = evaluate_shelf_life(item["received_date"], item["shelf_life_days"], ref_date_str)
        gross_rate = ITEM_GROSS_RATES.get(item["item_code"])
        if gross_rate is None:
            cat = item["category"]
            if "Slug" in cat: gross_rate = 22.222
            elif "Lubricant" in cat: gross_rate = 0.0233
            elif "Cleaner" in cat: gross_rate = 5.556
            elif "Lacquer" in cat: gross_rate = 1.6077
            elif "Base Coat" in cat: gross_rate = 1.0811
            elif "Varnish" in cat: gross_rate = 0.4778
            elif "Ink" in cat: gross_rate = 0.3111
            else: gross_rate = 0.0

        if gross_rate and avg_daily_cans > 0:
            daily_burn = round(gross_rate * (avg_daily_cans / 1000.0), 2)
            days_of_stock = round(item["balance_qty"] / daily_burn, 1) if daily_burn > 0 else 999.0
        else:
            daily_burn = 0.0
            days_of_stock = 999.0

        is_climate_sensitive = "Air Conditioned" in item["storage_condition"]

        inventory.append({
            **item,
            "shelf_evaluation": shelf,
            "daily_burn_rate": daily_burn,
            "days_of_stock": days_of_stock,
            "is_climate_sensitive": is_climate_sensitive,
            "stock_status": "Low Stock" if item["balance_qty"] <= item["min_stock_level"] else "Healthy"
        })

    # 4. Fetch Dispatches
    cur.execute("""
    SELECT d.*, o.pof_number, o.customer_name, o.product_name, o.product_size
    FROM dispatches d
    JOIN orders o ON d.pof_id = o.id
    ORDER BY d.dispatch_date DESC, d.id DESC;
    """)
    dispatches = [dict(r) for r in cur.fetchall()]

    # 5. Master Standards
    standards = {
        "45x160mm": calculate_bom("45x160mm", 100000),
        "45x150mm": calculate_bom("45x150mm", 100000),
    }

    # 6. Aggregated KPIs
    today_shifts = [s for s in shifts if s["shift_date"] == ref_date_str]
    today_good = sum(s["good_cans"] for s in today_shifts)
    today_scrap = sum(s["line_scrap"] for s in today_shifts)
    today_total = today_good + today_scrap
    today_scrap_pct = round((today_scrap / today_total) * 100.0, 2) if today_total > 0 else 0.0

    # Month to Date (MTD)
    mtd_shifts = [s for s in shifts if s["shift_date"].startswith(month_prefix)]
    mtd_good = sum(s["good_cans"] for s in mtd_shifts)
    mtd_scrap = sum(s["line_scrap"] for s in mtd_shifts)
    mtd_total = mtd_good + mtd_scrap
    mtd_scrap_pct = round((mtd_scrap / mtd_total) * 100.0, 2) if mtd_total > 0 else 0.0

    # Today's Dispatches
    today_dispatches = [d for d in dispatches if d["dispatch_date"] == ref_date_str]
    today_dispatched_cans = sum(d["dispatched_cans"] for d in today_dispatches)
    today_dispatches_count = len([d for d in today_dispatches if d.get("dispatched_cans", 0) > 0 or d.get("status") in ("Delivered", "In Transit")])

    # Active POFs
    active_pofs = [o for o in orders if o["status"] in ("In Production", "Pending")]

    # Downtime analysis
    downtime_by_reason = {}
    for s in mtd_shifts:
        reason = s.get("downtime_reason") or "Unspecified"
        if reason and reason != "None" and s.get("downtime_hours", 0.0) > 0:
            downtime_by_reason[reason] = round(downtime_by_reason.get(reason, 0.0) + s["downtime_hours"], 2)

    payload = {
        "meta": {
            "plant_name": "Alpha Aerosols",
            "location": "Kot Abdul Malik, Punjab, Pakistan",
            "as_of_date": ref_date_str,
            "generated_at": datetime.now().isoformat(),
            "version": "2.0.0",
            "sqlite_mode": "WAL"
        },
        "kpis": {
            "today_output_cans": today_good,
            "today_scrap_cans": today_scrap,
            "today_scrap_pct": today_scrap_pct,
            "mtd_output_cans": mtd_good,
            "mtd_scrap_cans": mtd_scrap,
            "mtd_scrap_pct": mtd_scrap_pct,
            "today_dispatches_cans": today_dispatched_cans,
            "today_dispatches_count": today_dispatches_count,
            "active_pofs_count": len(active_pofs),
            "downtime_hours_mtd": round(sum(s["downtime_hours"] for s in mtd_shifts), 1)
        },
        "orders": orders,
        "shifts": shifts,
        "inventory": inventory,
        "dispatches": dispatches,
        "standards": standards,
        "downtime_pareto": sorted([{"reason": k, "hours": v} for k, v in downtime_by_reason.items()], key=lambda x: x["hours"], reverse=True)
    }

    conn.close()

    # Write JSON output
    os.makedirs(os.path.dirname(json_path), exist_ok=True)
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)

    return payload

def add_shift_entry(
    shift_date: str,
    shift_type: str,
    pof_id: int,
    product_size: str,
    good_cans: int,
    line_scrap: int,
    downtime_hours: float,
    downtime_reason: str,
    supervisor: str,
    db_path: Optional[str] = None
) -> int:
    """Inserts a verified single-stage finished shift record and auto-syncs the JSON data layer."""
    if db_path is None:
        db_path = DB_PATH
    conn = get_connection(db_path)
    cur = conn.cursor()
    now_iso = datetime.now().isoformat()

    cur.execute("""
    INSERT INTO shifts (
        shift_date, shift_type, pof_id, product_size, good_cans,
        line_scrap, downtime_hours, downtime_reason, supervisor, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, (
        shift_date, shift_type, pof_id, product_size, good_cans,
        line_scrap, downtime_hours, downtime_reason, supervisor, now_iso
    ))
    shift_id = cur.lastrowid

    # Deduct raw materials consumption from live inventory based on yield-inverse formula
    bom_calc = calculate_bom(product_size, good_cans)
    for itm in bom_calc["items"]:
        consumed_qty = itm["gross_total"]
        cur.execute("""
        UPDATE inventory
        SET balance_qty = MAX(0.0, balance_qty - ?),
            updated_at = ?
        WHERE item_code = ?;
        """, (consumed_qty, now_iso, itm["item_code"]))

    conn.commit()
    conn.close()

    # Automatically refresh JSON export
    export_production_json(db_path)
    return shift_id

def create_order(
    pof_number: str,
    customer_name: str,
    product_name: str,
    product_size: str,
    order_qty: int,
    tolerance_pct: float,
    order_date: str,
    due_date: str,
    artwork_ref: str = "",
    notes: str = "",
    db_path: Optional[str] = None
) -> int:
    """Inserts a new production order."""
    if db_path is None:
        db_path = DB_PATH
    conn = get_connection(db_path)
    cur = conn.cursor()
    now_iso = datetime.now().isoformat()

    cur.execute("""
    INSERT INTO orders (
        pof_number, customer_name, product_name, product_size, order_qty,
        tolerance_pct, order_date, due_date, status, artwork_ref, notes, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'In Production', ?, ?, ?);
    """, (
        pof_number, customer_name, product_name, product_size, order_qty,
        tolerance_pct, order_date, due_date, artwork_ref, notes, now_iso
    ))
    order_id = cur.lastrowid
    conn.commit()
    conn.close()

    export_production_json(db_path)
    return order_id

def create_dispatch(
    challan_number: str,
    dispatch_date: str,
    pof_id: int,
    dispatched_cans: int,
    carton_count: int,
    pallet_count: int,
    vehicle_number: str,
    receiver_party: str,
    driver_name: str = "",
    db_path: Optional[str] = None
) -> int:
    """Inserts a new delivery challan dispatch."""
    if db_path is None:
        db_path = DB_PATH
    conn = get_connection(db_path)
    cur = conn.cursor()
    now_iso = datetime.now().isoformat()

    cur.execute("""
    INSERT INTO dispatches (
        challan_number, dispatch_date, pof_id, dispatched_cans,
        carton_count, pallet_count, vehicle_number, driver_name,
        receiver_party, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Dispatched', ?);
    """, (
        challan_number, dispatch_date, pof_id, dispatched_cans,
        carton_count, pallet_count, vehicle_number, driver_name,
        receiver_party, now_iso
    ))
    dispatch_id = cur.lastrowid
    conn.commit()
    conn.close()

    export_production_json(db_path)
    return dispatch_id

def update_order_status(pof_id: int, status: str, db_path: Optional[str] = None):
    """Updates order status and syncs the JSON data layer."""
    valid_statuses = {"In Production", "Pending", "Completed", "Cancelled", "On Hold"}
    if status not in valid_statuses:
        raise ValueError(f"Invalid status '{status}'. Valid statuses: {valid_statuses}")
    if db_path is None:
        db_path = DB_PATH
    conn = get_connection(db_path)
    try:
        cur = conn.cursor()
        cur.execute("UPDATE orders SET status = ? WHERE id = ?;", (status, pof_id))
        if cur.rowcount == 0:
            raise ValueError(f"Order ID {pof_id} not found.")
        conn.commit()
    finally:
        conn.close()

    export_production_json(db_path)

def export_job_card_excel(pof_id: int, output_path: str, db_path: Optional[str] = None) -> str:
    """
    Generates a shop-floor Job Card Excel workbook cleanly via openpyxl.
    No Excel COM automation, no win32com, zero taskkill.
    """
    if db_path is None:
        db_path = DB_PATH
    import openpyxl
    from openpyxl.styles import Font, PatternFill, Alignment, Border, Side

    conn = get_connection(db_path)
    try:
        cur = conn.cursor()
        cur.execute("SELECT * FROM orders WHERE id = ?;", (pof_id,))
        row = cur.fetchone()
        if not row:
            raise ValueError(f"Order POF ID {pof_id} not found.")
        order = dict(row)
    finally:
        conn.close()

    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Job Card"
    ws.views.sheetView[0].showGridLines = True

    # Styling definitions
    header_fill = PatternFill(start_color="12151A", end_color="12151A", fill_type="solid")
    section_fill = PatternFill(start_color="202630", end_color="202630", fill_type="solid")
    th_fill = PatternFill(start_color="2C3440", end_color="2C3440", fill_type="solid")

    font_title = Font(name="Arial", size=14, bold=True, color="FFFFFF")
    font_section = Font(name="Arial", size=11, bold=True, color="F59E0B")
    font_th = Font(name="Arial", size=10, bold=True, color="FFFFFF")
    font_bold = Font(name="Arial", size=10, bold=True, color="000000")
    font_regular = Font(name="Arial", size=10, color="000000")

    thin_border = Border(
        left=Side(style='thin', color='D0D5DD'),
        right=Side(style='thin', color='D0D5DD'),
        top=Side(style='thin', color='D0D5DD'),
        bottom=Side(style='thin', color='D0D5DD')
    )

    # Title Block
    ws.merge_cells("A1:F2")
    title_cell = ws["A1"]
    title_cell.value = "ALPHA AEROSOLS — SHOP FLOOR PRODUCTION JOB CARD"
    title_cell.font = font_title
    title_cell.fill = header_fill
    title_cell.alignment = Alignment(horizontal="center", vertical="center")

    ws["A3"] = "Document #: AER-JC-001"
    ws["A3"].font = font_bold
    ws["D3"] = f"Date Generated: {date.today().isoformat()}"
    ws["D3"].font = font_regular
    ws["F3"] = "Revision: 02"
    ws["F3"].font = font_regular

    # Section 1: Order Details
    ws.merge_cells("A5:F5")
    ws["A5"] = "1. ORDER & PRODUCT SPECIFICATIONS"
    ws["A5"].font = font_section
    ws["A5"].fill = section_fill
    ws["A5"].alignment = Alignment(indent=1)

    order_meta = [
        ("POF Number:", order["pof_number"], "Customer Name:", order["customer_name"]),
        ("Product Name:", order["product_name"], "Container Standard:", order["product_size"]),
        ("Order Quantity:", f"{order['order_qty']:,} cans", "Tolerance Bounds:", f"±{int(order['tolerance_pct']*100)}% ({int(order['order_qty']*(1-order['tolerance_pct'])):,} - {int(order['order_qty']*(1+order['tolerance_pct'])):,})"),
        ("Order Date:", order["order_date"], "Delivery Due Date:", order["due_date"]),
        ("Artwork Reference:", order.get("artwork_ref") or "Approved Art Proof", "Status:", order["status"])
    ]

    r_idx = 6
    for row_data in order_meta:
        ws.cell(row=r_idx, column=1, value=row_data[0]).font = font_bold
        ws.cell(row=r_idx, column=2, value=row_data[1]).font = font_regular
        ws.cell(row=r_idx, column=4, value=row_data[2]).font = font_bold
        ws.cell(row=r_idx, column=5, value=row_data[3]).font = font_regular
        r_idx += 1

    # Section 2: Material Requirements (Physical Yield-Inverse Mass Balance)
    r_idx += 1
    ws.merge_cells(f"A{r_idx}:F{r_idx}")
    ws.cell(row=r_idx, column=1, value="2. REQUIRED RAW MATERIALS (YIELD-INVERSE MASS BALANCE)").font = font_section
    ws.cell(row=r_idx, column=1).fill = section_fill
    ws.cell(row=r_idx, column=1).alignment = Alignment(indent=1)

    r_idx += 1
    headers = ["Item Code", "Material Group", "Item Name & Specification", "Gross Req (kg)", "UOM", "Physical Formula / Transfer Loss"]
    for col_idx, h in enumerate(headers, 1):
        c = ws.cell(row=r_idx, column=col_idx, value=h)
        c.font = font_th
        c.fill = th_fill
        c.alignment = Alignment(horizontal="center" if col_idx in (1, 4, 5) else "left")

    # Detect specific coating variants from order notes or description
    notes_lower = ((order.get("notes") or "") + " " + (order.get("product_name") or "")).lower()
    bom_options = {}
    if "silk" in notes_lower or "matt" in notes_lower:
        bom_options["varnish_type"] = "silkmatt"
    if "beige" in notes_lower:
        bom_options["lacquer_type"] = "beige"
    if "clear" in notes_lower:
        bom_options["base_coat_type"] = "clear"

    bom = calculate_bom(order["product_size"], order["order_qty"], bom_options)
    for itm in bom["items"]:
        r_idx += 1
        ws.cell(row=r_idx, column=1, value=itm["item_code"]).alignment = Alignment(horizontal="center")
        ws.cell(row=r_idx, column=2, value=itm["material_group"])
        ws.cell(row=r_idx, column=3, value=itm["item_name"])
        ws.cell(row=r_idx, column=4, value=itm["gross_total"]).alignment = Alignment(horizontal="right")
        ws.cell(row=r_idx, column=5, value=itm["uom"]).alignment = Alignment(horizontal="center")
        ws.cell(row=r_idx, column=6, value=itm["formula"])

        for c_i in range(1, 7):
            ws.cell(row=r_idx, column=c_i).border = thin_border
            ws.cell(row=r_idx, column=c_i).font = font_regular

    # Section 3: Signatures & Approvals
    r_idx += 2
    ws.merge_cells(f"A{r_idx}:F{r_idx}")
    ws.cell(row=r_idx, column=1, value="3. SHOP FLOOR QUALITY & ISSUANCE SIGN-OFF").font = font_section
    ws.cell(row=r_idx, column=1).fill = section_fill

    r_idx += 2
    ws.cell(row=r_idx, column=1, value="Prepared By (Planning):").font = font_bold
    ws.cell(row=r_idx, column=2, value="Sikander (Planning Lead)").font = font_regular
    ws.cell(row=r_idx, column=4, value="Approved By:").font = font_bold
    ws.cell(row=r_idx, column=5, value="Production Manager").font = font_regular

    r_idx += 2
    ws.cell(row=r_idx, column=1, value="Material Issued (Stores):").font = font_bold
    ws.cell(row=r_idx, column=2, value="__________________").font = font_regular
    ws.cell(row=r_idx, column=4, value="Floor Line Lead:").font = font_bold
    ws.cell(row=r_idx, column=5, value="__________________").font = font_regular

    # Column Widths
    ws.column_dimensions["A"].width = 18
    ws.column_dimensions["B"].width = 28
    ws.column_dimensions["C"].width = 38
    ws.column_dimensions["D"].width = 22
    ws.column_dimensions["E"].width = 10
    ws.column_dimensions["F"].width = 45

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    wb.save(output_path)
    return output_path

if __name__ == "__main__":
    print("Initializing Alpha Aerosols Database Engine...")
    seed_master_data()
    data = export_production_json()
    print(f"Data engine ready. Today output: {data['kpis']['today_output_cans']:,} cans.")
    print(f"JSON snapshot saved at: {JSON_PATH}")
