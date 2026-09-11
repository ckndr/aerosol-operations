# ALPHA AEROSOLS (KOT ABDUL MALIK) — MASTER PROJECT CONTEXT

**Plant**: Alpha Aerosols (Monobloc Aluminum Aerosol Cans)  
**Location**: Kot Abdul Malik, Punjab, Pakistan  
**Planning & Procurement Lead**: Sikander  
**Operating Baseline**: Sikander sits physically on-site at the Kot Abdul Malik Aerosol plant. He also manages planning & procurement for Tubex (tube plant in Lahore) remotely from this facility, visiting Tubex twice a month.  
**Status**: Plant Commissioning Phase (Commercial Launch in ~30 Days / October 2026)  
**Directory**: `d:\Aerosol`  

---

## 1. THE TWO AEROSOL PROJECTS (SAME COMPANY / PLANT)
- **`C:\Aerosol`**: The **Aerosol Commissioning Plant Tracker App** (milestones, civil work, machine installation, tasks, mobile PWA). Connected to `github.com/ckndr/Aerosol` (or `aerosol-tracker`).
- **`D:\Aerosol`**: The **Aerosol Operations & ERP Master Project** (manufacturing BOMs, Job Cards, SOPs, chemical specs, daily production logging — modeled as a sister project to Tubex `d:\Alpha`).

---

## 2. FACILITY & PRODUCTION PROCESS OVERVIEW
Alpha Aerosols manufactures monobloc aluminum aerosol containers via cold impact extrusion, internal spray lacquering, exterior base coating, multi-color dry offset printing, external protective varnishing, and necking/flanging.

### Monobloc Manufacturing Sequence:
1. **Slug Tumbling**: Aluminum slugs (99.7% purity) tumbled with Sapilub Lubrimet GR8 dry lubricant (105 g / 100 kg slugs, 15–20 min at 20 rpm).
2. **Impact Extrusion**: High-speed mechanical press impacts slug into a cylindrical can body.
3. **Trimming & Brushing**: Can cut to net height (160 mm standard) and brushed.
4. **Washing & Drying**: Continuous spray washer with Sapilub Aluliquid 13 (0.7%–1.4%, 70°C) cleans extrusion lubricants; warm air drying.
5. **Annealing**: Heat treatment (450°C–550°C) recrystallizes aluminum grain structure to ensure ductility for necking.
6. **Internal Lacquering**: Reciprocating lances spray internal epoxy-phenolic lacquer (Schekosol Gold or Beige); oven cured at 220°C–250°C.
7. **External Base Coating**: Roller coater applies White or Clear base coat; oven cured at 150°C–180°C.
8. **Decoration Printing**: Multi-color dry-offset letterpress applies brand artwork using SunAltec MB PLUS inks.
9. **Overprint Varnishing (OPV)**: Wet-on-wet protective roller application of Glossy or Silkmatt varnish.
10. **Decoration Curing Oven**: Thermal tunnel (150°C–180°C for 6–10 min).
11. **Necking & Flanging**: Multi-station progressive reduction forming the 1-inch (25.4 mm) aerosol opening and rolled curl flange.
12. **Inspection & Packing**: Optical light tester for pinholes, burst pressure testing, palletizing/cartoning.

---

## 3. FILE INVENTORY & PURPOSE
- `Aerosol BOM.xlsx`: Engineering requirement calculator and placeholder BOM across all raw materials.
- `Aerosol Raw Materials.xlsx`: Technical master catalog of chemical coatings, inks, slugs, lubricants, and shelf lives.
- `Aerosol_Job_Card.xlsx`: Production traveler and material issuance model (AER-JC-001) supporting both 45×150mm and 45×160mm.
- `Aerosol_Production_Entry.xlsx`: Daily shift data entry log filled by the on-site production executive on his PC and sent to Sikander.
- `Job Card.pdf`: Printable standard job card template.
- `TDS.pdf`: Official supplier technical data sheets (Schekolin coatings, Sun Chemical inks, Sapilub lubricants).
- `Aerosol_Can_Corrected_BOM_Calculations.docx / .pdf`: Engineering geometry and surface area basis.
- `material_flow.png`: Digital process flowchart from order receipt to dispatch.
- `SOPs/`: Standard Operating Procedures approved for planning (AER-PL-001 through AER-PL-005).
- `ERP_Archives/`: Archival storage for historical ERP warehouse and dispatch exports.

---

## 4. PLANNING & PROCUREMENT RULES
- **Role Boundary**: Sikander manages planning, procurement, MRP, and stock. Machine, tooling, and chemical curing decisions are made exclusively by the on-site Aerosol production team.
- **BOM Model**: The current BOM is a placeholder for startup volume calculations. When commercial production starts, separate SKU-specific BOMs will be created for each customer item (matching the Tubex model).
- **Standard Dimensions**:
  - Primary: 45 × 160 mm (0.40 mm wall thickness).
  - Alternate: 45 × 150 mm (0.35 mm wall thickness).
- **Scrap Factors**:
  - Slugs: 10% (press/trimmer/washer scrap).
  - Internal Lacquer: 35% (yield inverse model: Net / (1 - 0.35), accounting for lance overspray).
  - Base Coat / OPV: 10%.
- **Chemical Store Storage**: Schekosol clear base coats and varnishes have a 6-month shelf life and must be stored at 20°C–25°C under active air conditioning in the Kot Abdul Malik warehouse.
