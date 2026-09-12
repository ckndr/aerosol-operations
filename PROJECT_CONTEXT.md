# ALPHA AEROSOLS (KOT ABDUL MALIK) — MASTER PROJECT CONTEXT

**Plant**: Alpha Aerosols (Monobloc Aluminum Aerosol Cans)  
**Location**: Kot Abdul Malik, Punjab, Pakistan  
**Planning & Procurement Lead**: Sikander  
**Reporting Line**: Direct report to the **Production Manager**  
**Operating Baseline**: Sikander sits on-site at the Kot Abdul Malik plant. He also manages planning & procurement for Tubex (tube plant in Lahore) remotely from this facility, visiting Tubex twice a month.  
**Primary Project Scope**: Pure Factory Manufacturing Operations, Orders, Inventory, Dispatches, and the **Aerosol Production Web App** (`aerosol.html`).  
*(Note: All plant commissioning, civil construction, and startup task tracking belong strictly to `C:\Aerosol-Tracker` and are excluded from this project).*

---

## 1. PRODUCTION TRACKING PHILOSOPHY: SINGLE-STAGE FINISHED PRODUCT

To avoid unnecessary floor complexity and maintain clean operational data:
- **No Multi-Machine Stage Logging**: The plant does **not** log production separately at the press, trimmer, washer, annealer, lacquer, printer, and necker.
- **Final Finished Saleable Output Only**: Production is counted exclusively at the **final finished container stage** (the finished, printed, varnished, necked, and tested can ready for palletizing/packing).
- **Consolidated Line Scrap**: Any can dropped, damaged, jammed, or rejected anywhere along the continuous line counts as **Total Line Rejections / Scrap**.
- **Daily Shift Tracking**:
  - `Total Output = Good Finished Cans + Total Line Scrap`
  - `Scrap % = Total Line Scrap / Total Output`
  - Downtime hours and main downtime reasons are logged per shift.

---

## 2. THE AEROSOL PRODUCTION WEB APPLICATION (`aerosol.html`)

Engineered to replicate the proven, luxury executive experience of the Tubex plant dashboard (`Tubex.html`):

### 2.1 Visual Design & Executive Experience (Direct Tubex Style)
- **Palette**: Deep corporate navy (`#0d1f3c` to `#1a2f52`), royal blue (`#2355a0`), warm amber/gold (`#e8a020`, `#f5c842`), clean white cards (`#ffffff`), and light neutral background (`#f4f6fa`).
- **Status Badges & Pulse Dots**: Forest green (`#1a7a4a`) for on-track/good, amber (`#d97706`) for warning, crimson (`#c0392b`) for critical scrap/downtime.
- **Typography**: `DM Serif Display` for headings, `DM Sans` for UI elements, `DM Mono` for quantities, part codes, and percentages.
- **Mobile PWA Support**: Installable progressive web app with service worker (`sw.js`) and manifest (`manifest.json`) for seamless mobile viewing by management.

### 2.2 Core Operational Modules
1. **Executive Dashboard**: Top KPI summary cards showing:
   - Today's Good Finished Output (pcs)
   - Today's Line Scrap %
   - Month-to-Date Production vs. Target
   - Active POFs / Customer Orders in Progress
   - Today's Outward Dispatches
2. **Customer Orders & POF Tracker**:
   - Order book table: POF #, Customer Name, Can Size (45×160 / 45×150), Order Quantity, Tolerance %, Due Date, Produced to Date, Remaining Quantity, Status Badge.
3. **Daily Production Entry**:
   - Clean, lightweight shift logger for the on-site production executive:
     - Date & Shift
     - POF # & Customer
     - Product Size
     - Good Finished Production (pcs)
     - Total Line Scrap (pcs)
     - Downtime (Hours & Reason)
     - Shift Supervisor / Operator
4. **Raw Material Warehouse & Inventory Ledger**:
   - Live balances and days-of-stock coverage across:
     - 45mm Slugs (99.7% Aluminum)
     - Internal Lacquers (Schekosol Gold & Beige)
     - External Base Coats (Schekosol White & Clear)
     - Overprint Varnishes (Glossy & Silkmatt)
     - Printing Inks (SunAltec MB PLUS series)
     - Extrusion Lubricant (Sapilub Lubrimet GR8)
     - Washer Chemical (Sapilub Aluliquid 13)
5. **Finished Goods Dispatches**:
   - Outward delivery challan tracking: Challan #, Date, Customer, Cans Dispatched, Pallets/Boxes, Truck Number, Status.
6. **Interactive Order & BOM Simulator**:
   - Dynamic quotation estimator: Enter can quantity $\rightarrow$ calculates required slug tonnage, chemical coating kg, ink requirements, and estimated production shifts.

---

## 3. BACKEND DATA PIPELINE (`Scripts/`)
- `daily_aerosol.py`: Automated master runner.
- `update_aerosol_production.py`: Ingests daily shift entries from `Aerosol_Production_Entry.xlsx`.
- `update_aerosol_inventory.py`: Ingests warehouse stock and computes raw material balances.
- `update_aerosol_html.py`: Generates the static production data payload for `aerosol.html`.

---

## 4. MASTER FILES & DIRECTORY
- `aerosol.html`: The master factory operations web app.
- `Aerosol BOM.xlsx`: Engineering requirement calculator and placeholder BOM.
- `Aerosol Raw Materials.xlsx`: Technical master catalog of chemical coatings, inks, slugs, lubricants, and shelf lives.
- `Aerosol_Job_Card.xlsx`: Production traveler and material issuance model (AER-JC-001) supporting both 45×150mm and 45×160mm.
- `Aerosol_Production_Entry.xlsx`: Daily shift data entry template for the on-site production executive.
- `Job Card.pdf`: Printable standard job card template.
- `TDS.pdf`: Official supplier technical data sheets (Schekolin coatings, Sun Chemical inks, Sapilub lubricants).
- `Aerosol_Can_Corrected_BOM_Calculations.docx / .pdf`: Engineering geometry and surface area basis.
- `material_flow.png`: Digital process flowchart from order receipt to dispatch.
- `SOPs/`: Standard Operating Procedures approved for planning (AER-PL-001 through AER-PL-005).

---

## 5. TECHNICAL SPECIFICATIONS (LOCKED)
- **Container Geometry**: Primary standard 45 × 160 mm (0.40 mm wall); Alternate 45 × 150 mm (0.35 mm wall).
- **Lacquer Scrap Factor**: 35% (airless spray lance transfer loss model: Net / (1 - 0.35) = 1.608 kg/1000 Gold, 1.754 kg/1000 Beige).
- **Base Coat / OPV Scrap Factor**: 10%.
- **Ink Rate**: Held at 0.280 kg / 1000 cans commissioning buffer.
- **Washer Chemical Rate**: Held at 5.0 kg / 1000 cans startup buffer.
- **Chemical Storage**: Schekosol clear base coats and varnishes require 20°C–25°C air conditioning in the warehouse due to 6-month shelf life.
