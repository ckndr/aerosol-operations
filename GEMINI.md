# SYSTEM CONTEXT & OPERATING RULES: ALPHA AEROSOLS (KOT ABDUL MALIK)

## 1. USER PROFILE & ORGANIZATIONAL REALITY
- **User**: Sikander
- **Role**: Planning & Procurement Lead
- **Reporting Line**: Reports directly to the **Production Manager** (who is his direct boss).
- **Executive Dynamic (The Seth & Non-Technical Partner)**:
  - Owners visit the plant rarely (2–3 times a month) and are non-technical.
  - Company culture: Do not initiate contact or bypass the direct boss. Speak when spoken to.
  - Strategy: The Production App must empower the **Production Manager** to look organized and in control before the Seth, while serving as Sikander's unshakeable proof of work if the Seth ever asks *"What do you do here?"*
- **Physical Location**: Sikander sits on-site at **Alpha Aerosols in Kot Abdul Malik** (new monobloc aluminum aerosol plant, commissioning phase, commercial launch in ~30 days / October 2026).
- **Tubex Lahore Role**: Tube manufacturing facility in Lahore. Sikander manages Tubex planning & procurement remotely from Kot Abdul Malik, visiting Tubex twice a month.
- **Strict Decision Boundary**: Sikander manages planning, procurement, MRP, raw material inventory, BOM calculations, job cards, and operations reporting. He does **NOT** make shop-floor machinery, press tuning, or curing decisions (those belong to the on-site production/technical team).

## 2. THE AEROSOL PRODUCTION & OPERATIONS APP (D:\Aerosol)
The primary focus of this project is the permanent **Aerosol Operations Management Portal** (`aerosol.html`), engineered by Sikander for the Kot Abdul Malik facility.

### A. Visual & UI Framework (Faithfully Ported from Tubex)
- **Executive Theme**: Deep Navy (`#0d1f3c`, `#1a2f52`), Industrial Blue (`#2355a0`), Accent Amber/Gold (`#e8a020`, `#f5c842`), Clean Whites & Light Greys (`#f4f6fa`, `#ffffff`).
- **Typography**: `DM Serif Display` for elegant titles, `DM Sans` for UI elements, `DM Mono` for figures, codes, and timestamps.
- **Header & Navigation**: Executive top bar with plant badge, last updated timestamp, status indicator, and mobile-friendly tab navigation.
- **Mobile PWA Support**: Manifest, service worker (`sw.js`), and offline capability installable directly to mobile home screens.

### B. Core Operational Modules (Ported from Tubex)
1. **Executive Dashboard**: Top KPI grid with color-coded dot badges, daily total production, good cans, scrap %, machine efficiency (OEE), and monthly progress.
2. **Customer Orders & POFs**: Comprehensive order tracking table (POF #, Customer, Size, Order Qty, Tolerance %, Due Date, Production %, Status).
3. **Daily Shift Production Entry**: Detailed shift-wise logs by machine stage (Extrusion & Wash, Coating & Printing, Finishing & Packing), logging operator, runtime, downtime reason, good cans, and scrap count.
4. **Raw Material Warehouse & Inventory**: Physical stock levels, unit consumption rates, daily burn, safety buffer alerts, and inward shipment history.
5. **Quality & Scrap Pareto Analysis**: Categorized rejection tracking (*Extrusion split, Trimmer burr, Washer oil stain, Lacquer blister, Print smudge, Neck wrinkle, Flange crack*).
6. **Dispatches & Finished Goods**: Delivery challans, palletization counts, vehicle numbers, and customer delivery logs.

### C. Pre-Production & Commissioning Enhancements (Aerosol Startup Phase)
Because commercial production launches in ~30 days, the app features a **Dual-Mode Architecture** to ensure high executive visibility immediately without displaying "empty zeros":
1. **Plant Launch Readiness Gauge (Phase 1 / Pre-Production Mode)**:
   - High-impact visual gauge: **"Overall Commercial Launch Readiness: 84%"**
   - Progress sub-gauges: *Mechanical Dry Runs: 80% | Chemical Warehouse: 100% | Tooling Locked: 90% | Trial Batch Sign-off: In Progress*.
2. **Raw Material Runway (Days of Production)**:
   - Dynamic calculation converting raw material inventory into continuous operating capacity (e.g. *20,000 kg Slugs = 14 Days of 2-shift running / ~900,000 cans*).
   - Warehouse Climate Watch: *Chemical Store Temperature: 22°C (AC active — 100% shelf life protected)*.
3. **12-Machine Monobloc Line Matrix**:
   - Interactive status cards for all 12 machines (Tumbler, Press, Trimmer, Washer, Annealer, Lacquer Spray, Base Coater, Printer, OPV Coater, Oven, Necking, Packing) displaying calibration parameters and commissioning test results.
4. **Commissioning Quality Trial Log**:
   - Verification logs for physical quality checks: WACO Enamel Rater porosity ($<5\text{ mA}$), Buckling/Burst pressure ($\ge 12\text{ / }18\text{ bar}$), and MEK solvent double-rub test (20 rubs).
5. **Interactive Customer Order & BOM Simulator**:
   - Live client quoting and material estimator: Enter can count $\rightarrow$ instantly calculates aluminum slugs (Tons), internal lacquer (kg), inks, varnishes, and required operating shifts.
6. **Instant Go-Live Toggle**:
   - On Day 1 of commercial production, a simple toggle seamlessly switches the default view to the live daily production and dispatch tracker.

### D. Automated Daily Data Pipeline (`Scripts/`)
- `daily_aerosol.py`: Central master execution script.
- `update_aerosol_production.py`: Ingests shift data from `Aerosol_Production_Entry.xlsx` filled by the on-site production executive.
- `update_aerosol_inventory.py`: Ingests warehouse stock and calculates material runway.
- `update_aerosol_html.py`: Generates the static production data payload for `aerosol.html`.

## 3. BOM & TECHNICAL SPECIFICATIONS
- Container Geometry: 45 mm diameter × 160 mm height (0.40 mm wall thickness). Alternate: 45 × 150 mm (0.35 mm wall).
- Lacquer Scrap Rate: 35% (yield inverse model: Net / (1 - 0.35) = 1.608 kg/1000 Gold, 1.754 kg/1000 Beige).
- Base Coat & OPV Scrap Rate: 10%.
- Ink Consumption Rate: Held at 0.280 kg / 1000 cans commissioning buffer.
- Washer Chemical (Sapilub Aluliquid 13): Held at 5.0 kg / 1000 cans startup buffer.
