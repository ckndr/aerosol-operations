# Alpha Aerosols Kot Abdul Malik (Production Operations Management)

Master manufacturing operations, ERP planning, and production portal for **Alpha Aerosols (Kot Abdul Malik)**, specializing in monobloc aluminum aerosol container production (45 × 160 mm and 45 × 150 mm).

## Operational Context
- **Plant Location**: Kot Abdul Malik, Punjab, Pakistan
- **Planning & Procurement Lead**: Sikander (On-site at Kot Abdul Malik; reports to Production Manager; manages Tubex Lahore remotely)
- **Production Tracking Scope**: **Final Finished Saleable Product Only** (Good finished cans packed vs. total line scrap; no multi-machine logging complexity).
- **Commissioning Exclusion**: All commissioning, civil, and construction milestone tracking belong strictly to `C:\Aerosol-Tracker` and are excluded from this project.
- **Primary Web Application**: `aerosol.html` (Factory Operations Management Portal)
- **System Rules**: See [AGENTS.md](file:///d:/Aerosol/AGENTS.md) and [PROJECT_CONTEXT.md](file:///d:/Aerosol/PROJECT_CONTEXT.md)

---

## The Aerosol Production Web Application (`aerosol.html`)
Faithfully replicates the proven, luxury executive aesthetic of Tubex (`Tubex.html`):
- **Design Framework**: Luxury dark navy (`#0d1f3c`) and warm gold (`#e8a020`), `DM Serif Display` and `DM Sans` typography, and fully responsive PWA support (`manifest.json`, `sw.js`).
- **Core Modules**:
  1. **Executive KPI Dashboard**: Live summary cards with colored status dots for Today's Finished Output, Line Scrap %, Month-to-Date Output, Active POFs, and Dispatches.
  2. **Customer Orders & POF Table**: Complete order management (POF #, Customer Name, Size, Order Qty, Tolerance %, Due Date, Produced to Date, Remaining Qty, Status).
  3. **Daily Production Entry**: Simplified daily finished goods shift logger (Date, POF, Good Cans, Scrap Cans, Scrap %, Downtime).
  4. **Raw Material Inventory Ledger**: Live stock balances and days-of-stock cover for Slugs, Lacquer, Base Coat, Inks, Varnish, and Lubricant.
  5. **Finished Goods Dispatches**: Delivery challan log, pallet/carton quantities, vehicle numbers, and customer delivery records.
  6. **Interactive Order & BOM Simulator**: Dynamic quotation estimator: enter can volume $\rightarrow$ calculates required slug tonnage, chemical coating kg, ink requirements, and estimated production shifts.

---

## Core Planning & Production Files
- **[Aerosol BOM.xlsx](file:///d:/Aerosol/Aerosol%20BOM.xlsx)**: Engineering requirement calculator and placeholder BOM across all raw materials.
- **[Aerosol Raw Materials.xlsx](file:///d:/Aerosol/Aerosol%20Raw%20Materials.xlsx)**: Supplier raw material catalog, film weight specs, shelf lives, and storage guidelines.
- **[Aerosol_Job_Card.xlsx](file:///d:/Aerosol/Aerosol_Job_Card.xlsx)**: Shop-floor traveler and material issuance model (AER-JC-001) supporting both 45×150mm and 45×160mm containers.
- **[Aerosol_Production_Entry.xlsx](file:///d:/Aerosol/Aerosol_Production_Entry.xlsx)**: Daily shift data entry template for the on-site production executive.
- **[Job Card.pdf](file:///d:/Aerosol/Job%20Card.pdf)**: Printable 1-page shop floor production job card.

## Technical Documentation & Basis
- **[Aerosol_Can_Corrected_BOM_Calculations.docx](file:///d:/Aerosol/Aerosol_Can_Corrected_BOM_Calculations.docx)** / **[PDF](file:///d:/Aerosol/Aerosol_Can_Corrected_BOM_Calculations.pdf)**: Surface area geometry ($0.02262\text{ m}^2$ ext, $0.02375\text{ m}^2$ int) and coating weight derivations.
- **[TDS.pdf](file:///d:/Aerosol/TDS.pdf)**: 37-page supplier technical data sheets (Schekolin coatings, Sun Chemical inks, Sapilub lubricants).
- **[material_flow.png](file:///d:/Aerosol/material_flow.png)**: Digital order-to-dispatch workflow diagram.
- **[Inroduction (1).docx](file:///d:/Aerosol/Inroduction%20(1).docx)**: Machine parameter guides and process overview.

## Standard Operating Procedures (SOPs)
- **[AER-PL-001](file:///d:/Aerosol/SOPs/AER-PL-001_Order_Receipt_and_Review.pdf)**: Order Receipt and Review
- **[AER-PL-002](file:///d:/Aerosol/SOPs/AER-PL-002_Material_Requirements_Planning.pdf)**: Material Requirements Planning (MRP)
- **[AER-PL-003](file:///d:/Aerosol/SOPs/AER-PL-003_Procurement_Requisition.pdf)**: Procurement Requisition & Purchase Ordering
- **[AER-PL-004](file:///d:/Aerosol/SOPs/AER-PL-004_Production_Planning.pdf)**: Production Planning & Scheduling
- **[AER-PL-005](file:///d:/Aerosol/SOPs/AER-PL-005_Material_Prioritization.pdf)**: Material Prioritization & Allocation
