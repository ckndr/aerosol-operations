/**
 * Alpha Aerosols (Kot Abdul Malik) — Central Reactive State & Offline Engine
 * Single-stage tracking, IndexedDB resilience, Dynamic ISO-8601 Temporal Model
 */

const DEFAULT_PRE_PRODUCTION_DATA = {
  "meta": {
    "plant_name": "Alpha Aerosols",
    "location": "Kot Abdul Malik, Punjab, Pakistan",
    "as_of_date": "2026-11-14",
    "active_workbook": "Alpha Aerosols - Planning & MRP.xlsx",
    "active_campaign": "AER-POF-03 (Markhor Blanc 120ml - 100,000 cans)",
    "generated_at": "2026-11-14T12:58:56.291162",
    "version": "2.1.0",
    "sqlite_mode": "WAL"
  },
  "kpis": {
    "today_output_cans": 0,
    "today_scrap_cans": 0,
    "today_scrap_pct": 0.0,
    "mtd_output_cans": 104800,
    "mtd_scrap_cans": 3230,
    "mtd_scrap_pct": 2.99,
    "today_dispatches_cans": 0,
    "today_dispatches_count": 0,
    "active_pofs_count": 0,
    "downtime_hours_mtd": 2.0,
    "fg_buffer_cans": 4800,
    "fg_buffer_pallets": 1.6,
    "latest_shift": {
      "good_cans": 4800,
      "line_scrap": 180,
      "scrap_pct": 3.61,
      "shift_date": "2026-11-05",
      "shift_type": "Day",
      "supervisor": "Tariq Mahmood",
      "pof_number": "AER-POF-03",
      "customer_name": "Sarwana & Sohzsihm"
    }
  },
  "orders": [
    {
      "id": 6,
      "pof_number": "AER-POF-08",
      "customer_name": "The Looks (Pvt) Ltd",
      "product_name": "ME Saxe GF Body Spray 120ml",
      "product_size": "45x130mm (140mm post-press)",
      "order_qty": 100000,
      "tolerance_pct": 0.05,
      "order_date": "2026-11-01",
      "due_date": "2026-12-05",
      "status": "Issued to Floor",
      "artwork_ref": "AER-PRD-F-06",
      "notes": "Job Card: AER-PL-SOR-08 | Barcode: 6291101526573 | White Base Coat | 3 Colors (616, 617, 601) | Glossy OPV",
      "created_at": "2026-11-01T08:00:00",
      "produced_good": 0,
      "produced_scrap": 0,
      "total_line_run": 0,
      "dispatched_total": 0,
      "fg_stock": 0,
      "min_acceptable_qty": 95000,
      "max_acceptable_qty": 105000,
      "completion_pct": 0.0,
      "remaining_qty": 100000,
      "order_scrap_pct": 0.0,
      "is_within_tolerance": false,
      "job_card_no": "AER-PL-SOR-08",
      "pdf_path": "./Issued Job Cards/2026-11/2026-11-01_AER-PL-SOR-08_ME_Saxe_GF_Body_Spray_120ml_100000.pdf",
      "xlsx_path": "./Issued Job Cards/2026-11/2026-11-01_AER-PL-SOR-08_ME_Saxe_GF_Body_Spray_120ml_100000.xlsx",
      "job_card_pdf": "./Issued Job Cards/2026-11/2026-11-01_AER-PL-SOR-08_ME_Saxe_GF_Body_Spray_120ml_100000.pdf",
      "job_card_xlsx": "./Issued Job Cards/2026-11/2026-11-01_AER-PL-SOR-08_ME_Saxe_GF_Body_Spray_120ml_100000.xlsx"
    },
    {
      "id": 5,
      "pof_number": "AER-POF-07",
      "customer_name": "Fine Daily (Pvt) Ltd",
      "product_name": "KRONE NOIR Desire GF Body Spray 120ml",
      "product_size": "45x131mm (140mm post-press)",
      "order_qty": 100000,
      "tolerance_pct": 0.05,
      "order_date": "2026-11-01",
      "due_date": "2026-12-15",
      "status": "On Hold",
      "artwork_ref": "AER-PRD-F-05",
      "notes": "Job Card: AER-PL-SOR-07 | Barcode: 653341119874 | Clear Base Coat (Metallic Look) | 6 Colors (612, 613, 614, 615, 609, 601) | Silk-Matt OPV",
      "created_at": "2026-11-01T08:00:00",
      "produced_good": 0,
      "produced_scrap": 0,
      "total_line_run": 0,
      "dispatched_total": 0,
      "fg_stock": 0,
      "min_acceptable_qty": 95000,
      "max_acceptable_qty": 105000,
      "completion_pct": 0.0,
      "remaining_qty": 100000,
      "order_scrap_pct": 0.0,
      "is_within_tolerance": false,
      "job_card_no": "AER-PL-SOR-07",
      "pdf_path": "./Issued Job Cards/2026-11/2026-11-01_AER-PL-SOR-07_KRONE_NOIR_Desire_GF_Body_Spray_120ml_100000.pdf",
      "xlsx_path": "./Issued Job Cards/2026-11/2026-11-01_AER-PL-SOR-07_KRONE_NOIR_Desire_GF_Body_Spray_120ml_100000.xlsx",
      "job_card_pdf": "./Issued Job Cards/2026-11/2026-11-01_AER-PL-SOR-07_KRONE_NOIR_Desire_GF_Body_Spray_120ml_100000.pdf",
      "job_card_xlsx": "./Issued Job Cards/2026-11/2026-11-01_AER-PL-SOR-07_KRONE_NOIR_Desire_GF_Body_Spray_120ml_100000.xlsx"
    },
    {
      "id": 4,
      "pof_number": "AER-POF-06",
      "customer_name": "Dari Mooch",
      "product_name": "Dari Mooch Shore 100ml",
      "product_size": "45x131mm (140mm post-press)",
      "order_qty": 100000,
      "tolerance_pct": 0.05,
      "order_date": "2026-11-01",
      "due_date": "2026-11-15",
      "status": "Completed",
      "artwork_ref": "AER-PRD-F-02",
      "notes": "Job Card: AER-PL-SOR-06 | Barcode: 0764460434873 | 2 Colors: Pantone 157-76 C (611), Black (601) | Base Coat & OPV Pending Artwork",
      "created_at": "2026-11-01T08:00:00",
      "produced_good": 100000,
      "produced_scrap": 3050,
      "total_line_run": 103050,
      "dispatched_total": 100000,
      "fg_stock": 0,
      "min_acceptable_qty": 95000,
      "max_acceptable_qty": 105000,
      "completion_pct": 100.0,
      "remaining_qty": 0,
      "order_scrap_pct": 2.96,
      "is_within_tolerance": true,
      "job_card_no": "AER-PL-SOR-06",
      "pdf_path": "./Issued Job Cards/2026-11/2026-11-01_AER-PL-SOR-06_Dari_Mooch_Shore_100ml_100000.pdf",
      "xlsx_path": "./Issued Job Cards/2026-11/2026-11-01_AER-PL-SOR-06_Dari_Mooch_Shore_100ml_100000.xlsx",
      "job_card_pdf": "./Issued Job Cards/2026-11/2026-11-01_AER-PL-SOR-06_Dari_Mooch_Shore_100ml_100000.pdf",
      "job_card_xlsx": "./Issued Job Cards/2026-11/2026-11-01_AER-PL-SOR-06_Dari_Mooch_Shore_100ml_100000.xlsx"
    },
    {
      "id": 3,
      "pof_number": "AER-POF-05",
      "customer_name": "Dari Mooch",
      "product_name": "Dari Mooch Cove 100ml",
      "product_size": "45x131mm (140mm post-press)",
      "order_qty": 100000,
      "tolerance_pct": 0.05,
      "order_date": "2026-11-01",
      "due_date": "2026-11-30",
      "status": "Issued to Floor",
      "artwork_ref": "AER-PRD-F-01",
      "notes": "Job Card: AER-PL-SOR-05 | Barcode: 0764460434811 | 2 Colors: Pantone 166-7 C (610), Black (601) | Base Coat & OPV Pending Artwork",
      "created_at": "2026-11-01T08:00:00",
      "produced_good": 0,
      "produced_scrap": 0,
      "total_line_run": 0,
      "dispatched_total": 0,
      "fg_stock": 0,
      "min_acceptable_qty": 95000,
      "max_acceptable_qty": 105000,
      "completion_pct": 0.0,
      "remaining_qty": 100000,
      "order_scrap_pct": 0.0,
      "is_within_tolerance": false,
      "job_card_no": "AER-PL-SOR-05",
      "pdf_path": "./Issued Job Cards/2026-11/2026-11-01_AER-PL-SOR-05_Dari_Mooch_Cove_100ml_100000.pdf",
      "xlsx_path": "./Issued Job Cards/2026-11/2026-11-01_AER-PL-SOR-05_Dari_Mooch_Cove_100ml_100000.xlsx",
      "job_card_pdf": "./Issued Job Cards/2026-11/2026-11-01_AER-PL-SOR-05_Dari_Mooch_Cove_100ml_100000.pdf",
      "job_card_xlsx": "./Issued Job Cards/2026-11/2026-11-01_AER-PL-SOR-05_Dari_Mooch_Cove_100ml_100000.xlsx"
    },
    {
      "id": 2,
      "pof_number": "AER-POF-04",
      "customer_name": "Sarwana & Sohzsihm",
      "product_name": "Markhor Noir 120ml",
      "product_size": "45x131mm (140mm post-press)",
      "order_qty": 100000,
      "tolerance_pct": 0.05,
      "order_date": "2026-11-01",
      "due_date": "2026-11-30",
      "status": "Issued to Floor",
      "artwork_ref": "AER-PRD-F-04",
      "notes": "Job Card: AER-PL-SOR-04 | Barcode: 8964000572627 | 2 Colors: Pantone 185 C, Black | Silk-Matt OPV",
      "created_at": "2026-11-01T08:00:00",
      "produced_good": 0,
      "produced_scrap": 0,
      "total_line_run": 0,
      "dispatched_total": 0,
      "fg_stock": 0,
      "min_acceptable_qty": 95000,
      "max_acceptable_qty": 105000,
      "completion_pct": 0.0,
      "remaining_qty": 100000,
      "order_scrap_pct": 0.0,
      "is_within_tolerance": false,
      "job_card_no": "AER-PL-SOR-04",
      "pdf_path": "./Issued Job Cards/2026-11/2026-11-01_AER-PL-SOR-04_Markhor_Noir_120ml_100000.pdf",
      "xlsx_path": "./Issued Job Cards/2026-11/2026-11-01_AER-PL-SOR-04_Markhor_Noir_120ml_100000.xlsx",
      "job_card_pdf": "./Issued Job Cards/2026-11/2026-11-01_AER-PL-SOR-04_Markhor_Noir_120ml_100000.pdf",
      "job_card_xlsx": "./Issued Job Cards/2026-11/2026-11-01_AER-PL-SOR-04_Markhor_Noir_120ml_100000.xlsx"
    },
    {
      "id": 1,
      "pof_number": "AER-POF-03",
      "customer_name": "Sarwana & Sohzsihm",
      "product_name": "Markhor Blanc 120ml",
      "product_size": "45x131mm (140mm post-press)",
      "order_qty": 100000,
      "tolerance_pct": 0.05,
      "order_date": "2026-11-01",
      "due_date": "2026-11-30",
      "status": "In Progress",
      "artwork_ref": "AER-PRD-F-03",
      "notes": "Job Card: AER-PL-SOR-03 | Barcode: 8964000571651 | 5 Colors: Pantone 185 C, Cyan, Magenta, Yellow, Black | Silk-Matt OPV",
      "created_at": "2026-11-01T08:00:00",
      "produced_good": 4800,
      "produced_scrap": 180,
      "total_line_run": 4980,
      "dispatched_total": 0,
      "fg_stock": 4800,
      "min_acceptable_qty": 95000,
      "max_acceptable_qty": 105000,
      "completion_pct": 4.8,
      "remaining_qty": 95200,
      "order_scrap_pct": 3.61,
      "is_within_tolerance": false,
      "job_card_no": "AER-PL-SOR-03",
      "pdf_path": "./Issued Job Cards/2026-11/2026-11-01_AER-PL-SOR-03_Markhor_Blanc_120ml_100000.pdf",
      "xlsx_path": "./Issued Job Cards/2026-11/2026-11-01_AER-PL-SOR-03_Markhor_Blanc_120ml_100000.xlsx",
      "job_card_pdf": "./Issued Job Cards/2026-11/2026-11-01_AER-PL-SOR-03_Markhor_Blanc_120ml_100000.pdf",
      "job_card_xlsx": "./Issued Job Cards/2026-11/2026-11-01_AER-PL-SOR-03_Markhor_Blanc_120ml_100000.xlsx"
    }
  ],
  "products": [
    {
      "id": 9001,
      "product_name": "Markhor Blanc 120ml",
      "customer": "Sarwana & Sohzsihm",
      "can_type": "Round / Necked-in",
      "can_diameter": "45 mm",
      "can_height": "131 mm ± 2 mm (140 mm post-press)",
      "neck_opening": "1 inch (25.4 mm)",
      "wall_thickness": "0.40mm",
      "dome_thickness": "0.75 ± 0.05 mm",
      "internal_coating": "Epoxy Gold (SCHEKOSOL 400 9 901)",
      "base_coat_color": "White (SCHEKOSOL 422 0 903)",
      "print_colors": "5 Colors: Pantone 185 C (Red), Cyan, Magenta, Yellow, Black",
      "varnish_type": "Matt (SCHEKOSOL 422 9 903)",
      "packing_standard": "450 pcs/Carton (61.5×50×41 cm, NW 10.3 kg / GW 12.5 kg) / 3,000 per Pallet",
      "notes": "Cap: White | Brand: English / Frostfire",
      "artwork_ref": "AER-PRD-F-03",
      "top_wall_thickness": "0.37 ± 0.02 mm",
      "center_wall_thickness": "0.32 ± 0.02 mm",
      "bottom_thickness": "0.75 ± 0.05 mm",
      "dome_depth": "19.4 mm",
      "cap_type": "Actuator Cap",
      "cap_color": "White",
      "net_content": "120 ml",
      "print_area": "W1 141 mm × H1 105 mm",
      "barcode": "8964000571651",
      "height_nominal_mm": 130.0,
      "top_wall_nominal_mm": 0.37,
      "center_wall_nominal_mm": 0.32,
      "bottom_nominal_mm": 0.75,
      "customer_name": "Sarwana & Sohzsihm",
      "product_size": "45x130mm",
      "trimmed_height": "140mm",
      "base_coat_type": "White (SCHEKOSOL 422 0 903)",
      "base_coat_g_m2": 43,
      "ink_colors_count": 5,
      "ink_pantones": "Pantone 185 C (Red), Cyan, Magenta, Yellow, Black",
      "varnish_g_m2": 17
    },
    {
      "id": 9002,
      "product_name": "Markhor Noir 120ml",
      "customer": "Sarwana & Sohzsihm",
      "can_type": "Round / Necked-in",
      "can_diameter": "45 mm",
      "can_height": "131 mm ± 2 mm (140 mm post-press)",
      "neck_opening": "1 inch (25.4 mm)",
      "wall_thickness": "0.40mm",
      "dome_thickness": "0.75 ± 0.05 mm",
      "internal_coating": "Epoxy Gold (SCHEKOSOL 400 9 901)",
      "base_coat_color": "White (SCHEKOSOL 422 0 903)",
      "print_colors": "2 Colors: Pantone 185 C (Red), Black",
      "varnish_type": "Matt (SCHEKOSOL 422 9 903)",
      "packing_standard": "450 pcs/Carton (61.5×50×41 cm, NW 10.3 kg / GW 12.5 kg) / 3,000 per Pallet",
      "notes": "Cap: Black | Brand: English / Frostfire",
      "artwork_ref": "AER-PRD-F-04",
      "top_wall_thickness": "0.37 ± 0.02 mm",
      "center_wall_thickness": "0.32 ± 0.02 mm",
      "bottom_thickness": "0.75 ± 0.05 mm",
      "dome_depth": "19.4 mm",
      "cap_type": "Actuator Cap",
      "cap_color": "Black",
      "net_content": "120 ml",
      "print_area": "W1 141 mm × H1 105 mm",
      "barcode": "8964000572627",
      "height_nominal_mm": 130.0,
      "top_wall_nominal_mm": 0.37,
      "center_wall_nominal_mm": 0.32,
      "bottom_nominal_mm": 0.75,
      "customer_name": "Sarwana & Sohzsihm",
      "product_size": "45x130mm",
      "trimmed_height": "140mm",
      "base_coat_type": "White (SCHEKOSOL 422 0 903)",
      "base_coat_g_m2": 43,
      "ink_colors_count": 2,
      "ink_pantones": "Pantone 185 C (Red), Black",
      "varnish_g_m2": 17
    },
    {
      "id": 9003,
      "product_name": "Dari Mooch Cove 100ml",
      "customer": "Dari Mooch",
      "can_type": "Round / Necked-in",
      "can_diameter": "45 mm",
      "can_height": "131 mm ± 2 mm (140 mm post-press)",
      "neck_opening": "1 inch (25.4 mm)",
      "wall_thickness": "0.40mm",
      "dome_thickness": "0.75 ± 0.05 mm",
      "internal_coating": "Epoxy Gold (SCHEKOSOL 400 9 901)",
      "base_coat_color": "",
      "print_colors": "2 Colors: Pantone 166-7 C, Black",
      "varnish_type": "TBD (Awaiting Customer)",
      "packing_standard": "450 pcs/Carton (61.5×50×41 cm, NW 10.3 kg / GW 12.5 kg) / 3,000 per Pallet",
      "notes": "Ref Code: DM-DMCD-100-00",
      "artwork_ref": "AER-PRD-F-01",
      "top_wall_thickness": "0.37 ± 0.02 mm",
      "center_wall_thickness": "0.32 ± 0.02 mm",
      "bottom_thickness": "0.75 ± 0.05 mm",
      "dome_depth": "19.4 mm",
      "cap_type": "Actuator Cap",
      "cap_color": "",
      "net_content": "100 ml",
      "print_area": "",
      "barcode": "0764460434811",
      "height_nominal_mm": 131.0,
      "top_wall_nominal_mm": 0.37,
      "center_wall_nominal_mm": 0.32,
      "bottom_nominal_mm": 0.75,
      "customer_name": "Dari Mooch",
      "product_size": "45x131mm",
      "trimmed_height": "140mm",
      "base_coat_type": "TBD (Awaiting Customer)",
      "base_coat_g_m2": "—",
      "ink_colors_count": 2,
      "ink_pantones": "Pantone 166-7 C, Black",
      "varnish_g_m2": "—"
    },
    {
      "id": 9004,
      "product_name": "Dari Mooch Shore 100ml",
      "customer": "Dari Mooch",
      "can_type": "Round / Necked-in",
      "can_diameter": "45 mm",
      "can_height": "131 mm ± 2 mm (140 mm post-press)",
      "neck_opening": "1 inch (25.4 mm)",
      "wall_thickness": "0.40mm",
      "dome_thickness": "0.75 ± 0.05 mm",
      "internal_coating": "Epoxy Gold (SCHEKOSOL 400 9 901)",
      "base_coat_color": "",
      "print_colors": "2 Colors: Pantone 157-76 C, Black",
      "varnish_type": "TBD (Awaiting Customer)",
      "packing_standard": "450 pcs/Carton (61.5×50×41 cm, NW 10.3 kg / GW 12.5 kg) / 3,000 per Pallet",
      "notes": "Ref Code: DM-DMCD-100-00",
      "artwork_ref": "AER-PRD-F-02",
      "top_wall_thickness": "0.37 ± 0.02 mm",
      "center_wall_thickness": "0.32 ± 0.02 mm",
      "bottom_thickness": "0.75 ± 0.05 mm",
      "dome_depth": "19.4 mm",
      "cap_type": "Actuator Cap",
      "cap_color": "",
      "net_content": "100 ml",
      "print_area": "",
      "barcode": "0764460434873",
      "height_nominal_mm": 131.0,
      "top_wall_nominal_mm": 0.37,
      "center_wall_nominal_mm": 0.32,
      "bottom_nominal_mm": 0.75,
      "customer_name": "Dari Mooch",
      "product_size": "45x131mm",
      "trimmed_height": "140mm",
      "base_coat_type": "TBD (Awaiting Customer)",
      "base_coat_g_m2": "—",
      "ink_colors_count": 2,
      "ink_pantones": "Pantone 157-76 C, Black",
      "varnish_g_m2": "—"
    },
    {
      "id": 9005,
      "product_name": "KRONE NOIR Desire GF Body Spray 120ml",
      "customer": "Fine Daily (Pvt) Ltd",
      "can_type": "Round / Necked-in",
      "can_diameter": "45 mm",
      "can_height": "131 mm ± 2 mm (140 mm post-press)",
      "neck_opening": "1 inch (25.4 mm)",
      "wall_thickness": "0.40mm",
      "dome_thickness": "0.75 ± 0.05 mm",
      "internal_coating": "Epoxy Gold (SCHEKOSOL 400 9 901)",
      "base_coat_color": "Clear / Metallic Round (SCHEKOSOL 422 9 918)",
      "print_colors": "6 Colors: Green, Orange, Gray Metalized, Red Metalized, White, Black",
      "varnish_type": "Matt (SCHEKOSOL 422 9 903)",
      "packing_standard": "450 pcs/Carton (61.5×50×41 cm, NW 10.3 kg / GW 12.5 kg) / 3,000 per Pallet",
      "notes": "Client Ref: FDPL-KNDGFBS-120-00 | Metallic brushed look",
      "artwork_ref": "AER-PRD-F-05",
      "top_wall_thickness": "0.37 ± 0.02 mm",
      "center_wall_thickness": "0.32 ± 0.02 mm",
      "bottom_thickness": "0.75 ± 0.05 mm",
      "dome_depth": "19.4 mm",
      "cap_type": "Actuator Cap",
      "cap_color": "Black",
      "net_content": "120 ml",
      "print_area": "W1 141 mm × H1 105 mm",
      "barcode": "653341119874",
      "height_nominal_mm": 130.0,
      "top_wall_nominal_mm": 0.37,
      "center_wall_nominal_mm": 0.32,
      "bottom_nominal_mm": 0.75,
      "customer_name": "Fine Daily (Pvt) Ltd",
      "product_size": "45x130mm",
      "trimmed_height": "140mm",
      "base_coat_type": "Clear / Metallic Round (SCHEKOSOL 422 9 918)",
      "base_coat_g_m2": 31,
      "ink_colors_count": 6,
      "ink_pantones": "Green, Orange, Gray Metalized, Red Metalized, White, Black",
      "varnish_g_m2": 17
    },
    {
      "id": 9006,
      "product_name": "ME Saxe GF Body Spray 120ml",
      "customer": "The Looks (Pvt) Ltd",
      "can_type": "Round / Necked-in",
      "can_diameter": "45 mm",
      "can_height": "130 mm ± 2 mm (140 mm post-press)",
      "neck_opening": "1 inch (25.4 mm)",
      "wall_thickness": "0.40mm",
      "dome_thickness": "0.75 ± 0.05 mm",
      "internal_coating": "Epoxy Gold (SCHEKOSOL 400 9 901)",
      "base_coat_color": "White Round (SCHEKOSOL 422 0 903)",
      "print_colors": "3 Colors: Pantone 2728 C, Pantone 2758 C, Black",
      "varnish_type": "Glossy (SCHEKOSOL 422 9 900)",
      "packing_standard": "450 pcs/Carton (61.5×50×41 cm, NW 10.3 kg / GW 12.5 kg) / 3,000 per Pallet",
      "notes": "Client Ref: TL-MGFBS-120-00 | High shine gloss finish",
      "artwork_ref": "AER-PRD-F-06",
      "top_wall_thickness": "0.37 ± 0.02 mm",
      "center_wall_thickness": "0.32 ± 0.02 mm",
      "bottom_thickness": "0.75 ± 0.05 mm",
      "dome_depth": "19.4 mm",
      "cap_type": "Actuator Cap",
      "cap_color": "Blue",
      "net_content": "120 ml",
      "print_area": "W1 141 mm × H1 105 mm",
      "barcode": "6291101526573",
      "height_nominal_mm": 130.0,
      "top_wall_nominal_mm": 0.37,
      "center_wall_nominal_mm": 0.32,
      "bottom_nominal_mm": 0.75,
      "customer_name": "The Looks (Pvt) Ltd",
      "product_size": "45x130mm",
      "trimmed_height": "140mm",
      "base_coat_type": "White Round (SCHEKOSOL 422 0 903)",
      "base_coat_g_m2": 43,
      "ink_colors_count": 3,
      "ink_pantones": "Pantone 2728 C, Pantone 2758 C, Black",
      "varnish_g_m2": 19
    }
  ],
  "job_cards": [
    {
      "job_card_no": "AER-PL-SOR-03",
      "issue_date": "2026-11-01",
      "pof_number": "AER-POF-03",
      "product_name": "Markhor Blanc 120ml",
      "customer": "Sarwana & Sohzsihm",
      "order_qty": 100000,
      "tolerance_pct": 0.05,
      "delivery_date": "2026-11-30",
      "status": "In Progress",
      "actual_good_cans": 4800,
      "actual_line_scrap": 180,
      "actual_scrap_pct": 3.61,
      "date_closed": null,
      "pdf_path": "./Issued Job Cards/2026-11/2026-11-01_AER-PL-SOR-03_Markhor_Blanc_120ml_100000.pdf",
      "xlsx_path": "./Issued Job Cards/2026-11/2026-11-01_AER-PL-SOR-03_Markhor_Blanc_120ml_100000.xlsx",
      "customer_name": "Sarwana & Sohzsihm",
      "excel_path": "./Issued Job Cards/2026-11/2026-11-01_AER-PL-SOR-03_Markhor_Blanc_120ml_100000.xlsx",
      "finished_height": "45x131mm",
      "internal_lacquer": "Epoxy Gold (SCHEKOSOL 400 9 901)",
      "base_coat": "White (SCHEKOSOL 422 0 903)",
      "overprint_varnish": "Matt (SCHEKOSOL 422 9 903)",
      "num_colors": 5,
      "barcode": "8964000571651"
    },
    {
      "job_card_no": "AER-PL-SOR-04",
      "issue_date": "2026-11-01",
      "pof_number": "AER-POF-04",
      "product_name": "Markhor Noir 120ml",
      "customer": "Sarwana & Sohzsihm",
      "order_qty": 100000,
      "tolerance_pct": 0.05,
      "delivery_date": "2026-11-30",
      "status": "Issued to Floor",
      "actual_good_cans": 0,
      "actual_line_scrap": 0,
      "actual_scrap_pct": 0.0,
      "date_closed": null,
      "pdf_path": "./Issued Job Cards/2026-11/2026-11-01_AER-PL-SOR-04_Markhor_Noir_120ml_100000.pdf",
      "xlsx_path": "./Issued Job Cards/2026-11/2026-11-01_AER-PL-SOR-04_Markhor_Noir_120ml_100000.xlsx",
      "customer_name": "Sarwana & Sohzsihm",
      "excel_path": "./Issued Job Cards/2026-11/2026-11-01_AER-PL-SOR-04_Markhor_Noir_120ml_100000.xlsx",
      "finished_height": "45x131mm",
      "internal_lacquer": "Epoxy Gold (SCHEKOSOL 400 9 901)",
      "base_coat": "White (SCHEKOSOL 422 0 903)",
      "overprint_varnish": "Matt (SCHEKOSOL 422 9 903)",
      "num_colors": 2,
      "barcode": "8964000572627"
    },
    {
      "job_card_no": "AER-PL-SOR-05",
      "issue_date": "2026-11-01",
      "pof_number": "AER-POF-05",
      "product_name": "Dari Mooch Cove 100ml",
      "customer": "Dari Mooch",
      "order_qty": 100000,
      "tolerance_pct": 0.05,
      "delivery_date": "2026-11-30",
      "status": "Issued to Floor",
      "actual_good_cans": 0,
      "actual_line_scrap": 0,
      "actual_scrap_pct": 0.0,
      "date_closed": null,
      "pdf_path": "./Issued Job Cards/2026-11/2026-11-01_AER-PL-SOR-05_Dari_Mooch_Cove_100ml_100000.pdf",
      "xlsx_path": "./Issued Job Cards/2026-11/2026-11-01_AER-PL-SOR-05_Dari_Mooch_Cove_100ml_100000.xlsx",
      "customer_name": "Dari Mooch",
      "excel_path": "./Issued Job Cards/2026-11/2026-11-01_AER-PL-SOR-05_Dari_Mooch_Cove_100ml_100000.xlsx",
      "finished_height": "45x131mm",
      "internal_lacquer": "Epoxy Gold (SCHEKOSOL 400 9 901)",
      "base_coat": "TBD (Awaiting Customer)",
      "overprint_varnish": "TBD (Awaiting Customer)",
      "num_colors": 2,
      "barcode": "0764460434811"
    },
    {
      "job_card_no": "AER-PL-SOR-06",
      "issue_date": "2026-11-01",
      "pof_number": "AER-POF-06",
      "product_name": "Dari Mooch Shore 100ml",
      "customer": "Dari Mooch",
      "order_qty": 100000,
      "tolerance_pct": 0.05,
      "delivery_date": "2026-11-15",
      "status": "Completed",
      "actual_good_cans": 100000,
      "actual_line_scrap": 3050,
      "actual_scrap_pct": 2.96,
      "date_closed": "2026-11-04",
      "pdf_path": "./Issued Job Cards/2026-11/2026-11-01_AER-PL-SOR-06_Dari_Mooch_Shore_100ml_100000.pdf",
      "xlsx_path": "./Issued Job Cards/2026-11/2026-11-01_AER-PL-SOR-06_Dari_Mooch_Shore_100ml_100000.xlsx",
      "customer_name": "Dari Mooch",
      "excel_path": "./Issued Job Cards/2026-11/2026-11-01_AER-PL-SOR-06_Dari_Mooch_Shore_100ml_100000.xlsx",
      "finished_height": "45x131mm",
      "internal_lacquer": "Epoxy Gold (SCHEKOSOL 400 9 901)",
      "base_coat": "TBD (Awaiting Customer)",
      "overprint_varnish": "TBD (Awaiting Customer)",
      "num_colors": 2,
      "barcode": "0764460434873"
    },
    {
      "job_card_no": "AER-PL-SOR-07",
      "issue_date": "2026-11-01",
      "pof_number": "AER-POF-07",
      "product_name": "KRONE NOIR Desire GF Body Spray 120ml",
      "customer": "Fine Daily (Pvt) Ltd",
      "order_qty": 100000,
      "tolerance_pct": 0.05,
      "delivery_date": "2026-12-15",
      "status": "On Hold",
      "actual_good_cans": 0,
      "actual_line_scrap": 0,
      "actual_scrap_pct": 0.0,
      "date_closed": null,
      "pdf_path": "./Issued Job Cards/2026-11/2026-11-01_AER-PL-SOR-07_KRONE_NOIR_Desire_GF_Body_Spray_120ml_100000.pdf",
      "xlsx_path": "./Issued Job Cards/2026-11/2026-11-01_AER-PL-SOR-07_KRONE_NOIR_Desire_GF_Body_Spray_120ml_100000.xlsx",
      "customer_name": "Fine Daily (Pvt) Ltd",
      "excel_path": "./Issued Job Cards/2026-11/2026-11-01_AER-PL-SOR-07_KRONE_NOIR_Desire_GF_Body_Spray_120ml_100000.xlsx",
      "finished_height": "45x131mm",
      "internal_lacquer": "Epoxy Gold (SCHEKOSOL 400 9 901)",
      "base_coat": "Clear / Metallic Round (SCHEKOSOL 422 9 918)",
      "overprint_varnish": "Matt (SCHEKOSOL 422 9 903)",
      "num_colors": 6,
      "barcode": "653341119874"
    },
    {
      "job_card_no": "AER-PL-SOR-08",
      "issue_date": "2026-11-01",
      "pof_number": "AER-POF-08",
      "product_name": "ME Saxe GF Body Spray 120ml",
      "customer": "The Looks (Pvt) Ltd",
      "order_qty": 100000,
      "tolerance_pct": 0.05,
      "delivery_date": "2026-12-05",
      "status": "Issued to Floor",
      "actual_good_cans": 0,
      "actual_line_scrap": 0,
      "actual_scrap_pct": 0.0,
      "date_closed": null,
      "pdf_path": "./Issued Job Cards/2026-11/2026-11-01_AER-PL-SOR-08_ME_Saxe_GF_Body_Spray_120ml_100000.pdf",
      "xlsx_path": "./Issued Job Cards/2026-11/2026-11-01_AER-PL-SOR-08_ME_Saxe_GF_Body_Spray_120ml_100000.xlsx",
      "customer_name": "The Looks (Pvt) Ltd",
      "excel_path": "./Issued Job Cards/2026-11/2026-11-01_AER-PL-SOR-08_ME_Saxe_GF_Body_Spray_120ml_100000.xlsx",
      "finished_height": "45x130mm",
      "internal_lacquer": "Epoxy Gold (SCHEKOSOL 400 9 901)",
      "base_coat": "White Round (SCHEKOSOL 422 0 903)",
      "overprint_varnish": "Glossy (SCHEKOSOL 422 9 900)",
      "num_colors": 3,
      "barcode": "6291101526573"
    }
  ],
  "mrp": [
    {
      "item_id": "501",
      "category": "SLUG",
      "item_name": "Slug 45mm (38 pcs/kg)",
      "uom": "kg",
      "mix_pct": 1.0,
      "scrap_pct": 0.15,
      "net_required": 2631.6,
      "gross_required": 3096.0,
      "required_qty_gross": 3096.0,
      "current_stock": 150.0,
      "surplus_deficit": -2946.0,
      "cans_can_produce": 4844,
      "pieces_can_produce": 4844,
      "status": "CRITICAL SHORTAGE"
    },
    {
      "item_id": "500",
      "category": "SLUG",
      "item_name": "45mm Slug (6.5mm Thickness, Heavy Wall)",
      "uom": "kg",
      "mix_pct": 0.0,
      "scrap_pct": 0.15,
      "net_required": 0.0,
      "gross_required": 0.0,
      "required_qty_gross": 0.0,
      "current_stock": 65.0,
      "surplus_deficit": 65.0,
      "cans_can_produce": "-",
      "pieces_can_produce": "-",
      "status": "NOT REQUIRED (0% MIX)"
    },
    {
      "item_id": "502",
      "category": "LUBRICANT",
      "item_name": "SAPILUB LUBRIMET GR8 (Extrusion Paste Lubricant)",
      "uom": "kg",
      "mix_pct": 1.0,
      "scrap_pct": 0.15,
      "net_required": 2.76,
      "gross_required": 3.25,
      "required_qty_gross": 3.25,
      "current_stock": 2.0,
      "surplus_deficit": -1.25,
      "cans_can_produce": 61538,
      "pieces_can_produce": 61538,
      "status": "CRITICAL SHORTAGE"
    },
    {
      "item_id": "504",
      "category": "LACQUER",
      "item_name": "SCHEKOSOL INT PROT Gold (400 9 901)",
      "uom": "kg",
      "mix_pct": 1.0,
      "scrap_pct": 0.1,
      "net_required": 92.3,
      "gross_required": 102.56,
      "required_qty_gross": 102.56,
      "current_stock": 30.0,
      "surplus_deficit": -72.56,
      "cans_can_produce": 29251,
      "pieces_can_produce": 29251,
      "status": "CRITICAL SHORTAGE"
    },
    {
      "item_id": "505",
      "category": "LACQUER",
      "item_name": "SCHEKOSOL INT BEIGE (400 4 902)",
      "uom": "kg",
      "mix_pct": 0.0,
      "scrap_pct": 0.1,
      "net_required": 0.0,
      "gross_required": 0.0,
      "required_qty_gross": 0.0,
      "current_stock": 0.0,
      "surplus_deficit": 0.0,
      "cans_can_produce": "-",
      "pieces_can_produce": "-",
      "status": "NOT REQUIRED (0% MIX)"
    },
    {
      "item_id": "506 9 901",
      "category": "THINNER",
      "item_name": "SCHEKOSOL Reducer 506 9 901 (Lacquer)",
      "uom": "kg",
      "mix_pct": 1.0,
      "scrap_pct": 0.2,
      "net_required": 2.76,
      "gross_required": 3.45,
      "required_qty_gross": 3.45,
      "current_stock": 0.0,
      "surplus_deficit": -3.45,
      "cans_can_produce": 0,
      "pieces_can_produce": 0,
      "status": "CRITICAL SHORTAGE"
    },
    {
      "item_id": "506",
      "category": "BASE COAT",
      "item_name": "SCHEKOSOL WH BC (422 0 903) White",
      "uom": "kg",
      "mix_pct": 1.0,
      "scrap_pct": 0.15,
      "net_required": 85.1,
      "gross_required": 100.12,
      "required_qty_gross": 100.12,
      "current_stock": 15.0,
      "surplus_deficit": -85.12,
      "cans_can_produce": 14982,
      "pieces_can_produce": 14982,
      "status": "CRITICAL SHORTAGE"
    },
    {
      "item_id": "507",
      "category": "BASE COAT",
      "item_name": "SCHEKOSOL CLEAR BC (422 9 918) Clear",
      "uom": "kg",
      "mix_pct": 0.0,
      "scrap_pct": 0.15,
      "net_required": 0.0,
      "gross_required": 0.0,
      "required_qty_gross": 0.0,
      "current_stock": 0.0,
      "surplus_deficit": 0.0,
      "cans_can_produce": "-",
      "pieces_can_produce": "-",
      "status": "NOT REQUIRED (0% MIX)"
    },
    {
      "item_id": "506 9 003",
      "category": "THINNER",
      "item_name": "SCHEKOSOL Reducer 506 9 003 (Coating)",
      "uom": "kg",
      "mix_pct": 1.0,
      "scrap_pct": 0.2,
      "net_required": 3.56,
      "gross_required": 4.45,
      "required_qty_gross": 4.45,
      "current_stock": 0.0,
      "surplus_deficit": -4.45,
      "cans_can_produce": 0,
      "pieces_can_produce": 0,
      "status": "CRITICAL SHORTAGE"
    },
    {
      "item_id": "508",
      "category": "VARNISH",
      "item_name": "SCHEKOSOL OPV GLOSS (422 9 900)",
      "uom": "kg",
      "mix_pct": 0.0,
      "scrap_pct": 0.15,
      "net_required": 0.0,
      "gross_required": 0.0,
      "required_qty_gross": 0.0,
      "current_stock": 2.0,
      "surplus_deficit": 2.0,
      "cans_can_produce": "-",
      "pieces_can_produce": "-",
      "status": "NOT REQUIRED (0% MIX)"
    },
    {
      "item_id": "509",
      "category": "VARNISH",
      "item_name": "SCHEKOSOL OPV SILKMATT (422 9 903)",
      "uom": "kg",
      "mix_pct": 1.0,
      "scrap_pct": 0.15,
      "net_required": 33.6,
      "gross_required": 39.53,
      "required_qty_gross": 39.53,
      "current_stock": 0.0,
      "surplus_deficit": -39.53,
      "cans_can_produce": 0,
      "pieces_can_produce": 0,
      "status": "CRITICAL SHORTAGE"
    },
    {
      "item_id": "608",
      "category": "INK",
      "item_name": "SunAltec MB PLUS Blue / Cyan (168400)",
      "uom": "kg",
      "mix_pct": 1.0,
      "scrap_pct": 0.125,
      "net_required": 24.5,
      "gross_required": 28.0,
      "required_qty_gross": 28.0,
      "current_stock": 2.2,
      "surplus_deficit": -25.8,
      "cans_can_produce": 7857,
      "pieces_can_produce": 7857,
      "status": "CRITICAL SHORTAGE"
    },
    {
      "item_id": "599",
      "category": "INK",
      "item_name": "SunAltec MB PLUS Yellow (168391)",
      "uom": "kg",
      "mix_pct": 1.0,
      "scrap_pct": 0.125,
      "net_required": 24.5,
      "gross_required": 28.0,
      "required_qty_gross": 28.0,
      "current_stock": 2.0,
      "surplus_deficit": -26.0,
      "cans_can_produce": 7142,
      "pieces_can_produce": 7142,
      "status": "CRITICAL SHORTAGE"
    },
    {
      "item_id": "601",
      "category": "INK",
      "item_name": "SunAltec MB PLUS Black Conc. (168404 / ERP 401295)",
      "uom": "kg",
      "mix_pct": 1.0,
      "scrap_pct": 0.125,
      "net_required": 24.5,
      "gross_required": 28.0,
      "required_qty_gross": 28.0,
      "current_stock": 1.5,
      "surplus_deficit": -26.5,
      "cans_can_produce": 5357,
      "pieces_can_produce": 5357,
      "status": "CRITICAL SHORTAGE"
    },
    {
      "item_id": "600",
      "category": "INK",
      "item_name": "SunAltec MB PLUS Magenta (168396)",
      "uom": "kg",
      "mix_pct": 1.0,
      "scrap_pct": 0.125,
      "net_required": 24.5,
      "gross_required": 28.0,
      "required_qty_gross": 28.0,
      "current_stock": 0.0,
      "surplus_deficit": -28.0,
      "cans_can_produce": 0,
      "pieces_can_produce": 0,
      "status": "CRITICAL SHORTAGE"
    },
    {
      "item_id": "607",
      "category": "INK",
      "item_name": "SunAltec MB PLUS Red 032 / P-185 C (156358/CF01)",
      "uom": "kg",
      "mix_pct": 1.0,
      "scrap_pct": 0.125,
      "net_required": 24.5,
      "gross_required": 28.0,
      "required_qty_gross": 28.0,
      "current_stock": 0.0,
      "surplus_deficit": -28.0,
      "cans_can_produce": 0,
      "pieces_can_produce": 0,
      "status": "CRITICAL SHORTAGE"
    },
    {
      "item_id": "609",
      "category": "INK",
      "item_name": "SunAltec MB PLUS Opaque White (400050 / TDS 169766)",
      "uom": "kg",
      "mix_pct": 1.0,
      "scrap_pct": 0.125,
      "net_required": 0.0,
      "gross_required": 0.0,
      "required_qty_gross": 0.0,
      "current_stock": 0.0,
      "surplus_deficit": 0.0,
      "cans_can_produce": "-",
      "pieces_can_produce": "-",
      "status": "NOT REQUIRED (0% MIX)"
    },
    {
      "item_id": "610",
      "category": "INK",
      "item_name": "SunAltec MB PLUS Spot Ink — Pantone 166-7 C (Cove)",
      "uom": "kg",
      "mix_pct": 1.0,
      "scrap_pct": 0.125,
      "net_required": 0.0,
      "gross_required": 0.0,
      "required_qty_gross": 0.0,
      "current_stock": 0.0,
      "surplus_deficit": 0.0,
      "cans_can_produce": "-",
      "pieces_can_produce": "-",
      "status": "NOT REQUIRED (0% MIX)"
    },
    {
      "item_id": "611",
      "category": "INK",
      "item_name": "SunAltec MB PLUS Spot Ink — Pantone 157-76 C (Shore)",
      "uom": "kg",
      "mix_pct": 1.0,
      "scrap_pct": 0.125,
      "net_required": 0.0,
      "gross_required": 0.0,
      "required_qty_gross": 0.0,
      "current_stock": 0.0,
      "surplus_deficit": 0.0,
      "cans_can_produce": "-",
      "pieces_can_produce": "-",
      "status": "NOT REQUIRED (0% MIX)"
    },
    {
      "item_id": "612",
      "category": "INK",
      "item_name": "SunAltec MB PLUS Green (168403 — Krone)",
      "uom": "kg",
      "mix_pct": 1.0,
      "scrap_pct": 0.125,
      "net_required": 0.0,
      "gross_required": 0.0,
      "required_qty_gross": 0.0,
      "current_stock": 0.0,
      "surplus_deficit": 0.0,
      "cans_can_produce": "-",
      "pieces_can_produce": "-",
      "status": "NOT REQUIRED (0% MIX)"
    },
    {
      "item_id": "613",
      "category": "INK",
      "item_name": "SunAltec MB PLUS Orange (168393 — Krone)",
      "uom": "kg",
      "mix_pct": 1.0,
      "scrap_pct": 0.125,
      "net_required": 0.0,
      "gross_required": 0.0,
      "required_qty_gross": 0.0,
      "current_stock": 0.0,
      "surplus_deficit": 0.0,
      "cans_can_produce": "-",
      "pieces_can_produce": "-",
      "status": "NOT REQUIRED (0% MIX)"
    },
    {
      "item_id": "614",
      "category": "INK",
      "item_name": "SunAltec MB PLUS Gray Metalized (Krone)",
      "uom": "kg",
      "mix_pct": 1.0,
      "scrap_pct": 0.125,
      "net_required": 0.0,
      "gross_required": 0.0,
      "required_qty_gross": 0.0,
      "current_stock": 0.0,
      "surplus_deficit": 0.0,
      "cans_can_produce": "-",
      "pieces_can_produce": "-",
      "status": "NOT REQUIRED (0% MIX)"
    },
    {
      "item_id": "615",
      "category": "INK",
      "item_name": "SunAltec MB PLUS Red Metalized (Krone)",
      "uom": "kg",
      "mix_pct": 1.0,
      "scrap_pct": 0.125,
      "net_required": 0.0,
      "gross_required": 0.0,
      "required_qty_gross": 0.0,
      "current_stock": 0.0,
      "surplus_deficit": 0.0,
      "cans_can_produce": "-",
      "pieces_can_produce": "-",
      "status": "NOT REQUIRED (0% MIX)"
    },
    {
      "item_id": "616",
      "category": "INK",
      "item_name": "SunAltec MB PLUS Royal Blue — Pantone 2728 C (ME Saxe)",
      "uom": "kg",
      "mix_pct": 1.0,
      "scrap_pct": 0.125,
      "net_required": 0.0,
      "gross_required": 0.0,
      "required_qty_gross": 0.0,
      "current_stock": 0.0,
      "surplus_deficit": 0.0,
      "cans_can_produce": "-",
      "pieces_can_produce": "-",
      "status": "NOT REQUIRED (0% MIX)"
    },
    {
      "item_id": "617",
      "category": "INK",
      "item_name": "SunAltec MB PLUS Navy Blue — Pantone 2758 C (ME Saxe)",
      "uom": "kg",
      "mix_pct": 1.0,
      "scrap_pct": 0.125,
      "net_required": 0.0,
      "gross_required": 0.0,
      "required_qty_gross": 0.0,
      "current_stock": 0.0,
      "surplus_deficit": 0.0,
      "cans_can_produce": "-",
      "pieces_can_produce": "-",
      "status": "NOT REQUIRED (0% MIX)"
    },
    {
      "item_id": "503",
      "category": "CLEANER",
      "item_name": "SAPILUB ALULIQUID 13 (Washer Chem)",
      "uom": "kg",
      "mix_pct": 1.0,
      "scrap_pct": 0.15,
      "net_required": 500.0,
      "gross_required": 588.24,
      "required_qty_gross": 588.24,
      "current_stock": 50.0,
      "surplus_deficit": -538.24,
      "cans_can_produce": 8499,
      "pieces_can_produce": 8499,
      "status": "CRITICAL SHORTAGE"
    },
    {
      "item_id": "PKG-BOX",
      "category": "PACKING",
      "item_name": "Corrugated Cartons (450 pcs/box | 61.5×50×41 cm)",
      "uom": "Box",
      "mix_pct": 1.0,
      "scrap_pct": 0.05,
      "net_required": 222.22,
      "gross_required": 234,
      "required_qty_gross": 234,
      "current_stock": 50.0,
      "surplus_deficit": -184.0,
      "cans_can_produce": 21367,
      "pieces_can_produce": 21367,
      "status": "CRITICAL SHORTAGE"
    },
    {
      "item_id": "PKG-PLT",
      "category": "PACKING",
      "item_name": "Wooden Pallets (3,000 cans/pallet)",
      "uom": "PLT",
      "mix_pct": 1.0,
      "scrap_pct": 0.02,
      "net_required": 33.33,
      "gross_required": 34,
      "required_qty_gross": 34,
      "current_stock": 10.0,
      "surplus_deficit": -24.0,
      "cans_can_produce": 29411,
      "pieces_can_produce": 29411,
      "status": "CRITICAL SHORTAGE"
    }
  ],
  "shifts": [
    {
      "id": 5,
      "shift_date": "2026-11-05",
      "shift_type": "Day",
      "pof_id": 1,
      "product_size": "45x131mm",
      "good_cans": 4800,
      "line_scrap": 180,
      "downtime_hours": 0.5,
      "downtime_reason": "Lance nozzle clean & print registration",
      "supervisor": "Tariq Mahmood",
      "created_at": "2026-11-05T14:30:00",
      "pof_number": "AER-POF-03",
      "customer_name": "Sarwana & Sohzsihm",
      "product_name": "Markhor Blanc 120ml",
      "total_cans": 4980,
      "scrap_pct": 3.61
    },
    {
      "id": 4,
      "shift_date": "2026-11-03",
      "shift_type": "Night",
      "pof_id": 4,
      "product_size": "45x131mm",
      "good_cans": 24900,
      "line_scrap": 750,
      "downtime_hours": 0.25,
      "downtime_reason": "Packing line carton feed pause",
      "supervisor": "M. Aslam",
      "created_at": "2026-11-04T08:00:00",
      "pof_number": "AER-POF-06",
      "customer_name": "Dari Mooch",
      "product_name": "Dari Mooch Shore 100ml",
      "total_cans": 25650,
      "scrap_pct": 2.92
    },
    {
      "id": 3,
      "shift_date": "2026-11-03",
      "shift_type": "Day",
      "pof_id": 4,
      "product_size": "45x131mm",
      "good_cans": 24900,
      "line_scrap": 810,
      "downtime_hours": 0.5,
      "downtime_reason": "Washer rinse nozzle clean",
      "supervisor": "Tariq Mahmood",
      "created_at": "2026-11-03T20:00:00",
      "pof_number": "AER-POF-06",
      "customer_name": "Dari Mooch",
      "product_name": "Dari Mooch Shore 100ml",
      "total_cans": 25710,
      "scrap_pct": 3.15
    },
    {
      "id": 2,
      "shift_date": "2026-11-02",
      "shift_type": "Night",
      "pof_id": 4,
      "product_size": "45x131mm",
      "good_cans": 25200,
      "line_scrap": 710,
      "downtime_hours": 0.25,
      "downtime_reason": "Minor ink fountain adjust",
      "supervisor": "M. Aslam",
      "created_at": "2026-11-03T08:00:00",
      "pof_number": "AER-POF-06",
      "customer_name": "Dari Mooch",
      "product_name": "Dari Mooch Shore 100ml",
      "total_cans": 25910,
      "scrap_pct": 2.74
    },
    {
      "id": 1,
      "shift_date": "2026-11-02",
      "shift_type": "Day",
      "pof_id": 4,
      "product_size": "45x131mm",
      "good_cans": 25000,
      "line_scrap": 780,
      "downtime_hours": 0.5,
      "downtime_reason": "Line startup & roller coater setup",
      "supervisor": "Tariq Mahmood",
      "created_at": "2026-11-02T20:00:00",
      "pof_number": "AER-POF-06",
      "customer_name": "Dari Mooch",
      "product_name": "Dari Mooch Shore 100ml",
      "total_cans": 25780,
      "scrap_pct": 3.03
    }
  ],
  "inventory": [
    {
      "id": 8,
      "item_code": "506",
      "category": "BASE COAT",
      "item_name": "SCHEKOSOL WH BC (422 0 903) White",
      "uom": "kg",
      "balance_qty": 15.0,
      "min_stock_level": 100.0,
      "unit_cost_pkr": 2100.0,
      "batch_number": "BC-2026-W3",
      "received_date": "2026-08-28",
      "shelf_life_days": 180,
      "storage_condition": "Air Conditioned (20°C - 25°C)",
      "location": "Cold Room Rack B1",
      "updated_at": "2026-11-06T10:00:00",
      "shelf_evaluation": {
        "age_days": 78,
        "remaining_days": 102,
        "shelf_life_days": 180,
        "status": "normal",
        "badge_color": "#10b981",
        "label": "Normal / Fresh (<120d)",
        "expiry_date": "2027-02-24"
      },
      "daily_burn_rate": 34.98,
      "days_of_stock": 0.4,
      "is_climate_sensitive": true,
      "stock_status": "Low Stock"
    },
    {
      "id": 9,
      "item_code": "507",
      "category": "BASE COAT",
      "item_name": "SCHEKOSOL CLEAR BC (422 9 918) Clear",
      "uom": "kg",
      "balance_qty": 0.0,
      "min_stock_level": 50.0,
      "unit_cost_pkr": 2300.0,
      "batch_number": "BC-2026-C2",
      "received_date": "2026-08-28",
      "shelf_life_days": 180,
      "storage_condition": "Air Conditioned (20°C - 25°C)",
      "location": "Cold Room Rack B2",
      "updated_at": "2026-11-06T10:00:00",
      "shelf_evaluation": {
        "age_days": 78,
        "remaining_days": 102,
        "shelf_life_days": 180,
        "status": "normal",
        "badge_color": "#10b981",
        "label": "Normal / Fresh (<120d)",
        "expiry_date": "2027-02-24"
      },
      "daily_burn_rate": 25.21,
      "days_of_stock": 0.0,
      "is_climate_sensitive": true,
      "stock_status": "Low Stock"
    },
    {
      "id": 4,
      "item_code": "503",
      "category": "CLEANER",
      "item_name": "SAPILUB ALULIQUID 13 (Washer Chem)",
      "uom": "kg",
      "balance_qty": 50.0,
      "min_stock_level": 200.0,
      "unit_cost_pkr": 850.0,
      "batch_number": "ALU-2026-03",
      "received_date": "2026-08-15",
      "shelf_life_days": 1080,
      "storage_condition": "Ambient Chemical Bay (5°C - 35°C)",
      "location": "Washer Chemical Storage (WIP Bath 50kg)",
      "updated_at": "2026-11-06T10:00:00",
      "shelf_evaluation": {
        "age_days": 91,
        "remaining_days": 989,
        "shelf_life_days": 1080,
        "status": "normal",
        "badge_color": "#10b981",
        "label": "Normal / Fresh (<120d)",
        "expiry_date": "2029-07-30"
      },
      "daily_burn_rate": 205.49,
      "days_of_stock": 0.2,
      "is_climate_sensitive": false,
      "stock_status": "Low Stock"
    },
    {
      "id": 14,
      "item_code": "599",
      "category": "INK",
      "item_name": "SunAltec MB PLUS Yellow (168391)",
      "uom": "kg",
      "balance_qty": 2.0,
      "min_stock_level": 25.0,
      "unit_cost_pkr": 4600.0,
      "batch_number": "INK-2026-YL",
      "received_date": "2026-08-15",
      "shelf_life_days": 1080,
      "storage_condition": "Ambient Dry Store (15°C - 30°C)",
      "location": "Ink Dispensing Station",
      "updated_at": "2026-11-06T10:00:00",
      "shelf_evaluation": {
        "age_days": 91,
        "remaining_days": 989,
        "shelf_life_days": 1080,
        "status": "normal",
        "badge_color": "#10b981",
        "label": "Normal / Fresh (<120d)",
        "expiry_date": "2029-07-30"
      },
      "daily_burn_rate": 9.78,
      "days_of_stock": 0.2,
      "is_climate_sensitive": false,
      "stock_status": "Low Stock"
    },
    {
      "id": 16,
      "item_code": "600",
      "category": "INK",
      "item_name": "SunAltec MB PLUS Magenta (168396)",
      "uom": "kg",
      "balance_qty": 0.0,
      "min_stock_level": 25.0,
      "unit_cost_pkr": 4800.0,
      "batch_number": "INK-2026-MG",
      "received_date": "2026-08-15",
      "shelf_life_days": 1080,
      "storage_condition": "Ambient Dry Store (15°C - 30°C)",
      "location": "Ink Dispensing Station",
      "updated_at": "2026-11-06T10:00:00",
      "shelf_evaluation": {
        "age_days": 91,
        "remaining_days": 989,
        "shelf_life_days": 1080,
        "status": "normal",
        "badge_color": "#10b981",
        "label": "Normal / Fresh (<120d)",
        "expiry_date": "2029-07-30"
      },
      "daily_burn_rate": 9.78,
      "days_of_stock": 0.0,
      "is_climate_sensitive": false,
      "stock_status": "Low Stock"
    },
    {
      "id": 15,
      "item_code": "601",
      "category": "INK",
      "item_name": "SunAltec MB PLUS Black Conc. (168404 / ERP 401295)",
      "uom": "kg",
      "balance_qty": 1.5,
      "min_stock_level": 25.0,
      "unit_cost_pkr": 4300.0,
      "batch_number": "INK-2026-BK",
      "received_date": "2026-08-15",
      "shelf_life_days": 1080,
      "storage_condition": "Ambient Dry Store (15°C - 30°C)",
      "location": "Ink Dispensing Station",
      "updated_at": "2026-11-06T10:00:00",
      "shelf_evaluation": {
        "age_days": 91,
        "remaining_days": 989,
        "shelf_life_days": 1080,
        "status": "normal",
        "badge_color": "#10b981",
        "label": "Normal / Fresh (<120d)",
        "expiry_date": "2029-07-30"
      },
      "daily_burn_rate": 9.78,
      "days_of_stock": 0.2,
      "is_climate_sensitive": false,
      "stock_status": "Low Stock"
    },
    {
      "id": 17,
      "item_code": "607",
      "category": "INK",
      "item_name": "SunAltec MB PLUS Red 032 / Pantone 185 C (156358/CF01)",
      "uom": "kg",
      "balance_qty": 0.0,
      "min_stock_level": 25.0,
      "unit_cost_pkr": 5200.0,
      "batch_number": "INK-2026-RD",
      "received_date": "2026-08-15",
      "shelf_life_days": 1080,
      "storage_condition": "Ambient Dry Store (15°C - 30°C)",
      "location": "Ink Dispensing Station",
      "updated_at": "2026-11-06T10:00:00",
      "shelf_evaluation": {
        "age_days": 91,
        "remaining_days": 989,
        "shelf_life_days": 1080,
        "status": "normal",
        "badge_color": "#10b981",
        "label": "Normal / Fresh (<120d)",
        "expiry_date": "2029-07-30"
      },
      "daily_burn_rate": 9.78,
      "days_of_stock": 0.0,
      "is_climate_sensitive": false,
      "stock_status": "Low Stock"
    },
    {
      "id": 13,
      "item_code": "608",
      "category": "INK",
      "item_name": "SunAltec MB PLUS Blue / Cyan (168400)",
      "uom": "kg",
      "balance_qty": 2.2,
      "min_stock_level": 25.0,
      "unit_cost_pkr": 4900.0,
      "batch_number": "INK-2026-BL",
      "received_date": "2026-08-15",
      "shelf_life_days": 1080,
      "storage_condition": "Ambient Dry Store (15°C - 30°C)",
      "location": "Ink Dispensing Station",
      "updated_at": "2026-11-06T10:00:00",
      "shelf_evaluation": {
        "age_days": 91,
        "remaining_days": 989,
        "shelf_life_days": 1080,
        "status": "normal",
        "badge_color": "#10b981",
        "label": "Normal / Fresh (<120d)",
        "expiry_date": "2029-07-30"
      },
      "daily_burn_rate": 9.78,
      "days_of_stock": 0.2,
      "is_climate_sensitive": false,
      "stock_status": "Low Stock"
    },
    {
      "id": 18,
      "item_code": "609",
      "category": "INK",
      "item_name": "SunAltec MB PLUS Opaque White (400050 / TDS 169766)",
      "uom": "kg",
      "balance_qty": 0.0,
      "min_stock_level": 25.0,
      "unit_cost_pkr": 4200.0,
      "batch_number": "INK-2026-OW",
      "received_date": "2026-08-15",
      "shelf_life_days": 1080,
      "storage_condition": "Ambient Dry Store (15°C - 30°C)",
      "location": "Ink Dispensing Station",
      "updated_at": "2026-11-06T10:00:00",
      "shelf_evaluation": {
        "age_days": 91,
        "remaining_days": 989,
        "shelf_life_days": 1080,
        "status": "normal",
        "badge_color": "#10b981",
        "label": "Normal / Fresh (<120d)",
        "expiry_date": "2029-07-30"
      },
      "daily_burn_rate": 9.78,
      "days_of_stock": 0.0,
      "is_climate_sensitive": false,
      "stock_status": "Low Stock"
    },
    {
      "id": 19,
      "item_code": "610",
      "category": "INK",
      "item_name": "SunAltec MB PLUS Pantone 166-7 C (Orange-Red, Cove)",
      "uom": "kg",
      "balance_qty": 0.0,
      "min_stock_level": 25.0,
      "unit_cost_pkr": 5200.0,
      "batch_number": "INK-2026-OR",
      "received_date": "2026-08-15",
      "shelf_life_days": 1080,
      "storage_condition": "Ambient Dry Store (15°C - 30°C)",
      "location": "Ink Dispensing Station",
      "updated_at": "2026-11-06T10:00:00",
      "shelf_evaluation": {
        "age_days": 91,
        "remaining_days": 989,
        "shelf_life_days": 1080,
        "status": "normal",
        "badge_color": "#10b981",
        "label": "Normal / Fresh (<120d)",
        "expiry_date": "2029-07-30"
      },
      "daily_burn_rate": 9.78,
      "days_of_stock": 0.0,
      "is_climate_sensitive": false,
      "stock_status": "Low Stock"
    },
    {
      "id": 20,
      "item_code": "611",
      "category": "INK",
      "item_name": "SunAltec MB PLUS Pantone 157-76 C (Teal/Blue, Shore)",
      "uom": "kg",
      "balance_qty": 0.0,
      "min_stock_level": 25.0,
      "unit_cost_pkr": 5200.0,
      "batch_number": "INK-2026-TL",
      "received_date": "2026-08-15",
      "shelf_life_days": 1080,
      "storage_condition": "Ambient Dry Store (15°C - 30°C)",
      "location": "Ink Dispensing Station",
      "updated_at": "2026-11-06T10:00:00",
      "shelf_evaluation": {
        "age_days": 91,
        "remaining_days": 989,
        "shelf_life_days": 1080,
        "status": "normal",
        "badge_color": "#10b981",
        "label": "Normal / Fresh (<120d)",
        "expiry_date": "2029-07-30"
      },
      "daily_burn_rate": 9.78,
      "days_of_stock": 0.0,
      "is_climate_sensitive": false,
      "stock_status": "Low Stock"
    },
    {
      "id": 21,
      "item_code": "612",
      "category": "INK",
      "item_name": "SunAltec MB PLUS Green (168403, Krone)",
      "uom": "kg",
      "balance_qty": 0.0,
      "min_stock_level": 25.0,
      "unit_cost_pkr": 5100.0,
      "batch_number": "INK-2026-GR",
      "received_date": "2026-08-15",
      "shelf_life_days": 1080,
      "storage_condition": "Ambient Dry Store (15°C - 30°C)",
      "location": "Ink Dispensing Station",
      "updated_at": "2026-11-06T10:00:00",
      "shelf_evaluation": {
        "age_days": 91,
        "remaining_days": 989,
        "shelf_life_days": 1080,
        "status": "normal",
        "badge_color": "#10b981",
        "label": "Normal / Fresh (<120d)",
        "expiry_date": "2029-07-30"
      },
      "daily_burn_rate": 9.78,
      "days_of_stock": 0.0,
      "is_climate_sensitive": false,
      "stock_status": "Low Stock"
    },
    {
      "id": 22,
      "item_code": "613",
      "category": "INK",
      "item_name": "SunAltec MB PLUS Orange (168393, Krone)",
      "uom": "kg",
      "balance_qty": 0.0,
      "min_stock_level": 25.0,
      "unit_cost_pkr": 5100.0,
      "batch_number": "INK-2026-OG",
      "received_date": "2026-08-15",
      "shelf_life_days": 1080,
      "storage_condition": "Ambient Dry Store (15°C - 30°C)",
      "location": "Ink Dispensing Station",
      "updated_at": "2026-11-06T10:00:00",
      "shelf_evaluation": {
        "age_days": 91,
        "remaining_days": 989,
        "shelf_life_days": 1080,
        "status": "normal",
        "badge_color": "#10b981",
        "label": "Normal / Fresh (<120d)",
        "expiry_date": "2029-07-30"
      },
      "daily_burn_rate": 9.78,
      "days_of_stock": 0.0,
      "is_climate_sensitive": false,
      "stock_status": "Low Stock"
    },
    {
      "id": 23,
      "item_code": "614",
      "category": "INK",
      "item_name": "SunAltec MB PLUS Gray Metalized (Krone)",
      "uom": "kg",
      "balance_qty": 0.0,
      "min_stock_level": 25.0,
      "unit_cost_pkr": 5400.0,
      "batch_number": "INK-2026-GM",
      "received_date": "2026-08-15",
      "shelf_life_days": 1080,
      "storage_condition": "Ambient Dry Store (15°C - 30°C)",
      "location": "Ink Dispensing Station",
      "updated_at": "2026-11-06T10:00:00",
      "shelf_evaluation": {
        "age_days": 91,
        "remaining_days": 989,
        "shelf_life_days": 1080,
        "status": "normal",
        "badge_color": "#10b981",
        "label": "Normal / Fresh (<120d)",
        "expiry_date": "2029-07-30"
      },
      "daily_burn_rate": 9.78,
      "days_of_stock": 0.0,
      "is_climate_sensitive": false,
      "stock_status": "Low Stock"
    },
    {
      "id": 24,
      "item_code": "615",
      "category": "INK",
      "item_name": "SunAltec MB PLUS Red Metalized (Krone)",
      "uom": "kg",
      "balance_qty": 0.0,
      "min_stock_level": 25.0,
      "unit_cost_pkr": 5400.0,
      "batch_number": "INK-2026-RM",
      "received_date": "2026-08-15",
      "shelf_life_days": 1080,
      "storage_condition": "Ambient Dry Store (15°C - 30°C)",
      "location": "Ink Dispensing Station",
      "updated_at": "2026-11-06T10:00:00",
      "shelf_evaluation": {
        "age_days": 91,
        "remaining_days": 989,
        "shelf_life_days": 1080,
        "status": "normal",
        "badge_color": "#10b981",
        "label": "Normal / Fresh (<120d)",
        "expiry_date": "2029-07-30"
      },
      "daily_burn_rate": 9.78,
      "days_of_stock": 0.0,
      "is_climate_sensitive": false,
      "stock_status": "Low Stock"
    },
    {
      "id": 25,
      "item_code": "616",
      "category": "INK",
      "item_name": "SunAltec MB PLUS Pantone 2728 C (Royal Blue, ME Saxe)",
      "uom": "kg",
      "balance_qty": 0.0,
      "min_stock_level": 25.0,
      "unit_cost_pkr": 5200.0,
      "batch_number": "INK-2026-RY",
      "received_date": "2026-08-15",
      "shelf_life_days": 1080,
      "storage_condition": "Ambient Dry Store (15°C - 30°C)",
      "location": "Ink Dispensing Station",
      "updated_at": "2026-11-06T10:00:00",
      "shelf_evaluation": {
        "age_days": 91,
        "remaining_days": 989,
        "shelf_life_days": 1080,
        "status": "normal",
        "badge_color": "#10b981",
        "label": "Normal / Fresh (<120d)",
        "expiry_date": "2029-07-30"
      },
      "daily_burn_rate": 9.78,
      "days_of_stock": 0.0,
      "is_climate_sensitive": false,
      "stock_status": "Low Stock"
    },
    {
      "id": 26,
      "item_code": "617",
      "category": "INK",
      "item_name": "SunAltec MB PLUS Pantone 2758 C (Navy Blue, ME Saxe)",
      "uom": "kg",
      "balance_qty": 0.0,
      "min_stock_level": 25.0,
      "unit_cost_pkr": 5200.0,
      "batch_number": "INK-2026-NV",
      "received_date": "2026-08-15",
      "shelf_life_days": 1080,
      "storage_condition": "Ambient Dry Store (15°C - 30°C)",
      "location": "Ink Dispensing Station",
      "updated_at": "2026-11-06T10:00:00",
      "shelf_evaluation": {
        "age_days": 91,
        "remaining_days": 989,
        "shelf_life_days": 1080,
        "status": "normal",
        "badge_color": "#10b981",
        "label": "Normal / Fresh (<120d)",
        "expiry_date": "2029-07-30"
      },
      "daily_burn_rate": 9.78,
      "days_of_stock": 0.0,
      "is_climate_sensitive": false,
      "stock_status": "Low Stock"
    },
    {
      "id": 5,
      "item_code": "504",
      "category": "LACQUER",
      "item_name": "SCHEKOSOL INT PROT Gold (400 9 901)",
      "uom": "kg",
      "balance_qty": 30.0,
      "min_stock_level": 100.0,
      "unit_cost_pkr": 3200.0,
      "batch_number": "LAC-2026-G2",
      "received_date": "2026-08-25",
      "shelf_life_days": 240,
      "storage_condition": "Air Conditioned (20°C - 25°C)",
      "location": "Cold Room Rack A1",
      "updated_at": "2026-11-06T10:00:00",
      "shelf_evaluation": {
        "age_days": 81,
        "remaining_days": 159,
        "shelf_life_days": 240,
        "status": "normal",
        "badge_color": "#10b981",
        "label": "Normal / Fresh (<120d)",
        "expiry_date": "2027-04-22"
      },
      "daily_burn_rate": 35.82,
      "days_of_stock": 0.8,
      "is_climate_sensitive": true,
      "stock_status": "Low Stock"
    },
    {
      "id": 6,
      "item_code": "505",
      "category": "LACQUER",
      "item_name": "SCHEKOSOL INT BEIGE (400 4 902)",
      "uom": "kg",
      "balance_qty": 0.0,
      "min_stock_level": 50.0,
      "unit_cost_pkr": 3400.0,
      "batch_number": "LAC-2026-B2",
      "received_date": "2026-08-25",
      "shelf_life_days": 240,
      "storage_condition": "Air Conditioned (20°C - 25°C)",
      "location": "Cold Room Rack A2",
      "updated_at": "2026-11-06T10:00:00",
      "shelf_evaluation": {
        "age_days": 81,
        "remaining_days": 159,
        "shelf_life_days": 240,
        "status": "normal",
        "badge_color": "#10b981",
        "label": "Normal / Fresh (<120d)",
        "expiry_date": "2027-04-22"
      },
      "daily_burn_rate": 39.08,
      "days_of_stock": 0.0,
      "is_climate_sensitive": true,
      "stock_status": "Low Stock"
    },
    {
      "id": 3,
      "item_code": "502",
      "category": "LUBRICANT",
      "item_name": "SAPILUB LUBRIMET GR8 (Extrusion Paste Lubricant)",
      "uom": "kg",
      "balance_qty": 2.0,
      "min_stock_level": 5.0,
      "unit_cost_pkr": 2400.0,
      "batch_number": "LUB-2026-04",
      "received_date": "2026-08-15",
      "shelf_life_days": 1080,
      "storage_condition": "Ambient Dry Store (5°C - 30°C)",
      "location": "Chemical Room Bay 1",
      "updated_at": "2026-11-06T10:00:00",
      "shelf_evaluation": {
        "age_days": 91,
        "remaining_days": 989,
        "shelf_life_days": 1080,
        "status": "normal",
        "badge_color": "#10b981",
        "label": "Normal / Fresh (<120d)",
        "expiry_date": "2029-07-30"
      },
      "daily_burn_rate": 1.14,
      "days_of_stock": 1.8,
      "is_climate_sensitive": false,
      "stock_status": "Low Stock"
    },
    {
      "id": 27,
      "item_code": "PKG-BOX",
      "category": "PACKING",
      "item_name": "Corrugated Cartons (450 pcs/box | 61.5×50×41 cm | NW 10.3 / GW 12.5 kg)",
      "uom": "Box",
      "balance_qty": 50.0,
      "min_stock_level": 200.0,
      "unit_cost_pkr": 120.0,
      "batch_number": "BOX-2026-11",
      "received_date": "2026-10-15",
      "shelf_life_days": 1080,
      "storage_condition": "Ambient Dry Store",
      "location": "Packing Store Bay 1 (Ref SH26/29/D173)",
      "updated_at": "2026-11-06T10:00:00",
      "shelf_evaluation": {
        "age_days": 30,
        "remaining_days": 1050,
        "shelf_life_days": 1080,
        "status": "normal",
        "badge_color": "#10b981",
        "label": "Normal / Fresh (<120d)",
        "expiry_date": "2029-09-29"
      },
      "daily_burn_rate": 81.72,
      "days_of_stock": 0.6,
      "is_climate_sensitive": false,
      "stock_status": "Low Stock"
    },
    {
      "id": 28,
      "item_code": "PKG-PLT",
      "category": "PACKING",
      "item_name": "Wooden Pallets (3,000 cans/pallet)",
      "uom": "PLT",
      "balance_qty": 10.0,
      "min_stock_level": 30.0,
      "unit_cost_pkr": 1800.0,
      "batch_number": "PLT-2026-11",
      "received_date": "2026-10-15",
      "shelf_life_days": 1080,
      "storage_condition": "Outdoor Covered Yard",
      "location": "Pallet Staging Area",
      "updated_at": "2026-11-06T10:00:00",
      "shelf_evaluation": {
        "age_days": 30,
        "remaining_days": 1050,
        "shelf_life_days": 1080,
        "status": "normal",
        "badge_color": "#10b981",
        "label": "Normal / Fresh (<120d)",
        "expiry_date": "2029-09-29"
      },
      "daily_burn_rate": 11.88,
      "days_of_stock": 0.8,
      "is_climate_sensitive": false,
      "stock_status": "Low Stock"
    },
    {
      "id": 2,
      "item_code": "500",
      "category": "SLUG",
      "item_name": "45mm Slug (6.5mm Thickness, Heavy Wall)",
      "uom": "kg",
      "balance_qty": 65.0,
      "min_stock_level": 200.0,
      "unit_cost_pkr": 820.0,
      "batch_number": "SLUG-2026-08B",
      "received_date": "2026-08-15",
      "shelf_life_days": 1080,
      "storage_condition": "Ambient Dry Store (5°C - 30°C)",
      "location": "Kot Abdul Malik Central Stores",
      "updated_at": "2026-11-06T10:00:00",
      "shelf_evaluation": {
        "age_days": 91,
        "remaining_days": 989,
        "shelf_life_days": 1080,
        "status": "normal",
        "badge_color": "#10b981",
        "label": "Normal / Fresh (<120d)",
        "expiry_date": "2029-07-30"
      },
      "daily_burn_rate": 1147.14,
      "days_of_stock": 0.1,
      "is_climate_sensitive": false,
      "stock_status": "Low Stock"
    },
    {
      "id": 1,
      "item_code": "501",
      "category": "SLUG",
      "item_name": "Slug 45mm (38 pcs/kg, Al 99.7%)",
      "uom": "kg",
      "balance_qty": 150.0,
      "min_stock_level": 1000.0,
      "unit_cost_pkr": 780.0,
      "batch_number": "SLUG-2026-08A",
      "received_date": "2026-08-15",
      "shelf_life_days": 1080,
      "storage_condition": "Ambient Dry Store (5°C - 30°C)",
      "location": "Kot Abdul Malik Central Stores",
      "updated_at": "2026-11-06T10:00:00",
      "shelf_evaluation": {
        "age_days": 91,
        "remaining_days": 989,
        "shelf_life_days": 1080,
        "status": "normal",
        "badge_color": "#10b981",
        "label": "Normal / Fresh (<120d)",
        "expiry_date": "2029-07-30"
      },
      "daily_burn_rate": 1081.54,
      "days_of_stock": 0.1,
      "is_climate_sensitive": false,
      "stock_status": "Low Stock"
    },
    {
      "id": 10,
      "item_code": "506 9 003",
      "category": "THINNER",
      "item_name": "SCHEKOSOL Reducer 506 9 003 (Coating)",
      "uom": "kg",
      "balance_qty": 0.0,
      "min_stock_level": 20.0,
      "unit_cost_pkr": 1200.0,
      "batch_number": "THN-2026-C1",
      "received_date": "2026-08-28",
      "shelf_life_days": 1080,
      "storage_condition": "Ambient Chemical Bay",
      "location": "Solvent Storage",
      "updated_at": "2026-11-06T10:00:00",
      "shelf_evaluation": {
        "age_days": 78,
        "remaining_days": 1002,
        "shelf_life_days": 1080,
        "status": "normal",
        "badge_color": "#10b981",
        "label": "Normal / Fresh (<120d)",
        "expiry_date": "2029-08-12"
      },
      "daily_burn_rate": 1.55,
      "days_of_stock": 0.0,
      "is_climate_sensitive": false,
      "stock_status": "Low Stock"
    },
    {
      "id": 7,
      "item_code": "506 9 901",
      "category": "THINNER",
      "item_name": "SCHEKOSOL Reducer 506 9 901 (Lacquer)",
      "uom": "kg",
      "balance_qty": 0.0,
      "min_stock_level": 20.0,
      "unit_cost_pkr": 1200.0,
      "batch_number": "THN-2026-L1",
      "received_date": "2026-08-25",
      "shelf_life_days": 1080,
      "storage_condition": "Ambient Chemical Bay",
      "location": "Solvent Storage",
      "updated_at": "2026-11-06T10:00:00",
      "shelf_evaluation": {
        "age_days": 81,
        "remaining_days": 999,
        "shelf_life_days": 1080,
        "status": "normal",
        "badge_color": "#10b981",
        "label": "Normal / Fresh (<120d)",
        "expiry_date": "2029-08-09"
      },
      "daily_burn_rate": 1.21,
      "days_of_stock": 0.0,
      "is_climate_sensitive": false,
      "stock_status": "Low Stock"
    },
    {
      "id": 11,
      "item_code": "508",
      "category": "VARNISH",
      "item_name": "SCHEKOSOL OPV GLOSSY (422 9 900)",
      "uom": "kg",
      "balance_qty": 2.0,
      "min_stock_level": 50.0,
      "unit_cost_pkr": 1900.0,
      "batch_number": "OPV-2026-G4",
      "received_date": "2026-09-01",
      "shelf_life_days": 180,
      "storage_condition": "Air Conditioned (20°C - 25°C)",
      "location": "Cold Room Rack C1",
      "updated_at": "2026-11-06T10:00:00",
      "shelf_evaluation": {
        "age_days": 74,
        "remaining_days": 106,
        "shelf_life_days": 180,
        "status": "normal",
        "badge_color": "#10b981",
        "label": "Normal / Fresh (<120d)",
        "expiry_date": "2027-02-28"
      },
      "daily_burn_rate": 15.45,
      "days_of_stock": 0.1,
      "is_climate_sensitive": true,
      "stock_status": "Low Stock"
    },
    {
      "id": 12,
      "item_code": "509",
      "category": "VARNISH",
      "item_name": "SCHEKOSOL OPV SILKMATT (422 9 903)",
      "uom": "kg",
      "balance_qty": 0.0,
      "min_stock_level": 50.0,
      "unit_cost_pkr": 2250.0,
      "batch_number": "OPV-2026-S2",
      "received_date": "2026-09-01",
      "shelf_life_days": 180,
      "storage_condition": "Air Conditioned (20°C - 25°C)",
      "location": "Cold Room Rack C2",
      "updated_at": "2026-11-06T10:00:00",
      "shelf_evaluation": {
        "age_days": 74,
        "remaining_days": 106,
        "shelf_life_days": 180,
        "status": "normal",
        "badge_color": "#10b981",
        "label": "Normal / Fresh (<120d)",
        "expiry_date": "2027-02-28"
      },
      "daily_burn_rate": 13.83,
      "days_of_stock": 0.0,
      "is_climate_sensitive": true,
      "stock_status": "Low Stock"
    }
  ],
  "dispatches": [
    {
      "id": 1,
      "challan_number": "DC-2026-006",
      "dispatch_date": "2026-11-04",
      "pof_id": 4,
      "dispatched_cans": 100000,
      "carton_count": 223,
      "pallet_count": 33,
      "vehicle_number": "LES-8821",
      "driver_name": "Muhammad Akram",
      "receiver_party": "Dari Mooch",
      "status": "Delivered",
      "created_at": "2026-11-04T16:00:00",
      "pof_number": "AER-POF-06",
      "customer_name": "Dari Mooch",
      "product_name": "Dari Mooch Shore 100ml",
      "product_size": "45x131mm (140mm post-press)"
    }
  ],
  "standards": {
    "45x160mm": {
      "product_size": "45x160mm",
      "can_qty": 100000,
      "geometry": {
        "diameter_mm": 45.0,
        "height_mm": 160.0,
        "wall_thickness_mm": 0.4,
        "slug_weight_g": 20.0,
        "outer_surface_m2": 0.022619467105846513,
        "inner_surface_m2": 0.02375172851412681
      },
      "estimated_shifts": 4,
      "slug_tonnage": 2.222,
      "items": [
        {
          "item_code": "501",
          "material_group": "Aluminum Slugs",
          "item_name": "45mm Aluminum Slug (Al99.7%)",
          "uom": "kg",
          "net_rate_per_1000": 20.0,
          "scrap_pct": 10.0,
          "gross_rate_per_1000": 22.222,
          "net_total": 2000.0,
          "gross_total": 2222.22,
          "formula": "Slug wt (g) x 1,000 / (1 - 0.10)"
        },
        {
          "item_code": "502",
          "material_group": "Extrusion Lubricant",
          "item_name": "SAPILUB LUBRIMET GR8",
          "uom": "kg",
          "net_rate_per_1000": 0.021,
          "scrap_pct": 10.0,
          "gross_rate_per_1000": 0.0233,
          "net_total": 2.1,
          "gross_total": 2.333,
          "formula": "105g / 100kg Slugs / (1 - 0.10)"
        },
        {
          "item_code": "503",
          "material_group": "Alkaline Cleaner",
          "item_name": "SAPILUB ALULIQUID 13",
          "uom": "kg",
          "net_rate_per_1000": 5.0,
          "scrap_pct": 10.0,
          "gross_rate_per_1000": 5.556,
          "net_total": 500.0,
          "gross_total": 555.56,
          "formula": "Empirical 5.0 kg / 1,000 / (1 - 0.10)"
        },
        {
          "item_code": "504",
          "material_group": "Internal Lacquer",
          "item_name": "SCHEKOSOL INT PROT Gold (400 9 901)",
          "uom": "kg",
          "net_rate_per_1000": 1.045,
          "scrap_pct": 35.0,
          "gross_rate_per_1000": 1.608,
          "net_total": 104.51,
          "gross_total": 160.78,
          "formula": "Inner Area (m²) x 44g/m² / (1 - 0.35) [Transfer efficiency 65%]"
        },
        {
          "item_code": "506",
          "material_group": "External Base Coat",
          "item_name": "SCHEKOSOL WH BC (422 0 903)",
          "uom": "kg",
          "net_rate_per_1000": 0.973,
          "scrap_pct": 10.0,
          "gross_rate_per_1000": 1.081,
          "net_total": 97.26,
          "gross_total": 108.07,
          "formula": "Outer Area (m²) x 43g/m² / (1 - 0.10) [Transfer efficiency 90%]"
        },
        {
          "item_code": "508",
          "material_group": "Overprint Varnish",
          "item_name": "SCHEKOSOL OPV GLOSSY (422 9 900)",
          "uom": "kg",
          "net_rate_per_1000": 0.43,
          "scrap_pct": 10.0,
          "gross_rate_per_1000": 0.478,
          "net_total": 42.98,
          "gross_total": 47.75,
          "formula": "Outer Area (m²) x 19g/m² / (1 - 0.10) [Transfer efficiency 90%]"
        },
        {
          "item_code": "510",
          "material_group": "Printing Ink",
          "item_name": "SunAltec MB PLUS Dry-Offset Inks (4 Colors)",
          "uom": "kg",
          "net_rate_per_1000": 1.12,
          "scrap_pct": 10.0,
          "gross_rate_per_1000": 1.244,
          "net_total": 112.0,
          "gross_total": 124.44,
          "formula": "4 colors x 0.280 kg / 1,000 / (1 - 0.10)"
        }
      ],
      "summary": {
        "slug_gross_kg": 2222.2,
        "lacquer_gross_kg": 160.78,
        "base_coat_gross_kg": 108.07,
        "varnish_gross_kg": 47.75,
        "total_ink_gross_kg": 124.44,
        "cleaner_gross_kg": 555.6
      }
    },
    "45x150mm": {
      "product_size": "45x150mm",
      "can_qty": 100000,
      "geometry": {
        "diameter_mm": 45.0,
        "height_mm": 150.0,
        "wall_thickness_mm": 0.35,
        "slug_weight_g": 19.0,
        "outer_surface_m2": 0.021205750411731103,
        "inner_surface_m2": 0.02241721922479003
      },
      "estimated_shifts": 4,
      "slug_tonnage": 2.111,
      "items": [
        {
          "item_code": "501",
          "material_group": "Aluminum Slugs",
          "item_name": "45mm Aluminum Slug (Al99.7%)",
          "uom": "kg",
          "net_rate_per_1000": 19.0,
          "scrap_pct": 10.0,
          "gross_rate_per_1000": 21.111,
          "net_total": 1900.0,
          "gross_total": 2111.11,
          "formula": "Slug wt (g) x 1,000 / (1 - 0.10)"
        },
        {
          "item_code": "502",
          "material_group": "Extrusion Lubricant",
          "item_name": "SAPILUB LUBRIMET GR8",
          "uom": "kg",
          "net_rate_per_1000": 0.0199,
          "scrap_pct": 10.0,
          "gross_rate_per_1000": 0.0222,
          "net_total": 1.995,
          "gross_total": 2.217,
          "formula": "105g / 100kg Slugs / (1 - 0.10)"
        },
        {
          "item_code": "503",
          "material_group": "Alkaline Cleaner",
          "item_name": "SAPILUB ALULIQUID 13",
          "uom": "kg",
          "net_rate_per_1000": 5.0,
          "scrap_pct": 10.0,
          "gross_rate_per_1000": 5.556,
          "net_total": 500.0,
          "gross_total": 555.56,
          "formula": "Empirical 5.0 kg / 1,000 / (1 - 0.10)"
        },
        {
          "item_code": "504",
          "material_group": "Internal Lacquer",
          "item_name": "SCHEKOSOL INT PROT Gold (400 9 901)",
          "uom": "kg",
          "net_rate_per_1000": 0.986,
          "scrap_pct": 35.0,
          "gross_rate_per_1000": 1.517,
          "net_total": 98.64,
          "gross_total": 151.75,
          "formula": "Inner Area (m²) x 44g/m² / (1 - 0.35) [Transfer efficiency 65%]"
        },
        {
          "item_code": "506",
          "material_group": "External Base Coat",
          "item_name": "SCHEKOSOL WH BC (422 0 903)",
          "uom": "kg",
          "net_rate_per_1000": 0.912,
          "scrap_pct": 10.0,
          "gross_rate_per_1000": 1.013,
          "net_total": 91.18,
          "gross_total": 101.32,
          "formula": "Outer Area (m²) x 43g/m² / (1 - 0.10) [Transfer efficiency 90%]"
        },
        {
          "item_code": "508",
          "material_group": "Overprint Varnish",
          "item_name": "SCHEKOSOL OPV GLOSSY (422 9 900)",
          "uom": "kg",
          "net_rate_per_1000": 0.403,
          "scrap_pct": 10.0,
          "gross_rate_per_1000": 0.448,
          "net_total": 40.29,
          "gross_total": 44.77,
          "formula": "Outer Area (m²) x 19g/m² / (1 - 0.10) [Transfer efficiency 90%]"
        },
        {
          "item_code": "510",
          "material_group": "Printing Ink",
          "item_name": "SunAltec MB PLUS Dry-Offset Inks (4 Colors)",
          "uom": "kg",
          "net_rate_per_1000": 1.12,
          "scrap_pct": 10.0,
          "gross_rate_per_1000": 1.244,
          "net_total": 112.0,
          "gross_total": 124.44,
          "formula": "4 colors x 0.280 kg / 1,000 / (1 - 0.10)"
        }
      ],
      "summary": {
        "slug_gross_kg": 2111.1,
        "lacquer_gross_kg": 151.75,
        "base_coat_gross_kg": 101.32,
        "varnish_gross_kg": 44.77,
        "total_ink_gross_kg": 124.44,
        "cleaner_gross_kg": 555.6
      }
    }
  },
  "downtime_pareto": [
    {
      "reason": "Lance nozzle clean & print registration",
      "hours": 0.5
    },
    {
      "reason": "Washer rinse nozzle clean",
      "hours": 0.5
    },
    {
      "reason": "Line startup & roller coater setup",
      "hours": 0.5
    },
    {
      "reason": "Packing line carton feed pause",
      "hours": 0.25
    },
    {
      "reason": "Minor ink fountain adjust",
      "hours": 0.25
    }
  ]
};

