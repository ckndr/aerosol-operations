# ALPHA AEROSOLS (KOT ABDUL MALIK) — MASTER PROJECT CONTEXT

**Plant**: Alpha Aerosols (Monobloc Aluminum Aerosol Cans)  
**Location**: Kot Abdul Malik, Punjab, Pakistan  
**Planning & Procurement Lead**: Sikander  
**Reporting Line**: Direct report to the **Production Manager**  
**Operating Baseline**: Sikander sits on-site at the Kot Abdul Malik plant. He also manages planning & procurement for Tubex (tube plant in Lahore) remotely from this facility, visiting Tubex twice a month.  
**Primary Project Scope**: Pure Factory Manufacturing Operations, Orders, Inventory, Dispatches, and the **Aerosol Production Web Application** (`aerosol.html`).  
*(Note: All plant commissioning, civil construction, and startup task tracking belong strictly to `C:\Aerosol-Tracker` and are excluded from this project).*

---

## 1. PRODUCTION TRACKING PHILOSOPHY: SINGLE-STAGE FINISHED PRODUCT

To eliminate floor logging friction and maintain clean operational data:
- **No Multi-Machine Stage Logging**: The plant does **not** log production separately at the press, trimmer, washer, annealer, lacquer, printer, and necker.
- **Final Finished Saleable Output Only**: Production is counted exclusively at the **final finished container stage** (the finished, printed, varnished, necked can ready for palletizing/packing).
- **Consolidated Line Scrap**: Any can dropped, damaged, jammed, or rejected anywhere along the continuous line counts as **Total Line Rejections / Scrap**.
- **Daily Shift Tracking**:
  - `Total Output = Good Finished Cans + Total Line Scrap`
  - `Scrap % = Total Line Scrap / Total Output`
  - Downtime hours and main downtime reasons are logged per shift.

---

## 2. AEROSOL v2.0 ARCHITECTURAL BLUEPRINT (THE ANTI-TUBEX STANDARDS)

