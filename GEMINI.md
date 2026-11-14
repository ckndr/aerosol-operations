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
   - All coating consumption calculations enforce true yield-inverse physics: $\text{Req} = \frac{\text{Net}}{1 - \text{Scrap}}$ (10% lacquer loss = $1/(1-0.10) = 1.1111 \times \text{Net}$; 15% base coat/OPV loss = $1/(1-0.15) = 1.1765 \times \text{Net}$).
7. **Chemical Shelf-Life & Climate Safeguards**:
   - Schekosol base coats and varnishes have a 6-month shelf life and require 20°C–25°C air-conditioned storage.
   - Built-in countdown badges (amber at 120 days, red at 150 days) and temperature storage warnings.
8. **Bespoke Industrial Aesthetic (Zero AI Slop)**:
   - Cool brushed graphite / aluminum steel (`#12151a` dark mode or `#f1f3f6` high-contrast daylight factory white).
   - Industrial safety amber/orange (`#f59e0b`) and precision emerald (`#10b981`) accents.
   - Professional technical typography: `JetBrains Mono` for data/codes, `Inter` for UI elements, `DM Serif Display` for executive headers.

## 5. TECHNICAL SPECIFICATIONS (LOCKED)
- Container Standard: Primary 45 × 160 mm (0.40 mm wall); Alternate 45 × 150 mm (0.35 mm wall).
- Current products: 45 × 140 mm trimmed / 130–131 mm finished. Coating areas are calculated at the 140 mm trimmed height: outside 0.019792 m², inside 0.020975 m².
- Source of truth for BOM figures: Alpha Aerosols - Planning & MRP.xlsx (engine.py web app is outdated).
- Slug: 38 pcs/kg (26.316 kg/1000 cans) for all can lengths, 15% line waste.
- Lacquer Scrap Rate: 10%.
- Base Coat / OPV Scrap Rate: 15%.
- Ink: 0.245 kg net / station / 1000 cans + 12.5% waste = 0.280 kg gross (plant allowance, no TDS rate).
- Washer: 5.0 kg / 1000 cans (plant allowance, no TDS consumption rate; TDS bath 0.7–1.4% @ 70±5°C).
- Thinners: 20% waste; lacquer thinner 1.5% + purge; coating thinner 3% of product base coat + varnish (exceeds TDS 1–2%, plant allowance).


## 5.1 MASTER WORKBOOK & ARCHIVE DIRECTORY LOCATION (SHARED ONEDRIVE)
- **Shared Folder Path**: `C:\Users\HP\OneDrive\Aerosol Shared Files\QMS Documentation\AER-SORs\Planing SORs`
- **Master Workbook**: `Alpha Aerosols - Planning & MRP.xlsx`
- **Job Cards Record Keeping Folder**: `Record Keeping of Old Job Cards\` (mirrored to `Issued Job Cards\`).
  - Contains monthly folders (e.g. `2026-11\`) with frozen PDFs & standalone XLSXs.
  - Contains monthly multi-tab archive workbooks: `Job_Cards_Archive_YYYY_MM.xlsx`.
- **Portable Relative Hyperlink Architecture**:
  - Formulas in `Issued_Job_Cards` sheet Columns N & O MUST use portable relative links:
    `=HYPERLINK("Record Keeping of Old Job Cards\YYYY-MM\<pdf>", "Open PDF")`
    `=HYPERLINK("[Record Keeping of Old Job Cards\Job_Cards_Archive_YYYY_MM.xlsx]'<tab>'!A1", "Open Archive")`
  - Zero hardcoded drive letters (`D:\...`) in master hyperlinks to guarantee seamless portability across OneDrive shared users.
- **Mandatory Finalization Sync Rule**:
  - Whenever local files or job cards are updated and finalized, they MUST be pushed to the shared OneDrive folder.
  - Automated via `issue_job_card.py` (instant push upon issuance), `push.bat` (pushes before git commit), or manual sync via `Sync_Shared_Folder.bat` (`python sync_shared_mrp.py --push`).

## 6. MODEL ORCHESTRATION RULE: COST-OPTIMAL ARGON INTELLIGENCE & TOKEN EFFICIENCY
- **Core Objective**: Maximize **Gemini 4 Argon's** strategic intelligence while minimizing total token consumption across the session. Always choose the execution path with the **lowest total token cost** without sacrificing output quality.
- **Token Break-Even Economics (Direct Execution vs. Subagent Handoff)**:
  - Spawning a subagent incurs a fixed initialization overhead (system prompt + tool schemas + handoff prompt + summary return).
  - **Execute Directly in Argon (Zero Handoff Overhead)** when the task is **small, surgical, and bounded**:
    - Reading 1–2 small/known files or targeted line ranges (`StartLine`/`EndLine`).
    - Making 1–3 targeted `edit_file` or `write_file` calls where the exact changes are already known.
    - Running a single, quick, low-output shell command.
    - Answering direct questions, math/BOM calculations, architectural reasoning, or planning.
  - **Delegate to `flash` / `flash_lite` Subagents** when the task would **pollute Argon's context window or require multi-step iteration**:
    - **Broad Exploration & Search**: Multi-file codebase searches, grepping across directories, or reading large/unknown files (>300 lines) where raw file contents would bloat Argon's history on every subsequent turn.
    - **Bulk File Generation / Refactoring**: Writing large boilerplate files, updating many files repetitively, or generating extensive data/JSON/SQLite scripts.
    - **Iterative / Noisy Command Execution**: Running test suites, build loops, data scraping, or debugging scripts with verbose stdout/stderr.
    - **Parallel Independent Workstreams**: Tasks that can be fanned out simultaneously to multiple `flash` workers.
- **Model Tier Selection for Subagents**:
  - **`Model: "flash_lite"`**: Use for simple mechanical lookups, file listing, straightforward text extraction, or single-purpose file writes.
  - **`Model: "flash"`**: Use for multi-step codebase research, code synthesis, script execution, and structured edits.
  - **Never use `Model: "inherit"`** for routine delegation (as it duplicates Argon's heavy token cost), unless explicitly requested by the user.
- **Context Hygiene Tactics (Token Savers)**:
  - Always use `StartLine` and `EndLine` when reading files directly to avoid loading entire files into Argon's context.
  - Instruct subagents to return **concise, distilled summaries** (exact file paths, line numbers, key findings) rather than dumping raw file contents back into the main conversation.
  - **Subagent Guardrail**: When running as a delegated `flash` or `flash_lite` subagent, execute tools directly and return a compact summary—never spawn recursive subagents.