const AppState = {
  data: DEFAULT_PRE_PRODUCTION_DATA,
  isOnline: navigator.onLine,
  pendingShiftsCount: 0,
  currentTheme: localStorage.getItem('alpha_theme') || 'dark'
};

// IndexedDB configuration for offline floor logging resilience
const IDB_NAME = 'AlphaAerosolsOfflineDB';
const IDB_VERSION = 1;
const IDB_STORE = 'pending_shifts';

function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, IDB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE, { keyPath: 'client_uuid' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getPendingShifts() {
  try {
    const db = await openIndexedDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const store = tx.objectStore(IDB_STORE);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB read error:', err);
    return [];
  }
}

async function savePendingShift(shiftPayload) {
  const db = await openIndexedDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readwrite');
    const store = tx.objectStore(IDB_STORE);
    shiftPayload.client_uuid = 'shift_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    shiftPayload.queued_at = new Date().toISOString();
    const req = store.put(shiftPayload);
    req.onsuccess = () => {
      updatePendingCount();
      resolve(shiftPayload.client_uuid);
    };
    req.onerror = () => reject(req.error);
  });
}

async function removePendingShift(uuid) {
  const db = await openIndexedDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readwrite');
    const store = tx.objectStore(IDB_STORE);
    const req = store.delete(uuid);
    req.onsuccess = () => {
      updatePendingCount();
      resolve();
    };
    req.onerror = () => reject(req.error);
  });
}