The Aerosol Production Web Application (`aerosol.html`) and its backend data engine are built on modern, clean software engineering standards, explicitly correcting the 8 legacy flaws in Tubex:

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                        ALPHA AEROSOLS MODERNIZED ARCHITECTURE                           │
└─────────────────────────────────────────────────────────────────────────────────────────┘

  [On-Site Shift Logger]        [Challan & ERP Exports]         [Master BOM & Specs]
   (Floor Tablet / Web UI)       (Slugs, Coatings, Boxes)        (45x160mm, 45x150mm)
             │                              │                              │
             ▼                              ▼                              ▼
  ┌─────────────────────────────────────────────────────────────────────────────────────┐
  │                 PYTHON CORE ENGINE / REST API (FastAPI + SQLite)                    │
  │  - Single Source of Truth: aerosol.db (SQLite with WAL mode, foreign keys, ACID)     │
  │  - Strict Data Contracts: Pydantic models (ShiftEntry, OrderPOF, ChemicalBatch)     │
  │  - Physical Mass-Balance Engine: Yield-inverse coating formulas (1 / (1 - S))       │
  │  - Zero Windows COM Automation: No win32com, zero taskkill /f /im excel.exe         │
  └─────────────────────────────────────────────────────────────────────────────────────┘
                                            │
                                            ▼ (Clean Decoupled REST / Static JSON)
  ┌─────────────────────────────────────────────────────────────────────────────────────┐
  │                     MODULAR FRONTEND WEB APPLICATION (PWA)                          │
  │  - index.html: Semantic HTML shell (< 400 lines), zero embedded JSON data strings    │
  │  - css/app.css: Brushed metallic industrial styling (Graphite #12151a, Amber #f59e0b)│
  │  - js/router.js: Hash routing (#dashboard, #orders, #entry, #inventory, #simulator) │
  │  - js/state.js: Central reactive state store; debounced inputs; event delegation    │
  │  - js/components/: Modular renderers (dashboard.js, orders.js, shift_entry.js)      │
  │  - sw.js: Safe Cache-First for static assets; Network-First for API/JSON data       │
  └─────────────────────────────────────────────────────────────────────────────────────┘
```

### 2.1 Decoupled Data Layer (SQLite Engine replacing Fragile Excel DB)
- **Single Source of Truth**: `d:\Aerosol\Data\aerosol.db` (SQLite with WAL mode).
- **Core Schema**:
  - `orders`: `id`, `pof_number`, `customer_name`, `product_size`, `order_qty`, `tolerance_pct`, `due_date`, `status`.
  - `shifts`: `id`, `shift_date`, `shift_type`, `pof_id`, `good_cans`, `line_scrap`, `downtime_hours`, `downtime_reason`, `supervisor`.
  - `inventory`: `id`, `item_code`, `category`, `item_name`, `uom`, `balance_qty`, `received_date`, `shelf_life_days`, `storage_condition`.
  - `dispatches`: `id`, `challan_number`, `dispatch_date`, `pof_id`, `dispatched_cans`, `carton_count`, `vehicle_number`.
- **Zero Windows COM Automation**: No Excel process locks, no `taskkill /f /im excel.exe`.
- **Export Artifacts**: Excel workbooks (`Aerosol_Job_Card.xlsx`) are generated purely as clean, read-only exports via `openpyxl`.

### 2.2 Decoupled Frontend Shell (< 400 lines)
- **Zero Monolithic String Splicing**: Data is never injected into HTML comments (`/* DATA_START */`).
- **Dynamic Asynchronous Fetch**: The frontend fetches data dynamically via `fetch('./data/production.json')`. Daily script updates only rewrite the compact data file; the web shell remains cached and untouched.
- **Deterministic Service Worker**: Cache-First for code; Network-First for data. No `self.skipWaiting()` force-reloads. Displays a non-disruptive toast: *"App updated — [Tap to Refresh]"*.

### 2.3 True Physical Yield-Inverse Mass Balance
- In aerosol manufacturing, internal lacquer has a **35% airless spray transfer loss**.
- The model enforces true yield-inverse mass balance:
  $$\text{Gross Requirement} = \frac{\text{Net Film Spec}}{1 - \text{Transfer Loss}}$$
  $$\text{Internal Lacquer (kg)} = \frac{\text{Good Cans} \times \text{Net Spec}}{1000 \times (1 - 0.35)} = 1.5385 \times \text{Net}$$
  $$\text{Base Coat / OPV (kg)} = \frac{\text{Good Cans} \times \text{Net Spec}}{1000 \times (1 - 0.10)} = 1.1111 \times \text{Net}$$
- Eliminates the 12.25% chemical under-procurement deficit caused by Tubex’s additive formula.

### 2.4 Chemical Shelf-Life & Temperature Tracking
- Schekosol base coats and varnishes require 20°C–25°C air-conditioned storage and have a strict 180-day shelf life.
- The inventory module automatically tracks batch receipt dates and displays countdown alerts:
  - 🟢 Normal: $<120\text{ days}$
  - 🟡 Warning: $\ge 120\text{ days}$
  - 🔴 Critical: $\ge 150\text{ days}$ (approaching expiration)

### 2.5 Bespoke Industrial Visual Identity (Zero AI Slop)
- Replaces generic AI-slop navy/purple SaaS templates with an authentic industrial manufacturing aesthetic:
  - **Base Palette**: Cool brushed graphite / aluminum steel (`#12151a` dark mode or `#f1f3f6` high-contrast daylight factory white).
  - **Accent Colors**: Industrial safety amber/orange (`#f59e0b`) and precision emerald (`#10b981`).
  - **Typography**: `JetBrains Mono` for tabular figures and codes, `Inter` for UI elements, `DM Serif Display` for executive titles.

---

## 3. CORE WEB MODULES (`aerosol.html`)

1. **Executive KPI Dashboard**: Live summary cards with colored status dots for Today's Finished Output, Line Scrap %, Month-to-Date Output, Active POFs, and Today's Dispatches.
2. **Customer Orders & POF Table**: Complete order management (POF #, Customer Name, Size, Order Qty, Tolerance %, Due Date, Produced to Date, Remaining Qty, Status).
3. **Daily Production Entry**: Simplified daily finished goods shift logger (Date, Shift, POF, Good Cans, Scrap Cans, Scrap %, Downtime).
4. **Raw Material Inventory Ledger**: Live stock balances, shelf-life countdowns, and days-of-stock cover for Slugs, Lacquer, Base Coat, Inks, Varnish, and Lubricants.
5. **Finished Goods Dispatches**: Delivery challan log, pallet/carton quantities, vehicle numbers, and customer delivery records.
6. **Interactive Order & BOM Simulator**: Dynamic quotation estimator: enter can volume $\rightarrow$ calculates required slug tonnage, chemical coating kg, ink requirements, and estimated production shifts.

---

## 4. TECHNICAL SPECIFICATIONS (LOCKED)
- **Container Geometry**: Primary standard 45 × 160 mm (0.40 mm wall); Alternate 45 × 150 mm (0.35 mm wall).
- **Lacquer Scrap Factor**: 35% (airless spray lance transfer loss model).
- **Base Coat / OPV Scrap Factor**: 10%.
- **Ink Rate**: Held at 0.280 kg / 1000 cans commissioning buffer.
- **Washer Chemical Rate**: Held at 5.0 kg / 1000 cans startup buffer.
- **Chemical Storage**: Schekosol clear base coats and varnishes require 20°C–25°C air conditioning in the warehouse due to 6-month shelf life.
