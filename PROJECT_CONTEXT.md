# ALPHA AEROSOLS (KOT ABDUL MALIK) — MASTER PROJECT CONTEXT

**Plant**: Alpha Aerosols (Monobloc Aluminum Aerosol Cans)  
**Location**: Kot Abdul Malik, Punjab, Pakistan  
**Planning & Procurement Lead**: Sikander  
**Reporting Line**: Direct report to the **Production Manager**  
**Operating Baseline**: Sikander sits on-site at the Kot Abdul Malik plant. He also manages planning & procurement for Tubex (tube plant in Lahore) remotely from this facility, visiting Tubex twice a month.  
**Commercial Launch Target**: ~30 Days (October 2026)  
**Primary Project Scope**: Standalone Operations, BOMs, Job Cards, and the **Aerosol Production & Operations Web App** (`aerosol.html`).

---

## 1. THE AEROSOL OPERATIONS MANAGEMENT PORTAL (`aerosol.html`)

The central digital asset of `D:\Aerosol` is the **Aerosol Production & Operations Web Application**, engineered to mirror the proven, robust architecture of the Tubex plant dashboard while tailored specifically to monobloc aluminum can manufacturing and commissioning readiness.

### 1.1 Visual Design & Executive Experience (Inherited from Tubex)
- **Design Language**: Luxury industrial palette matching Tubex:
  - Background & Surface: High-contrast light background (`#f4f6fa`), clean white cards (`#ffffff`), subtle borders (`#dde3ef`).
  - Header & Accents: Deep corporate navy gradient (`#0d1f3c` to `#1a2f52`), royal blue (`#2355a0`), and warm amber/gold accents (`#e8a020`, `#f5c842`).
  - Metric Alert Colors: Forest green (`#1a7a4a` / `#edf7f1`), amber warning (`#d97706` / `#fff7ed`), critical red (`#c0392b` / `#fff0ee`).
- **Typography Hierarchy**:
  - `DM Serif Display`: Executive page and section titles.
  - `DM Sans`: Crisp, modern body and table typography.
  - `DM Mono`: Tabular figures, part numbers, scrap percentages, and timestamps.
- **Mobile PWA Architecture**: Fully responsive, offline-capable progressive web application (`manifest.json`, `sw.js`) installable on iOS and Android.

### 1.2 Core Operational Modules (Ported from Tubex)
1. **Executive KPI Dashboard**:
   - High-level KPI cards with colored pulse dots: Today's Output, Good Cans, Shift Scrap %, Line Speed / OEE, Monthly Target Progress, and Dispatches.
2. **Customer Orders & Production Orders (POFs)**:
   - Live order book table: POF #, Customer Name, Can Size (45×160 / 45×150), Order Quantity, Tolerance %, Artwork Approval, Scheduled Due Date, Completion %, Status.
3. **Daily Shift Production & Machine Logging**:
   - Granular machine stage breakdown:
     - *Stage 1*: Extrusion & Wash (Tumbler, Press, Trimmer, Washer, Annealer).
     - *Stage 2*: Coating & Decoration (Internal Lacquer, Base Coater, Printer, OPV Coater, Oven).
     - *Stage 3*: Finishing & Packing (Necking, Flanging, Light Tester, Palletizer).
   - Tracks operator, gross stroke count, good cans, rejects, downtime hours, and downtime reasons.
4. **Raw Material Warehouse & Inventory Tracking**:
   - Stock on hand (kg / pcs), daily consumption rates, safety buffer thresholds, and re-order triggers across:
     - 45mm Slugs (99.7% Al)
     - Internal Lacquers (Schekosol Gold & Beige)
     - Base Coats (Schekosol White & Clear)
     - Overprint Varnishes (Glossy & Silkmatt)
     - Inks (SunAltec MB PLUS 12-color series)
     - Washer Detergent (Sapilub Aluliquid 13)
     - Extrusion Lubricant (Sapilub Lubrimet GR8)
5. **Quality & Scrap Pareto Analysis**:
   - Systematic scrap categorization to pinpoint machine root causes:
     - *Extrusion split, Trimmer burr, Washer oil stain, Lacquer blister/void, Print smudge/color variance, Neck wrinkle, Flange crack*.
6. **Finished Goods & Dispatch Logistics**:
   - Outward delivery challan tracking, palletization numbers, truck registration, customer delivery status, and cumulative shipment reconciliation.