async function updatePendingCount() {
  const pending = await getPendingShifts();
  AppState.pendingShiftsCount = pending.length;
  const badge = document.getElementById('offline-queue-badge');
  if (badge) {
    badge.textContent = `${AppState.pendingShiftsCount} queued`;
    badge.style.display = AppState.pendingShiftsCount > 0 ? 'inline-flex' : 'none';
  }
}

// Fetch dynamic production data (Decoupled UI & Data)
async function fetchProductionData() {
  try {
    // Try Network-First
    let res;
    try {
      res = await fetch('./data/production.json', { cache: 'no-cache' });
    } catch (e) {
      // Fallback to API if available
      res = await fetch('/api/data', { cache: 'no-cache' });
    }

    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status}`);
    }
    const data = await res.json();
    AppState.data = data;
    window.dispatchEvent(new CustomEvent('app:state-changed', { detail: data }));
    return data;
  } catch (err) {
    console.warn('Network fetch unavailable, using pre-production baseline data state:', err);
    if (AppState.data) {
      window.dispatchEvent(new CustomEvent('app:state-changed', { detail: AppState.data }));
    }
    return AppState.data;
  }
}

// Replay offline shifts when online
async function syncPendingShifts() {
  if (!navigator.onLine) return;
  const pending = await getPendingShifts();
  if (pending.length === 0) return;

  showToast(`Syncing ${pending.length} offline shift log(s)...`, 'amber');
  for (const shift of pending) {
    try {
      const res = await fetch('/api/shifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shift)
      });
      if (res.ok) {
        await removePendingShift(shift.client_uuid);
      } else if (res.status >= 400 && res.status < 500) {
        // Permanent rejection from server (e.g. invalid data or constraints) — drop to avoid infinite loop
        console.error('Queued shift permanently rejected by server:', shift.client_uuid, res.status);
        await removePendingShift(shift.client_uuid);
        showToast(`Offline shift rejected by server (${res.status}). Removed from queue.`, 'red');
      }
    } catch (e) {
      console.warn('Shift sync network error for item:', shift.client_uuid, e);
    }
  }
  await updatePendingCount();
  await fetchProductionData();
  showToast('Offline shift sync completed.', 'emerald');
}

// Dynamic ISO-8601 Temporal Model Helpers
function formatDate(isoStr) {
  if (!isoStr) return '—';
  try {
    const parts = isoStr.split('T')[0].split('-');
    if (parts.length === 3) {
      const d = new Date(Date.UTC(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])));
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
    }
    return isoStr;
  } catch (e) {
    return isoStr;
  }
}

function formatNumber(num, decimals = 0) {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return Number(num).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

function showToast(message, type = 'amber', duration = 4000) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Network status listeners
window.addEventListener('online', () => {
  AppState.isOnline = true;
  document.getElementById('connection-status-dot')?.classList.remove('amber');
  document.getElementById('connection-status-dot')?.classList.add('emerald');
  document.getElementById('connection-status-text').textContent = 'Online';
  showToast('Connection restored. Syncing operational data...', 'emerald');
  syncPendingShifts();
});

window.addEventListener('offline', () => {
  AppState.isOnline = false;
  document.getElementById('connection-status-dot')?.classList.remove('emerald');
  document.getElementById('connection-status-dot')?.classList.add('amber');
  document.getElementById('connection-status-text').textContent = 'Offline (Floor Cache Active)';
  showToast('Operating in Offline Mode. Shifts will be queued in IndexedDB.', 'amber');
});

// Theme and Logo Sync
function updateLogoTheme(theme) {
  const logos = document.querySelectorAll('#header-logo');
  logos.forEach(img => {
    img.src = theme === 'light' ? './logo_light.png' : './logo_dark.png';
  });
}

// Theme toggle
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const target = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', target);
  localStorage.setItem('alpha_theme', target);
  const label = document.getElementById('theme-toggle-label');
  if (label) label.textContent = target === 'dark' ? 'Graphite Dark' : 'Daylight White';
  updateLogoTheme(target);
}

// Initialize theme on start
document.documentElement.setAttribute('data-theme', AppState.currentTheme);
window.addEventListener('DOMContentLoaded', () => {
  updatePendingCount();
  updateLogoTheme(AppState.currentTheme);
  const label = document.getElementById('theme-toggle-label');
  if (label) label.textContent = AppState.currentTheme === 'dark' ? 'Graphite Dark' : 'Daylight White';
});

// Dynamic Monthly Workbook & Bidirectional Excel Sync
function getActiveWorkbookName(targetDate = null) {
  if (!targetDate && AppState.data?.meta?.active_workbook) {
    return AppState.data.meta.active_workbook;
  }
  let d;
  if (targetDate) {
    d = new Date(targetDate);
  } else if (AppState.data?.meta?.as_of_date) {
    const parts = AppState.data.meta.as_of_date.split('-');
    d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2] || 1));
  } else {
    d = new Date();
  }
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const mmm = months[d.getMonth()];
  const yy = String(d.getFullYear()).slice(-2);
  return `Aerosol_${mmm}${yy}.xlsx`;
}

function triggerFileDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function exportShiftsClientCsv(shifts, filename) {
  const headers = [
    'Date', 'Machine', 'POF #', 'Product Name', 'PID', 'Customer',
    'Total Production (pcs)', 'Good Production (pcs)', 'Rejects (pcs)',
    'Rejection %', 'DownTime', 'Remarks'
  ];
  const rows = (shifts || []).map(s => {
    const total = (s.good_cans || 0) + (s.line_scrap || 0);
    const scrapPct = total > 0 ? ((s.line_scrap / total) * 100).toFixed(2) + '%' : '0.00%';
    const pid = String(s.product_size || '').includes('150') ? 5003 : 5002;
    const rem = `${s.shift_type || 'Day'} Shift - ${s.supervisor || 'Line Lead'}${s.downtime_reason ? ' - ' + s.downtime_reason : ''}`;
    return [
      s.shift_date || '',
      'Continuous Line 1',
      s.pof_number || `POF-${s.pof_id}`,
      `"${(s.product_name || 'Aerosol Container').replace(/"/g, '""')}"`,
      pid,
      `"${(s.customer_name || 'Alpha Standard').replace(/"/g, '""')}"`,
      total,
      s.good_cans || 0,
      s.line_scrap || 0,
      scrapPct,
      s.downtime_hours || 0,
      `"${rem.replace(/"/g, '""')}"`
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  triggerFileDownload(blob, filename.replace(/\.xlsx$/i, '.csv'));
}

