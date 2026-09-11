# SYSTEM CONTEXT & OPERATING RULES: ALPHA AEROSOLS (KOT ABDUL MALIK)

## 1. USER PROFILE & OPERATIONAL WORKFLOW
- **User**: Sikander
- **Role**: Planning & Procurement Lead
- **Physical Base**: Sikander sits physically at the **Alpha Aerosols Plant in Kot Abdul Malik** (new plant currently in commissioning phase).
- **Tubex Role**: Tubex is a tube manufacturing plant located in **Lahore** (making collapsible/laminate tubes). Sikander manages Tubex planning & procurement **remotely from the Aerosol plant in Kot Abdul Malik**, visiting Tubex in Lahore twice a month.
- **Decision Boundaries**: Sikander manages planning, procurement, MRP, inventory, BOM modeling, job cards, and reporting. He does **NOT** make shop-floor machinery, tooling, press settings, or curing decisions. All equipment and chemical application decisions are referred to the on-site Aerosol production team. Tailor all assistance strictly to Planning, Procurement, and Material Accounting.

## 2. THE TWO AEROSOL PROJECTS (SAME COMPANY / PLANT)
- **`C:\Aerosol`**: The **Aerosol Commissioning Plant Tracker App** (tasks, civil/machine installation milestones, Gantt tracking, PWA). Connected to `ckndr/Aerosol` (or `aerosol-tracker`).
- **`D:\Aerosol`**: The **Aerosol Operations & ERP Master Project** (manufacturing BOMs, Job Cards, SOPs, Raw Material specifications, daily production logs — modeled after the Tubex project structure in `d:\Alpha`).

## 3. BOM ARCHITECTURE & PHILOSOPHY
- **Placeholder Startup BOM**: The current `Aerosol BOM.xlsx` is a catalog/placeholder model to budget all raw materials against can volume for startup planning.
- **Commercial SKU BOMs**: Once commercial production begins, each finished product will have its own separate, SKU-specific BOM (mirroring the architecture used in Tubex). Do NOT consolidate future SKUs into a single mega-BOM.
- **Standard Container Geometry**: 
  - Primary format: 45 mm diameter × 160 mm height (0.40 mm wall).
  - Alternate format: 45 mm diameter × 150 mm height (0.35 mm wall).
- **Startup Buffers**:
  - Lacquer Scrap: 35% (yield inverse model: Net / (1 - 0.35) = 1.608 kg/1000 Gold, 1.754 kg/1000 Beige).
  - Base Coat / Varnish Scrap: 10%.
  - Ink Rate: Held at conservative 0.280 kg / 1000 cans placeholder for commissioning buffer.
  - Washer Chemical: Held at 5.0 kg / 1000 cans placeholder for commissioning buffer (bath utility charge).
  - Packaging: Excluded from placeholder BOM until customer delivery specifications (bulk pallet vs master carton) are confirmed.

## 4. CHEMICAL STORAGE SAFEGUARDS
- Schekosol Clear Base Coat (422 9 918) and Varnishes (422 9 900 / 903) have a strict 6-month shelf life and MUST be stored between 20°C–25°C. The Kot Abdul Malik chemical warehouse must maintain active air conditioning.
