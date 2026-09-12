# Alpha Aerosols Kot Abdul Malik (Production Operations Management v2.0)

Master manufacturing operations, ERP planning, and production portal for **Alpha Aerosols (Kot Abdul Malik)**, specializing in monobloc aluminum aerosol container production (45 × 160 mm and 45 × 150 mm).

## Operational Context
- **Plant Location**: Kot Abdul Malik, Punjab, Pakistan
- **Planning & Procurement Lead**: Sikander (On-site at Kot Abdul Malik; reports to Production Manager; manages Tubex Lahore remotely)
- **Production Tracking Scope**: **Final Finished Saleable Product Only** (Good finished cans packed vs. total line scrap; no multi-machine logging complexity).
- **Commissioning Exclusion**: All commissioning, civil, and construction milestone tracking belong strictly to `C:\Aerosol-Tracker` and are excluded from this project.
- **Primary Web Application**: `aerosol.html` (Factory Operations Management Portal)
- **System Rules**: See [AGENTS.md](file:///d:/Aerosol/AGENTS.md) and [PROJECT_CONTEXT.md](file:///d:/Aerosol/PROJECT_CONTEXT.md)

---

## Modernized v2.0 Architecture (Anti-Tubex Standards)
1. **Decoupled UI & Data**: Clean semantic HTML shell (< 400 lines) with asynchronous JSON fetching (`fetch('./data/production.json')`). Zero 264 KB spliced JSON strings.
2. **Embedded SQLite Engine (`aerosol.db`)**: Single source of truth with WAL mode. Zero Windows Excel COM automation, zero `taskkill /f /im excel.exe`.
3. **Non-Disruptive PWA Lifecycle**: Safe Cache-First/Network-First caching with toast notifications. No `controllerchange` page reloads.
4. **Dynamic ISO-8601 Temporal Model**: Standard date sorting and grouping with zero hardcoded month ceilings.
5. **Bidirectional Web Portal**: Touch-friendly on-site shift logging and POF creation with offline `IndexedDB` resilience.
6. **Physical Yield-Inverse Mass Balance**: Accurate chemical coating formulas enforcing $\text{Net} / (1 - \text{Scrap})$ (35% lacquer, 10% base coat/OPV).
7. **Chemical Shelf-Life Tracking**: Automated 6-month countdown alerts (amber at 120d, red at 150d) and warehouse AC alerts.
8. **Bespoke Industrial Aesthetic**: Cool brushed graphite/steel (`#12151a`), safety amber (`#f59e0b`), emerald (`#10b981`), `JetBrains Mono` and `Inter` typography.

---

## Core Operational Modules
1. **Executive KPI Dashboard**: Live summary cards with colored status dots for Today's Finished Output, Line Scrap %, Month-to-Date Output, Active POFs, and Dispatches.
2. **Customer Orders & POF Table**: Complete order management (POF #, Customer Name, Size, Order Qty, Tolerance %, Due Date, Produced to Date, Remaining Qty, Status).
3. **Daily Production Entry**: Simplified daily finished goods shift logger (Date, POF, Good Cans, Scrap Cans, Scrap %, Downtime).
4. **Raw Material Inventory Ledger**: Live stock balances, shelf-life countdowns, and days-of-stock cover for Slugs, Lacquer, Base Coat, Inks, Varnish, and Lubricants.
5. **Finished Goods Dispatches**: Delivery challan log, pallet/carton quantities, vehicle numbers, and customer delivery records.
6. **Interactive Order & BOM Simulator**: Dynamic quotation estimator: enter can volume $\rightarrow$ calculates required slug tonnage, chemical coating kg, ink requirements, and estimated production shifts.

---

## Core Planning & Production Files
- **[Aerosol BOM.xlsx](file:///d:/Aerosol/Aerosol%20BOM.xlsx)**: Engineering requirement calculator and placeholder BOM across all raw materials.
- **[Aerosol Raw Materials.xlsx](file:///d:/Aerosol/Aerosol%20Raw%20Materials.xlsx)**: Supplier raw material catalog, film weight specs, shelf lives, and storage guidelines.
- **[Aerosol_Job_Card.xlsx](file:///d:/Aerosol/Aerosol_Job_Card.xlsx)**: Shop-floor traveler and material issuance model (AER-JC-001) supporting both 45×150mm and 45×160mm containers.
- **[Aerosol_Production_Entry.xlsx](file:///d:/Aerosol/Aerosol_Production_Entry.xlsx)**: Daily shift data entry template for the on-site production executive.
- **[Job Card.pdf](file:///d:/Aerosol/Job%20Card.pdf)**: Printable 1-page shop floor production job card.
- **[TDS.pdf](file:///d:/Aerosol/TDS.pdf)**: 37-page supplier technical data sheets (Schekolin coatings, Sun Chemical inks, Sapilub lubricants).
- **[Aerosol_Can_Corrected_BOM_Calculations.docx](file:///d:/Aerosol/Aerosol_Can_Corrected_BOM_Calculations.docx)** / **[PDF](file:///d:/Aerosol/Aerosol_Can_Corrected_BOM_Calculations.pdf)**: Surface area geometry and coating derivations.
- **[material_flow.png](file:///d:/Aerosol/material_flow.png)**: Digital order-to-dispatch workflow diagram.
- **[SOPs/](file:///d:/Aerosol/SOPs/)**: Approved Standard Operating Procedures (AER-PL-001 through AER-PL-005).
