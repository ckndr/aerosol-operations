# SYSTEM CONTEXT & OPERATING RULES: ALPHA AEROSOLS (KOT ABDUL MALIK)

## 1. USER PROFILE & ORGANIZATIONAL REALITY
- **User**: Sikander
- **Role**: Planning & Procurement Lead
- **Reporting Line**: Reports directly to the **Production Manager** (who is his direct boss).
- **Executive Dynamic (The Seth & Non-Technical Partner)**:
  - Owners visit the plant rarely (2–3 times a month) and are non-technical.
  - Company culture: Do not initiate contact or bypass the direct boss. Speak when spoken to.
  - Strategy: Any tool, report, or dashboard must empower the **Production Manager** to look organized and in control before the Seth, while serving as Sikander's unshakeable proof of work if the Seth ever asks *"What do you do here?"*
- **Physical Location**: Sikander sits on-site at **Alpha Aerosols in Kot Abdul Malik** (new monobloc aluminum aerosol plant, commissioning phase, launch in ~30 days / October 2026).
- **Tubex Lahore Role**: Tube manufacturing facility in Lahore. Sikander manages Tubex planning & procurement remotely from Kot Abdul Malik, visiting Tubex twice a month.
- **Strict Decision Boundary**: Sikander manages planning, procurement, MRP, raw material inventory, BOM calculations, job cards, and operations reporting. He does **NOT** make shop-floor machinery, press tuning, or curing decisions (those belong to the on-site production/technical team).

## 2. THE TWO AEROSOL PROJECTS & THEIR ROLES
- **`C:\Aerosol-Tracker` (Commissioning Tracker App)**:
  - Original Purpose: Created at the request of the Production Manager for internal team tracking (Production, Mechanical, Electrical). Usage gradually slowed as physical work intensified.
  - Current Role: Maintained as a private, secondary reference for civil/HVAC/machine delivery milestones.
  - Remote: `https://github.com/ckndr/aerosol-tracker.git`
- **`D:\Aerosol` (Permanent Plant Operations & ERP System)**:
  - Purpose: Permanent operations backbone (BOMs, Job Cards, SOPs, Daily Shift Logs, Material Runway).
  - Web Vision: Build an executive **Operations & Launch Readiness Portal** using Tubex visual styling (Navy `#0d1f3c`, Gold accents, DM Sans/Mono).
  - Pre-Production Focus: Instead of showing empty production zeros, show **Plant Readiness Gauges (84%)**, **Raw Material Runway in Days of Production**, **Trial Run Quality Logs**, and an **Interactive Order/BOM Simulator**. Transitions into live shift logging on Day 1 of commercial production.
  - Remote: `https://github.com/ckndr/aerosol.git`

## 3. BOM & TECHNICAL SPECIFICATIONS
- Container Standard: 45 mm diameter × 160 mm height (0.40 mm wall). Alternate: 45 × 150 mm (0.35 mm wall).
- Lacquer Scrap Factor: 35% (airless spray lance transfer efficiency model: Net / (1 - 0.35) = 1.608 kg/1000 Gold, 1.754 kg/1000 Beige).
- Base Coat & OPV Scrap: 10%.
- Ink Rate: Held at 0.280 kg / 1000 cans conservative commissioning buffer.
- Washer Chemical: Held at 5.0 kg / 1000 cans initial charge/buffer.
- Chemical Store Safeguard: Schekosol clear base coats and varnishes have a 6-month shelf life and require 20°C–25°C air-conditioned storage in the warehouse.
