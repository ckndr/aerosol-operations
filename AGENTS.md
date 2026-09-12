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

## 2. PRODUCTION TRACKING SCOPE (SINGLE-STAGE FINISHED PRODUCT ONLY)
- **Zero Multi-Machine Complexity**: The app does **NOT** track individual intermediate machines (press, washer, annealer, etc.) separately.
- **Finished Saleable Output Only**: Production is counted exclusively at the **final finished container stage** (the finished, printed, varnished, necked can ready for packing/dispatch).
- **Consolidated Line Scrap**: Any can dropped, damaged, jammed, or rejected anywhere along the continuous line counts as **Total Line Rejections / Scrap**.
- **Daily Shift Metrics**:
  1. Date & Shift (Day / Night)
  2. POF # & Customer Name
  3. Product Size (45×160 mm / 45×150 mm)
  4. Good Finished Production (pcs)
  5. Total Line Scrap (pcs)
  6. Line Scrap % (`Rejections / Total Output`)
  7. Downtime Hours & Primary Reason
  8. Shift Supervisor / Line Lead

## 3. STRICT SEPARATION: ZERO COMMISSIONING IN THIS PROJECT
- **No Commissioning Content**: Exclude all commissioning readiness percentages, civil construction milestones, HVAC tasks, mechanical dry-run checklists, and startup task tracking.
- **Boundary**: All commissioning belongs 100% to `C:\Aerosol-Tracker`.
- **`D:\Aerosol` Scope**: Dedicated strictly and permanently to **Factory Manufacturing Operations, Orders, Inventory, Dispatches, and BOM Planning** (sister operations project to Tubex `d:\Alpha`).

## 4. AEROSOL v2.0 ARCHITECTURE (ELIMINATING TUBEX TECHNICAL DEBT)
The Aerosol Production Web Application (`aerosol.html` / PWA) is built on modern, clean software standards, explicitly avoiding the legacy traps found in Tubex:
1. **Decoupled UI & Data Layer (No String Splicing)**:
   - `index.html`: Clean semantic HTML shell (< 400 lines).
   - Data is never spliced as raw 264 KB strings into HTML comments.
   - The frontend loads data dynamically via `fetch('./data/production.json')`. Script updates only rewrite the compact data file; the web shell remains cached and untouched.
2. **Embedded SQLite Database (`aerosol.db`)**:
   - SQLite with Write-Ahead Logging (WAL mode) is the single source of truth for all tables (`orders`, `shifts`, `inventory`, `dispatches`).
   - **Zero Windows COM Automation**: No `win32com.client.DispatchEx` and zero `taskkill /f /im excel.exe`.
   - Excel workbooks (`Aerosol_Job_Card.xlsx`) are generated purely as clean, read-only exported artifacts for shop-floor distribution.
3. **Non-Disruptive, Safe Service Worker**:
   - Static assets use **Cache-First**; production data uses **Network-First**.
   - No `self.skipWaiting()` and no unprompted `window.location.reload()`. Updates notify the user via a subtle toast banner (*"App updated — [Tap to Refresh]"*).
4. **Dynamic ISO-8601 Temporal Model**:
   - All timestamps and dates adhere to ISO-8601 (`YYYY-MM-DD`).
   - Automated chronological grouping with zero hardcoded month array ceilings (no silent data dropping).
5. **Bidirectional Web Portal (Floor Entry)**:
   - Touch-friendly web forms for on-site shift logging and POF creation directly in the browser with offline `IndexedDB` resilience.
6. **Physical Yield-Inverse Mass Balance**:
   - All coating consumption calculations enforce true yield-inverse physics: $\text{Req} = \frac{\text{Net}}{1 - \text{Scrap}}$ (35% lacquer loss = $1/(1-0.35) = 1.5385 \times \text{Net}$; 10% base coat/OPV loss = $1/(1-0.10) = 1.1111 \times \text{Net}$).
7. **Chemical Shelf-Life & Climate Safeguards**:
   - Schekosol base coats and varnishes have a 6-month shelf life and require 20°C–25°C air-conditioned storage.
   - Built-in countdown badges (amber at 120 days, red at 150 days) and temperature storage warnings.
8. **Bespoke Industrial Aesthetic (Zero AI Slop)**:
   - Cool brushed graphite / aluminum steel (`#12151a` dark mode or `#f1f3f6` high-contrast daylight factory white).
   - Industrial safety amber/orange (`#f59e0b`) and precision emerald (`#10b981`) accents.
   - Professional technical typography: `JetBrains Mono` for data/codes, `Inter` for UI elements, `DM Serif Display` for executive headers.

## 5. TECHNICAL SPECIFICATIONS (LOCKED)
- Container Standard: Primary 45 × 160 mm (0.40 mm wall); Alternate 45 × 150 mm (0.35 mm wall).
- Lacquer Scrap Rate: 35% (airless spray lance transfer loss model).
- Base Coat / OPV Scrap Rate: 10%.
- Ink Rate: Held at 0.280 kg / 1000 cans conservative commissioning buffer.
- Washer Chemical: Held at 5.0 kg / 1000 cans initial charge/buffer.
