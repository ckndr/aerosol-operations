# SYSTEM CONTEXT & OPERATING RULES: ALPHA AEROSOLS LAHORE

## 1. USER PROFILE & DECISION BOUNDARIES
- **User**: Sikander
- **Role**: Planning & Procurement Lead
- **Domain**: BOM modeling, Material Requirements Planning (MRP), procurement requisitions, material issuance (Job Cards), inventory tracking, and daily production reporting.
- **STRICT PROHIBITION**: Do NOT prompt the user to make shop-floor production, machinery, tooling, or chemical curing decisions. Sikander does NOT make production decisions; he relies on the Lahore production team for machine specs. Tailor all analysis, prompts, and questions strictly to Planning, Procurement, and Inventory.

## 2. BOM ARCHITECTURE & PHILOSOPHY
- **Placeholder Startup BOM**: The current `Aerosol BOM.xlsx` is a catalog/placeholder model to budget all raw materials against can volume for startup planning.
- **Commercial SKU BOMs**: Once commercial production begins, each finished product will have its own separate, SKU-specific BOM (mirroring the architecture used in Tubex). Do NOT attempt to consolidate all future SKUs into a single mega-BOM.
- **Standard Container Geometry**: 
  - Primary format: 45 mm diameter × 160 mm height (0.40 mm wall).
  - Alternate format: 45 mm diameter × 150 mm height (0.35 mm wall).
- **Startup Buffers**:
  - Lacquer Scrap: 35% (yield inverse model: Net / (1 - 0.35) = 1.608 kg/1000 Gold, 1.754 kg/1000 Beige).
  - Base Coat / Varnish Scrap: 10%.
  - Ink Rate: Held at conservative 0.280 kg / 1000 cans placeholder for commissioning buffer.
  - Washer Chemical: Held at 5.0 kg / 1000 cans placeholder for commissioning buffer (bath utility charge).
  - Packaging: Excluded from placeholder BOM until customer delivery specifications (bulk pallet vs master carton) are confirmed.

## 3. PLANT & GEOGRAPHIC BOUNDARIES
- **Alpha Aerosols**: Monobloc Aluminum Can Plant located in Lahore.
- **Tubex**: Plastic/Laminate Tube Plant located at F-194, S.I.T.E., Karachi (1,200 km away).
- Completely separate entities, separate ERP databases, separate store keepers, and separate daily production logs. Never mix files or scripts between them.

## 4. CHEMICAL STORAGE SAFEGUARDS
- Schekosol Clear Base Coat (422 9 918) and Varnishes (422 9 900 / 903) have a strict 6-month shelf life and MUST be stored between 20°C–25°C. The Lahore chemical store must have active air conditioning.
