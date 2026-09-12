# SYSTEM CONTEXT & OPERATING RULES: ALPHA AEROSOLS (KOT ABDUL MALIK)

## 1. USER PROFILE & ORGANIZATIONAL REALITY
- **User**: Sikander
- **Role**: Planning & Procurement Lead
- **Reporting Line**: Reports directly to the **Production Manager** (direct boss).
- **Executive Dynamic (The Seth & Non-Technical Partner)**:
  - Owners visit the plant rarely (2–3 times a month) and are non-technical.
  - Company culture: Do not initiate contact or bypass the direct boss. Speak when spoken to.
  - Strategy: The Production App must empower the **Production Manager** to look organized and in control before the Seth, while serving as Sikander's unshakeable proof of work if the Seth ever asks *"What do you do here?"*
- **Physical Location**: Sikander sits on-site at **Alpha Aerosols in Kot Abdul Malik** (new monobloc aluminum aerosol plant).
- **Tubex Lahore Role**: Tube manufacturing facility in Lahore. Sikander manages Tubex planning & procurement remotely from Kot Abdul Malik, visiting Tubex twice a month.
- **Strict Decision Boundary**: Sikander manages planning, procurement, MRP, raw material inventory, BOM calculations, job cards, and operations reporting. He does **NOT** make shop-floor machinery, press tuning, or curing decisions (those belong to the on-site production team).

## 2. PRODUCTION TRACKING PHILOSOPHY (SINGLE-STAGE FINISHED PRODUCT ONLY)
- **Zero Multi-Stage Complexity**: The app does **NOT** track each of the 12 intermediate machines (press, washer, annealer, etc.) individually.
- **Finished Saleable Product Only**: Production is tracked strictly at the **final finished product stage** (finished cans coming off the line ready for packing/dispatch).
- **Scrap Definition**: Only finished, good cans count as Good Production. Everything else lost anywhere along the line is aggregated as total **Line Scrap / Rejections**.
- **Core Daily Shift Metrics**:
  1. Date & Shift
  2. POF # & Customer Name
  3. Product (45×160 mm / 45×150 mm)
  4. Good Finished Production (pcs)
  5. Total Line Rejections / Scrap (pcs)
  6. Rejection % (`Rejections / Total Production`)
  7. Downtime Hours & Reason
  8. Operator / Line Lead

## 3. STRICT SEPARATION: ZERO COMMISSIONING IN THIS PROJECT
- **No Commissioning Content**: Exclude all commissioning readiness percentages, civil milestones, HVAC tasks, mechanical dry-run checklists, and construction tracking.
- **Boundary**: Commissioning belongs 100% to `C:\Aerosol-Tracker`.
- **`D:\Aerosol` Scope**: Dedicated strictly and permanently to **Factory Manufacturing Operations, Orders, Inventory, Dispatches, and BOM Planning** (identical in purpose to Tubex `d:\Alpha`).

## 4. THE AEROSOL PRODUCTION APP SPECIFICATION (`aerosol.html`)
- **Visual Design (Mirrors Tubex)**:
  - Palette: Deep Navy (`#0d1f3c`), Royal Blue (`#2355a0`), Warm Amber/Gold (`#e8a020`), Clean White cards (`#ffffff`), Light Background (`#f4f6fa`).
  - Typography: `DM Serif Display` (Titles), `DM Sans` (UI & tables), `DM Mono` (Data & figures).
  - PWA: Installable mobile app (`manifest.json`, `sw.js`).
- **Functional Modules**:
  1. **Executive Dashboard**: Top KPI grid with live colored pulse dots: Today's Finished Output, Month-to-Date Good Cans, Line Scrap %, Active POFs, and Today's Dispatches.
  2. **Orders & POF Management**: Live customer order table (POF #, Customer, Product Size, Order Qty, Tolerance %, Delivery Due Date, Completed Cans, Remaining Cans, Status Badge).
  3. **Daily Production Entry**: Clean, streamlined daily finished goods logging (Date, POF, Good pcs, Scrap pcs, Scrap %, Downtime).
  4. **Raw Material Inventory**: Real-time warehouse balances and days-of-stock for 45mm Slugs, Schekosol Lacquer, Base Coat, Inks, Varnish, and Lubricant.
  5. **Finished Goods & Dispatches**: Delivery challan log, pallet/carton quantities, vehicle numbers, and customer delivery records.
  6. **Interactive Order & BOM Simulator**: Enter can count $\rightarrow$ instantly calculates slug tons, lacquer kg, base coat kg, varnish kg, inks, and required operating shifts.

## 5. TECHNICAL SPECIFICATIONS (LOCKED)
- Container Standard: Primary 45 × 160 mm (0.40 mm wall); Alternate 45 × 150 mm (0.35 mm wall).
- Lacquer Scrap Rate: 35% (airless spray lance transfer loss model: Net / (1 - 0.35) = 1.608 kg/1000 Gold, 1.754 kg/1000 Beige).
- Base Coat & OPV Scrap Rate: 10%.
- Ink Rate: Held at 0.280 kg / 1000 cans commissioning buffer.
- Washer Chemical: Held at 5.0 kg / 1000 cans startup buffer.
- Chemical Storage: Schekosol clear base coats and varnishes require 20°C–25°C air-conditioned storage in the warehouse.