async function syncToExcel() {
  const wbName = getActiveWorkbookName();
  showToast(`Updating Excel workbook (${wbName})...`, 'amber', 2500);

  try {
    const res = await fetch('/api/sync/to-excel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });

    if (res.ok) {
      const data = await res.json();
      const fn = data.filename || wbName;
      const written = data.rows_written !== undefined ? data.rows_written : 0;
      const updated = data.rows_updated !== undefined ? data.rows_updated : 0;
      let msg = `Excel Updated: ${fn} (${written} added, ${updated} updated)!`;
      if (written === 0 && updated === 0) {
        msg = `Excel Up-to-Date: All shifts already recorded in ${fn}.`;
      }
      showToast(`${msg} <a href="/api/download/workbook/${fn}" style="color: #fff; text-decoration: underline; margin-left: 6px; font-weight: 600;" download>Download .xlsx</a>`, 'emerald', 6000);
      return data;
    } else {
      throw new Error(`Server returned ${res.status}`);
    }
  } catch (err) {
    console.warn('Backend sync/to-excel unavailable, generating browser export fallback:', err);
    exportShiftsClientCsv(AppState.data?.shifts || [], wbName);
    showToast(`Browser mode: Shifts exported for ${wbName.replace(/\.xlsx$/i, '.csv')}!`, 'emerald', 5000);
  }
}

async function syncFromExcel() {
  const wbName = getActiveWorkbookName();
  showToast(`Pulling data from Excel (${wbName})...`, 'amber', 2500);

  try {
    const res = await fetch('/api/sync/from-excel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });

    if (res.ok) {
      const data = await res.json();
      const fn = data.filename || wbName;
      const imported = data.shifts_imported || 0;
      const updated = data.shifts_updated || 0;
      showToast(`Excel Sync: ${imported} imported, ${updated} updated from ${fn}!`, 'emerald', 5000);
      await fetchProductionData();
      return data;
    } else {
      const errData = await res.json().catch(() => ({}));
      showToast(`Excel import failed: ${errData.error || res.statusText}`, 'red');
    }
  } catch (err) {
    console.warn('Backend sync/from-excel unavailable:', err);
    showToast(`Pulling from Excel requires the local Python server (python server.py).`, 'amber');
  }
}

async function downloadActiveWorkbook() {
  const wbName = getActiveWorkbookName();
  try {
    const res = await fetch(`/api/download/workbook/${wbName}`);
    if (res.ok) {
      const blob = await res.blob();
      triggerFileDownload(blob, wbName);
      showToast(`Downloaded ${wbName}`, 'emerald');
      return;
    }
  } catch (e) {
    console.warn('API download not reachable, trying static workbook file:', e);
  }

  // Static host fallback (e.g. GitHub Pages): fetch committed workbook directly
  try {
    const staticRes = await fetch(`./${wbName}`);
    if (staticRes.ok) {
      const blob = await staticRes.blob();
      triggerFileDownload(blob, wbName);
      showToast(`Downloaded ${wbName} from repository`, 'emerald');
      return;
    }
  } catch (e2) {
    console.warn('Static workbook fetch failed, trying template:', e2);
  }

  try {
    const tmplRes = await fetch('./Aerosol_Production_Entry.xlsx');
    if (tmplRes.ok) {
      const blob = await tmplRes.blob();
      triggerFileDownload(blob, 'Aerosol_Production_Entry.xlsx');
      showToast('Downloaded Aerosol_Production_Entry.xlsx', 'emerald');
      return;
    }
  } catch (e3) {
    console.warn('Template fetch failed:', e3);
  }

  exportShiftsClientCsv(AppState.data?.shifts || [], wbName);
  showToast(`Exported shifts to ${wbName.replace('.xlsx', '.csv')}`, 'emerald');
}

// Explicit global exports for inline event handlers and component modules
if (typeof window !== 'undefined') {
  window.AppState = AppState;
  window.formatDate = formatDate;
  window.formatNumber = formatNumber;
  window.showToast = showToast;
  window.syncPendingShifts = syncPendingShifts;
  window.toggleTheme = toggleTheme;
  window.fetchProductionData = fetchProductionData;
  window.getActiveWorkbookName = getActiveWorkbookName;
  window.syncToExcel = syncToExcel;
  window.syncFromExcel = syncFromExcel;
  window.downloadActiveWorkbook = downloadActiveWorkbook;
}
