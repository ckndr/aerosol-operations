"""
Test Suite for Alpha Aerosols Engine & Mass Balance Model
"""

import os
import sqlite3
import json
import unittest
from engine import (
    get_connection,
    calculate_bom,
    calculate_yield_inverse,
    evaluate_shelf_life,
    add_shift_entry,
    create_order,
    create_dispatch,
    export_job_card_excel,
    export_production_json,
    sync_excel_to_db,
    seed_master_data,
    DB_PATH,
    JSON_PATH
)

class TestAlphaAerosolsEngine(unittest.TestCase):

    def test_sqlite_wal_mode(self):
        """Verify SQLite WAL mode and foreign keys are active."""
        conn = get_connection(DB_PATH)
        cur = conn.cursor()
        cur.execute("PRAGMA journal_mode;")
        mode = cur.fetchone()[0]
        self.assertEqual(mode.lower(), "wal")

        cur.execute("PRAGMA foreign_keys;")
        fk = cur.fetchone()[0]
        self.assertEqual(fk, 1)
        conn.close()

    def test_yield_inverse_mass_balance(self):
        """
        Verify the physical yield-inverse formula:
        Req = Net / (1 - Scrap)
        """
        # Lacquer: 35% loss -> Gross = Net / (1 - 0.35) = Net / 0.65 = 1.5385 * Net
        net = 1.045
        gross = calculate_yield_inverse(net, 0.35)
        expected = net / 0.65
        self.assertAlmostEqual(gross, expected, places=5)
        # Ensure it is strictly greater than additive Net * (1 + 0.35) = 1.41075
        self.assertGreater(gross, net * 1.35)

        # Base coat: 10% loss -> Gross = Net / 0.90 = 1.1111 * Net
        net_bc = 0.973
        gross_bc = calculate_yield_inverse(net_bc, 0.10)
        self.assertAlmostEqual(gross_bc, net_bc / 0.90, places=5)

    def test_bom_45x160_calculations(self):
        """Verify 45x160mm standard container BOM matches high-end engineering specs."""
        bom = calculate_bom("45x160mm", 50000)
        items = {item["item_code"]: item for item in bom["items"]}

        # Lacquer (504): 1.045 kg/1000 net -> gross 1.608 kg/1000
        lacquer = items["504"]
        self.assertAlmostEqual(lacquer["net_rate_per_1000"], 1.045, places=2)
        self.assertAlmostEqual(lacquer["gross_rate_per_1000"], 1.608, places=2)
        self.assertEqual(lacquer["scrap_pct"], 35.0)

        # Base coat (506): 0.973 kg/1000 net -> gross 1.081 kg/1000
        bc = items["506"]
        self.assertAlmostEqual(bc["net_rate_per_1000"], 0.973, places=2)
        self.assertAlmostEqual(bc["gross_rate_per_1000"], 1.081, places=2)

        # Varnish (508): 0.430 kg/1000 net -> gross 0.478 kg/1000
        varnish = items["508"]
        self.assertAlmostEqual(varnish["net_rate_per_1000"], 0.430, places=2)
        self.assertAlmostEqual(varnish["gross_rate_per_1000"], 0.478, places=2)

        # Slugs (501): 20.0 kg/1000 net -> gross 22.222 kg/1000
        slugs = items["501"]
        self.assertAlmostEqual(slugs["gross_rate_per_1000"], 22.222, places=2)

    def test_shelf_life_categorization(self):
        """
        Verify chemical shelf-life countdown logic:
        <120d: normal (green)
        120-149d: warning (amber)
        >=150d: critical (red)
        """
        ref_date = "2026-09-12"

        # 42 days old (received 2026-08-01)
        res_normal = evaluate_shelf_life("2026-08-01", 180, ref_date)
        self.assertEqual(res_normal["status"], "normal")
        self.assertEqual(res_normal["badge_color"], "#10b981")
        self.assertEqual(res_normal["age_days"], 42)

        # 125 days old (received 2026-05-10)
        res_warning = evaluate_shelf_life("2026-05-10", 180, ref_date)
        self.assertEqual(res_warning["status"], "warning")
        self.assertEqual(res_warning["badge_color"], "#f59e0b")
        self.assertEqual(res_warning["age_days"], 125)

        # 153 days old (received 2026-04-12)
        res_critical = evaluate_shelf_life("2026-04-12", 180, ref_date)
        self.assertEqual(res_critical["status"], "critical")
        self.assertEqual(res_critical["badge_color"], "#ef4444")
        self.assertEqual(res_critical["age_days"], 153)

    def test_json_export_structure(self):
        """Verify production.json adheres to schema and contains required metrics."""
        data = export_production_json(as_of_date="2026-09-12")
        self.assertIn("meta", data)
        self.assertIn("kpis", data)
        self.assertIn("orders", data)
        self.assertIn("shifts", data)
        self.assertIn("inventory", data)
        self.assertIn("dispatches", data)

        kpis = data["kpis"]
        self.assertIn("today_output_cans", kpis)
        self.assertIn("today_scrap_pct", kpis)
        self.assertIn("mtd_output_cans", kpis)
        self.assertIn("active_pofs_count", kpis)
        self.assertIn("today_dispatches_cans", kpis)

        # Tolerance bounds on orders
        for ord_item in data["orders"]:
            self.assertIn("min_acceptable_qty", ord_item)
            self.assertIn("max_acceptable_qty", ord_item)
            self.assertIn("completion_pct", ord_item)
            self.assertIn("remaining_qty", ord_item)

    def test_job_card_generation(self):
        """Verify openpyxl job card export creates a valid excel file without COM."""
        test_out = os.path.join(os.path.dirname(__file__), 'data', 'test_job_card.xlsx')
        self.addCleanup(lambda: os.remove(test_out) if os.path.exists(test_out) else None)
        export_job_card_excel(1, test_out)
        self.assertTrue(os.path.exists(test_out))
        self.assertGreater(os.path.getsize(test_out), 4000)

    def test_fg_stock_and_latest_shift_kpis(self):
        """Verify fg_stock per order and fg_buffer_cans, latest_shift in KPIs."""
        data = export_production_json(as_of_date="2026-09-12")
        kpis = data["kpis"]
        self.assertIn("fg_buffer_cans", kpis)
        self.assertIn("fg_buffer_pallets", kpis)
        self.assertIn("latest_shift", kpis)
        self.assertIsInstance(kpis["latest_shift"], dict)
        self.assertIn("good_cans", kpis["latest_shift"])
        self.assertIn("supervisor", kpis["latest_shift"])

        for ord_item in data["orders"]:
            self.assertIn("fg_stock", ord_item)
            expected_fg = max(0, ord_item["produced_good"] - ord_item["dispatched_total"])
            self.assertEqual(ord_item["fg_stock"], expected_fg)

    def test_excel_to_sqlite_sync(self):
        """Verify synchronization of shift entries from Excel into SQLite without COM."""
        import openpyxl

        test_db = os.path.join(os.path.dirname(__file__), 'data', 'test_sync.db')
        test_json = os.path.join(os.path.dirname(__file__), 'data', 'test_sync.json')
        test_xlsx = os.path.join(os.path.dirname(__file__), 'data', 'test_entry.xlsx')

        self.addCleanup(lambda: [os.remove(p) for p in [test_db, test_db+'-wal', test_db+'-shm', test_json, test_xlsx] if os.path.exists(p)])

        # Set up a test DB
        seed_master_data(test_db, force_reseed=True, demo_data=False)

        # Create a test Excel workbook
        wb = openpyxl.Workbook()
        ws = wb.active
        ws.title = "Data_Entry"
        ws.append(["AEROSOL PLANT DAILY PRODUCTION DATA ENTRY"])
        ws.append(["Date", "Machine", "POF #", "Product Name", "PID", "Customer", "Total Production\n(pcs)", "Good Production\n(pcs)", "Rejects\n(pcs)", "Rejection\n%", "DownTime", "Remarks"])
        ws.append(["2026-09-12", "Press", "POF-2026-001", "AEROSOL CAN 45x160", 5002, "Aerosol Customer", 12400, 12000, 400, "3.23%", 0.5, "Washer nozzle clean - Tariq Mahmood"])
        wb.save(test_xlsx)

        # Run sync
        res1 = sync_excel_to_db(test_xlsx, test_db)
        self.assertEqual(res1["status"], "success")
        self.assertEqual(res1["shifts_imported"], 1)
        self.assertEqual(res1["skipped_duplicates"], 0)

        # Verify idempotence on second sync
        res2 = sync_excel_to_db(test_xlsx, test_db)
        self.assertEqual(res2["status"], "success")
        self.assertEqual(res2["shifts_imported"], 0)
        self.assertEqual(res2["skipped_duplicates"], 1)

if __name__ == "__main__":
    unittest.main()