### 1.3 Commissioning & Pre-Production Enhancements (Kot Abdul Malik Startup)
Because the plant is in its final 30 days before commercial production, the app features an **Executive Readiness View** so that visiting owners and partners see active, sophisticated operational control instead of empty tables:
1. **Commercial Launch Readiness Gauge (84%)**:
   - High-visibility executive progress bar with drill-down into Mechanical Dry Runs (80%), Chemical Warehouse Stocking (100%), Tooling Setup (90%), and Trial Batch Quality (In Progress).
2. **Raw Material Runway (Days of Production)**:
   - Translates raw inventory directly into operational running days (e.g. *20 Tons Slugs = 14 Days of continuous 2-shift running / ~900,000 cans*).
   - Active warehouse climate safeguard monitor (*Chemical store AC status: 22°C — 100% shelf life protected*).
3. **12-Machine Monobloc Line Matrix**:
   - Interactive status cards across all 12 machines displaying mechanical calibration status, operator allocation, and design speeds (120–150 cpm).
4. **Commissioning Quality Trial Log**:
   - Logs for physical quality trials: WACO Enamel Rater porosity ($<5\text{ mA}$ at 6.3V), hydraulic buckling/burst pressure ($\ge 12\text{ / }18\text{ bar}$), and MEK solvent double-rub ink test (20 rubs).
5. **Interactive Client Order & BOM Simulator**:
   - Drag-and-drop / slider quoting tool: Enter can volume $\rightarrow$ instantly calculates aluminum slug requirements (Tons), coating consumption (kg), ink demand, and scheduled machine shifts.
6. **Instant Go-Live Mode Switch**:
   - A single setting that switches the primary view from "Pre-Launch Readiness" to "Live Factory Operations" the moment commercial production begins.

---

## 2. BACKEND AUTOMATION ARCHITECTURE (`Scripts/`)
- `daily_aerosol.py`: Master automated pipeline script.
- `update_aerosol_production.py`: Ingests `Aerosol_Production_Entry.xlsx` filled by the on-site production executive.
- `update_aerosol_inventory.py`: Ingests store ledger balances and updates material runway metrics.
- `update_aerosol_html.py`: Compiles calculations into static JSON payloads for lightning-fast, offline-capable mobile rendering.

---

## 3. FILE DIRECTORY & INVENTORY
- `aerosol.html`: The master production and operations web application.
- `Aerosol BOM.xlsx`: Engineering requirement calculator and placeholder BOM.
- `Aerosol Raw Materials.xlsx`: Technical master catalog of chemical coatings, inks, slugs, lubricants, and shelf lives.
- `Aerosol_Job_Card.xlsx`: Production traveler and material issuance model (AER-JC-001) supporting both 45×150mm and 45×160mm.
- `Aerosol_Production_Entry.xlsx`: Daily shift data entry template for the on-site production executive.
- `Job Card.pdf`: Printable standard job card template.
- `TDS.pdf`: Official supplier technical data sheets (Schekolin coatings, Sun Chemical inks, Sapilub lubricants).
- `Aerosol_Can_Corrected_BOM_Calculations.docx / .pdf`: Engineering geometry and surface area basis.
- `material_flow.png`: Digital process flowchart from order receipt to dispatch.
- `SOPs/`: Standard Operating Procedures approved for planning (AER-PL-001 through AER-PL-005).
- `ERP_Archives/`: Archival storage for historical warehouse and dispatch exports.

---

## 4. TECHNICAL & PLANNING SPECIFICATIONS (LOCKED)
- **Container Formats**: Primary standard 45 × 160 mm (0.40 mm wall); Alternate 45 × 150 mm (0.35 mm wall).
- **Lacquer Scrap Factor**: 35% (yield inverse model: Net / (1 - 0.35) = 1.608 kg/1000 Gold, 1.754 kg/1000 Beige).
- **Base Coat / OPV Scrap Factor**: 10%.
- **Ink Rate**: Held at 0.280 kg / 1000 cans conservative commissioning buffer.
- **Washer Chemical Rate**: Held at 5.0 kg / 1000 cans initial charge/buffer.
- **Chemical Storage**: Schekosol clear base coats and varnishes require 20°C–25°C air conditioning in the warehouse due to 6-month shelf life.
