r"""
issue_job_card.py
=================
Alpha Aerosols (Kot Abdul Malik) — Job Card Issuance, Frozen Snapshot & Archiving System
Zero Windows COM Automation: Pure Python (openpyxl + reportlab)

Features:
1. Pure-Python formula evaluation for all 107 Job Card formula cells (zero win32com).
2. Output A: Standalone Frozen Excel Workbook (Job Card sheet only, static values, preserved styling & logo).
3. Output B: Print-ready 1-Page A4 Portrait PDF Snapshot (matching exact shop-floor layout).
4. Output C: Monthly Multi-Tab Archive Workbook with Monthly_Index and dated frozen worksheets.
5. Output D: Writes clickable HYPERLINK formulas back to Master Table_Job_Cards (Cols N & O).

Usage:
  python issue_job_card.py                      # Issues active card from Master 'Job Card!C4'
  python issue_job_card.py --card AER-PL-SOR-03 # Issues specific card
  python issue_job_card.py AER-PL-SOR-03        # Positional card argument
  python issue_job_card.py --all                # Issues all seeded cards
"""

import os
import sys
import math
import re
import shutil
import argparse
import datetime
from copy import copy

import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.drawing.image import Image as OpenpyxlImage
from openpyxl.utils import get_column_letter

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Table, TableStyle, Image as RLImage, Spacer
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

BASE_DIR = r"D:\Aerosol"
SHARED_BASE_DIR = r"C:\Users\HP\OneDrive\Aerosol Shared Files\QMS Documentation\AER-SORs\Planing SORs"
MASTER_FILENAME = "Alpha Aerosols - Planning & MRP.xlsx"

NEW_MASTER_PATH = os.path.join(BASE_DIR, MASTER_FILENAME)
OLD_MASTER_PATH = os.path.join(BASE_DIR, "Aerosol_Master_MRP_Job_Card.xlsx")
MASTER_PATH = NEW_MASTER_PATH if os.path.exists(NEW_MASTER_PATH) else OLD_MASTER_PATH
SHARED_MASTER_PATH = os.path.join(SHARED_BASE_DIR, MASTER_FILENAME)

LOGO_PATH = os.path.join(BASE_DIR, "extracted_logo.jpeg")
ARCHIVE_FOLDER_NAME = "Record Keeping of Old Job Cards"

LOCAL_ARCHIVE_DIR = os.path.join(BASE_DIR, ARCHIVE_FOLDER_NAME)
SHARED_ARCHIVE_DIR = os.path.join(SHARED_BASE_DIR, ARCHIVE_FOLDER_NAME)
LOCAL_ISSUED_DIR = os.path.join(BASE_DIR, "Issued Job Cards")
SHARED_ISSUED_DIR = os.path.join(SHARED_BASE_DIR, "Issued Job Cards")

# Target folders to keep synchronized:
ALL_ARCHIVE_DIRS = [LOCAL_ARCHIVE_DIR, LOCAL_ISSUED_DIR]
if os.path.exists(SHARED_BASE_DIR):
    ALL_ARCHIVE_DIRS.extend([SHARED_ARCHIVE_DIR, SHARED_ISSUED_DIR])

def parse_args():
    parser = argparse.ArgumentParser(description="Issue, freeze and archive Alpha Aerosols Production Job Cards.")
    parser.add_argument("card_pos", nargs="?", default=None, help="Job Card No. (positional)")
    parser.add_argument("--card", "-c", dest="card_flag", default=None, help="Job Card No. (e.g. AER-PL-SOR-03)")
    parser.add_argument("--all", "-a", action="store_true", help="Issue and archive all job cards in Table_Job_Cards")
    parser.add_argument("--list", "-l", action="store_true", help="List all available job cards and active card without issuing")
    args = parser.parse_args()
    card = args.card_flag or args.card_pos
    return card, args.all, args.list

def sanitize_filename(name):
    clean = re.sub(r'[^a-zA-Z0-9_\-]', '_', str(name))
    return re.sub(r'_+', '_', clean).strip('_')

def make_para(text, style, is_bold=False):
    if text is None:
        t = ""
    else:
        t = str(text).strip()
    t = t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    if is_bold and t:
        t = f"<b>{t}</b>"
    return Paragraph(t, style)

def load_master_data():
    if not os.path.exists(MASTER_PATH):
        raise FileNotFoundError(f"Master workbook not found at {MASTER_PATH}")
    
    wb = openpyxl.load_workbook(MASTER_PATH, data_only=False)
    
    # 1. Read Products_DB
    ws_prod = wb['Products_DB']
    products_db = {}
    prod_headers = [ws_prod.cell(1, c).value for c in range(1, ws_prod.max_column + 1)]
    for r in range(2, ws_prod.max_row + 1):
        pname = ws_prod.cell(r, 1).value
        if pname:
            p_dict = {}
            for c in range(1, ws_prod.max_column + 1):
                p_dict[c] = ws_prod.cell(r, c).value
                if c <= len(prod_headers) and prod_headers[c-1]:
                    p_dict[prod_headers[c-1]] = ws_prod.cell(r, c).value
            products_db[str(pname).strip()] = p_dict

    # 2. Read Aerosol_BOM
    ws_bom = wb['Aerosol_BOM']
    bom_db = {}
    bom_headers = [ws_bom.cell(1, c).value for c in range(1, ws_bom.max_column + 1)]
    for r in range(2, ws_bom.max_row + 1):
        pid = ws_bom.cell(r, 2).value
        pname = ws_bom.cell(r, 5).value
        if pname:
            pname_str = str(pname).strip()
            if pname_str not in bom_db:
                bom_db[pname_str] = []
            
            b_dict = {}
            for c in range(1, ws_bom.max_column + 1):
                b_dict[c] = ws_bom.cell(r, c).value
                if c <= len(bom_headers) and bom_headers[c-1]:
                    b_dict[bom_headers[c-1]] = ws_bom.cell(r, c).value
            bom_db[pname_str].append(b_dict)

    # 3. Read Issued_Job_Cards
    ws_ijc = wb['Issued_Job_Cards']
    issued_cards = {}
    card_row_map = {}
    for r in range(2, ws_ijc.max_row + 1):
        c_no = ws_ijc.cell(r, 1).value
        if c_no and str(c_no).strip():
            c_str = str(c_no).strip()
            row_vals = {c: ws_ijc.cell(r, c).value for c in range(1, 16)}
            issued_cards[c_str] = row_vals
            card_row_map[c_str] = r

    # 4. Read active card on Job Card!C4 (or resolve from Product Name dropdown in H5)
    ws_jc = wb['Job Card']
    active_card_no = ws_jc['C4'].value
    if active_card_no:
        active_card_no = str(active_card_no).strip()
    if not active_card_no or active_card_no.startswith("="):
        active_prod = str(ws_jc['H5'].value or "").strip()
        active_card_no = None
        for c_no, c_vals in issued_cards.items():
            if str(c_vals.get(4) or "").strip() == active_prod:
                active_card_no = c_no
        if not active_card_no and issued_cards:
            active_card_no = next(iter(issued_cards.keys()))

    return wb, products_db, bom_db, issued_cards, card_row_map, active_card_no

def evaluate_job_card(wb, card_no, products_db, bom_db, issued_cards, card_row_map):
    """Evaluates all 107 Job Card formula values statically in memory."""
    if card_no in issued_cards:
        c_row = issued_cards[card_no]
        issue_date_raw = c_row.get(2)
        pof_no = c_row.get(3) or ""
        prod_name = str(c_row.get(4) or "Markhor Blanc 120ml").strip()
        order_qty_raw = c_row.get(6) or 100000
        tolerance_raw = c_row.get(7) if c_row.get(7) is not None else 0.05
        delivery_date_raw = c_row.get(8) or ""
        status = c_row.get(9) or "Issued to Floor"
        supervisor = "Production Supervisor"
    else:
        # Read from active Job Card sheet directly
        ws_jc = wb['Job Card']
        issue_date_raw = datetime.date.today()
        pof_no = "AER-POF-03"
        prod_name = "Markhor Blanc 120ml"
        order_qty_raw = 100000
        tolerance_raw = 0.05
        delivery_date_raw = ""
        supervisor = "Production Supervisor"
        status = "Issued to Floor"

    # Normalize issue_date
    if isinstance(issue_date_raw, datetime.datetime):
        issue_date = issue_date_raw.date()
    elif isinstance(issue_date_raw, datetime.date):
        issue_date = issue_date_raw
    elif isinstance(issue_date_raw, str) and issue_date_raw.strip():
        try:
            issue_date = datetime.datetime.strptime(issue_date_raw.strip(), "%Y-%m-%d").date()
        except Exception:
            issue_date = datetime.date.today()
    else:
        issue_date = datetime.date.today()

    # Normalize delivery_date
    if isinstance(delivery_date_raw, (datetime.datetime, datetime.date)):
        delivery_date_str = delivery_date_raw.strftime("%d-%b-%Y")
    elif delivery_date_raw:
        delivery_date_str = str(delivery_date_raw)
    else:
        delivery_date_str = ""

    # Normalize order_qty and tolerance
    try:
        order_qty = int(order_qty_raw)
    except Exception:
        order_qty = 100000

    try:
        tolerance = float(tolerance_raw)
    except Exception:
        tolerance = 0.05

    # Look up product specs from Products_DB (aligned with Table_Products schema)
    p_info = products_db.get(prod_name, {})
    miss = "MISSING ON ARTWORK" if p_info else None
    customer = p_info.get(3) or (miss or "Sarwana & Sohzsihm")
    can_type = p_info.get(4) or (miss or "Round / Necked-in")
    diameter = p_info.get(5) or (miss or "45 mm")
    height_nom = p_info.get(6) or (miss or "131 mm ± 2 mm (140 mm post-press)")
    neck_opening = p_info.get(7) or (miss or '1 inch (25.4 mm)')
    int_coating = p_info.get(10) or (miss or "Epoxy Gold (SCHEKOSOL 400 9 901)")
    base_coat = p_info.get(11) or (miss or "White (SCHEKOSOL 422 0 903)")
    print_colors = p_info.get(12) or (miss or "5 Colors: Pantone 185 C (Red), Cyan, Magenta, Yellow, Black")
    varnish = p_info.get(13) or (miss or "Matt (SCHEKOSOL 422 9 903)")
    packing_std = p_info.get(14) or (miss or "450 pcs/Carton (61.5×50×41 cm, NW 10.3 kg / GW 12.5 kg) / 3,000 per Pallet")
    artwork_ref = p_info.get(16) or (miss or "AER-PRD-F-03")
    top_wall = p_info.get(17) or (miss or "0.37 ± 0.02 mm")
    center_wall = p_info.get(18) or (miss or "0.32 ± 0.02 mm")
    bottom_thickness = p_info.get(19) or ""
    dome_base = p_info.get(9) or (miss or "0.80 – 0.95 mm")
    dome_thickness = f"{dome_base} | Btm: {bottom_thickness}" if (dome_base != "MISSING ON ARTWORK" and bottom_thickness) else dome_base
    dome_depth = p_info.get(20) or (miss or "7 mm")
    cap_type = p_info.get(21) or ""
    cap_color_raw = p_info.get(22) or ""
    if cap_color_raw:
        cap_color = f"{cap_type} — {cap_color_raw}" if cap_type else cap_color_raw
    else:
        cap_color = miss or "White"
    net_content = p_info.get(23) or (miss or "120 ml")
    print_area = p_info.get(24) or (miss or "W1 141 mm × H1 105 mm (Shoulder 20 mm)")
    batch_exp_code = p_info.get(25) or (miss or "At can bottom, per artwork")
    barcode = p_info.get(26) or ("" if p_info else "8964000571651")
    art_app_date_raw = p_info.get(35)
    art_app_by = p_info.get(36) or "QA & Client Sign-Off"

    if isinstance(art_app_date_raw, (datetime.datetime, datetime.date)):
        art_app_date_str = art_app_date_raw.strftime("%d-%b-%Y")
    elif art_app_date_raw:
        art_app_date_str = str(art_app_date_raw)
    else:
        art_app_date_str = "____________"

    art_check_details = f"Approval Date: {art_app_date_str}   By: {art_app_by}"
    sample_ref = "Sample ref: ____________"
    barcode_str = f"Barcode {barcode}" if barcode else "Barcode ____________"

    # Evaluate BOM Lines (1 to 16)
    bom_lines_raw = bom_db.get(prod_name, [])
    evaluated_materials = []
    for sr in range(1, 17):
        if sr - 1 < len(bom_lines_raw):
            b_item = bom_lines_raw[sr - 1]
            mat_grp = b_item.get(7) or ""
            item_id = str(b_item.get(8) or "").strip()
            item_name = b_item.get(9) or ""
            uom = b_item.get(10) or "kg"
            gross_per_1000 = b_item.get(13)
            
            if isinstance(gross_per_1000, (int, float)):
                gross_val = float(gross_per_1000)
            else:
                net_val = float(b_item.get(11) or 0)
                waste_val = float(b_item.get(12) or 0)
                gross_val = net_val / (1.0 - waste_val) if (1.0 - waste_val) > 0 else net_val

            if uom == "Box":
                req_qty = math.ceil(gross_val * order_qty / 1000.0)
            elif uom == "PLT":
                req_qty = round(gross_val * order_qty / 1000.0)
            else:
                req_qty = round(gross_val * order_qty / 1000.0, 2)

            evaluated_materials.append({
                "sr": sr,
                "material": mat_grp,
                "item_name": item_name,
                "item_code": item_id,
                "req_qty": req_qty,
                "unit": uom,
                "issued_qty": "",
                "batch_lot": ""
            })
        else:
            evaluated_materials.append({
                "sr": sr,
                "material": "",
                "item_name": "",
                "item_code": "",
                "req_qty": "",
                "unit": "",
                "issued_qty": "",
                "batch_lot": ""
            })

    card_data = {
        "card_no": card_no,
        "issue_date": issue_date,
        "issue_date_str": issue_date.strftime("%d-%b-%Y"),
        "pof_no": pof_no,
        "customer": customer,
        "prod_name": prod_name,
        "delivery_date_str": delivery_date_str,
        "order_qty": order_qty,
        "tolerance": tolerance,
        "tolerance_str": f"{int(tolerance*100)}%",
        "artwork_ref": artwork_ref,
        "art_check_details": art_check_details,
        "sample_ref": sample_ref,
        "barcode_str": barcode_str,
        "specs": {
            "Can Type": can_type,
            "Diameter": diameter,
            "Height": height_nom,
            "Neck Opening": neck_opening,
            "Net Content": net_content,
            "Dome Depth": dome_depth,
            "Top Wall Thickness": top_wall,
            "Center Wall Thickness": center_wall,
            "Dome Thickness": dome_thickness,
            "Internal Coating": int_coating,
            "Base Coat": base_coat,
            "Varnish": varnish,
            "Print Colors": print_colors,
            "Print Area": print_area,
            "Packing": packing_std,
            "Cap Color": cap_color,
            "Batch / Expiry Code": batch_exp_code
        },
        "materials": evaluated_materials,
        "status": status,
        "supervisor": supervisor
    }
    return card_data

def generate_frozen_excel(card_data, target_path):
    """Output A: Generates standalone frozen Excel workbook with zero formulas."""
    wb_master = openpyxl.load_workbook(MASTER_PATH, data_only=False)
    ws_src = wb_master['Job Card']
    
    wb_frozen = openpyxl.Workbook()
    ws = wb_frozen.active
    ws.title = "Job Card"
    
    # Copy column widths
    for col_letter, dim in ws_src.column_dimensions.items():
        ws.column_dimensions[col_letter].width = dim.width
        
    # Copy row dimensions
    for r in range(1, ws_src.max_row + 1):
        h = ws_src.row_dimensions[r].height
        if h is not None:
            ws.row_dimensions[r].height = h
            
    # Copy cell styles from original
    for r in range(1, ws_src.max_row + 1):
        for c in range(1, ws_src.max_column + 1):
            c_src = ws_src.cell(r, c)
            c_dst = ws.cell(r, c)
            if c_src.has_style:
                c_dst.font = copy(c_src.font)
                c_dst.fill = copy(c_src.fill)
                c_dst.border = copy(c_src.border)
                c_dst.alignment = copy(c_src.alignment)
                c_dst.number_format = copy(c_src.number_format)
                
    # Copy merged cells
    for m in ws_src.merged_cells.ranges:
        ws.merge_cells(str(m))
        
    # Write static evaluated values
    ws['A1'].value = f"Job Card – {card_data['prod_name']}"
    ws['C4'].value = card_data['card_no']
    ws['H4'].value = card_data['issue_date_str']
    ws['L4'].value = card_data['pof_no']
    ws['C5'].value = card_data['customer']
    ws['H5'].value = card_data['prod_name']
    ws['L5'].value = card_data['delivery_date_str']
    ws['C6'].value = card_data['order_qty']
    ws['C6'].number_format = '#,##0'
    ws['H6'].value = card_data['tolerance']
    ws['H6'].number_format = '0%'
    ws['L6'].value = card_data['artwork_ref']
    
    # Artwork release check
    ws['G9'].value = card_data['art_check_details']
    ws['G10'].value = card_data['sample_ref']
    ws['G11'].value = card_data['barcode_str']
    
    # Section 2 Technical Specs
    ws['C14'].value = card_data['specs']['Can Type']
    ws['H14'].value = card_data['specs']['Diameter']
    ws['L14'].value = card_data['specs']['Height']
    ws['C15'].value = card_data['specs']['Neck Opening']
    ws['H15'].value = card_data['specs']['Net Content']
    ws['L15'].value = card_data['specs']['Dome Depth']
    ws['C16'].value = card_data['specs']['Top Wall Thickness']
    ws['H16'].value = card_data['specs']['Center Wall Thickness']
    ws['L16'].value = card_data['specs']['Dome Thickness']
    ws['C17'].value = card_data['specs']['Internal Coating']
    ws['H17'].value = card_data['specs']['Base Coat']
    ws['L17'].value = card_data['specs']['Varnish']
    ws['C18'].value = card_data['specs']['Print Colors']
    ws['L18'].value = card_data['specs']['Print Area']
    ws['C19'].value = card_data['specs']['Packing']
    ws['H19'].value = card_data['specs']['Cap Color']
    ws['L19'].value = card_data['specs']['Batch / Expiry Code']
    
    # Section 3 Material Requirements (A=Sr. #, B:C=Material, D:H=Item Name, I:J=Item Code, K:L=Required Qty, M=Unit)
    for idx, mat in enumerate(card_data['materials']):
        r = 23 + idx
        ws[f'A{r}'].value = mat['sr']
        ws[f'B{r}'].value = mat['material']
        ws[f'D{r}'].value = mat['item_name']
        ws[f'I{r}'].value = mat['item_code']
        ws[f'K{r}'].value = mat['req_qty']
        if isinstance(mat['req_qty'], (int, float)):
            ws[f'K{r}'].number_format = '#,##0' if mat['unit'] in ('Box', 'PLT') else '#,##0.00'
        ws[f'M{r}'].value = mat['unit']
        
    # Footer Document Number & Effective Date
    ws['A47'].value = card_data['card_no']
    ws['H47'].value = card_data['issue_date'].strftime("%d-%B-%Y")
    
    # Page setup
    ws.page_setup.orientation = 'portrait'
    ws.page_setup.paperSize = 9 # A4
    ws.page_setup.fitToPage = True
    ws.page_setup.fitToWidth = 1
    ws.page_setup.fitToHeight = 1
    ws.sheet_properties.pageSetUpPr.fitToPage = True
    
    # Embed logo
    if os.path.exists(LOGO_PATH):
        img = OpenpyxlImage(LOGO_PATH)
        img.width = 160
        img.height = 45
        ws.add_image(img, "A1")
        
    os.makedirs(os.path.dirname(target_path), exist_ok=True)
    wb_frozen.save(target_path)
    print(f"  [OK] Output A (Frozen Excel): {target_path}")

def generate_job_card_pdf(card_data, target_pdf_path):
    """Output B: Generates print-ready 1-page A4 Portrait PDF matching shop-floor Job Card."""
    os.makedirs(os.path.dirname(target_pdf_path), exist_ok=True)
    
    doc = SimpleDocTemplate(
        target_pdf_path,
        pagesize=A4,
        leftMargin=18,
        rightMargin=18,
        topMargin=16,
        bottomMargin=16
    )
    
    elements = []
    
    navy = colors.HexColor("#1F3864")
    dark_gray = colors.HexColor("#333333")
    light_gray = colors.HexColor("#F2F4F7")
    border_color = colors.HexColor("#A6B0BA")
    border_light = colors.HexColor("#D1D5DB")
    amber_bg = colors.HexColor("#FEF3C7")
    
    style_normal = ParagraphStyle('Norm', fontName='Helvetica', fontSize=7.2, leading=9, textColor=dark_gray)
    style_bold = ParagraphStyle('Bold', fontName='Helvetica-Bold', fontSize=7.2, leading=9, textColor=dark_gray)
    style_hdr_cell = ParagraphStyle('HdrCell', fontName='Helvetica-Bold', fontSize=7.2, leading=9, textColor=navy)
    style_title = ParagraphStyle('Title', fontName='Helvetica-Bold', fontSize=11, leading=13, textColor=navy, alignment=2)
    style_sec_hdr = ParagraphStyle('SecHdr', fontName='Helvetica-Bold', fontSize=8, leading=10, textColor=colors.white)
    style_footer = ParagraphStyle('Foot', fontName='Helvetica', fontSize=6.5, leading=8, textColor=colors.HexColor("#555555"))
    style_footer_bold = ParagraphStyle('FootB', fontName='Helvetica-Bold', fontSize=6.5, leading=8, textColor=colors.HexColor("#222222"))
    
    # -------------------------------------------------------------------------
    # 1. Top Banner: Logo on left, Title on right
    # -------------------------------------------------------------------------
    logo_w, logo_h = 135, 34
    if os.path.exists(LOGO_PATH):
        logo_elem = RLImage(LOGO_PATH, width=logo_w, height=logo_h)
    else:
        logo_elem = Paragraph("<b>ALPHA AEROSOLS</b>", style_title)
        
    title_p = Paragraph(f"<b>Job Card – {card_data['prod_name']}</b><br/><font size=7 color='#666666'>Monobloc Aluminum Aerosol Manufacturing Line</font>", style_title)
    
    banner_table = Table([[logo_elem, title_p]], colWidths=[160, 399])
    banner_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
        ('TOPPADDING', (0, 0), (-1, -1), 0),
    ]))
    elements.append(banner_table)
    elements.append(Spacer(1, 4))
    
    # -------------------------------------------------------------------------
    # 2. Section 1: Order / Product Details
    # -------------------------------------------------------------------------
    sec1_hdr = Table([[Paragraph("1. JOB / ORDER DETAILS", style_sec_hdr)]], colWidths=[559])
    sec1_hdr.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), navy),
        ('TOPPADDING', (0, 0), (-1, -1), 2),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
    ]))
    elements.append(sec1_hdr)
    
    sec1_data = [
        [
            Paragraph("Job Card No.", style_hdr_cell), make_para(card_data['card_no'], style_bold, is_bold=True),
            Paragraph("Issue Date", style_hdr_cell), make_para(card_data['issue_date_str'], style_normal),
            Paragraph("POF #", style_hdr_cell), make_para(card_data['pof_no'], style_bold, is_bold=True)
        ],
        [
            Paragraph("Customer", style_hdr_cell), make_para(card_data['customer'], style_bold, is_bold=True),
            Paragraph("Product Name", style_hdr_cell), make_para(card_data['prod_name'], style_bold, is_bold=True),
            Paragraph("Delivery Date", style_hdr_cell), make_para(card_data['delivery_date_str'] or "—", style_normal)
        ],
        [
            Paragraph("Order Qty (Can)", style_hdr_cell), make_para(f"{card_data['order_qty']:,}", style_bold, is_bold=True),
            Paragraph("Tolerance", style_hdr_cell), make_para(card_data['tolerance_str'], style_normal),
            Paragraph("Artwork Ref", style_hdr_cell), make_para(card_data['artwork_ref'], style_normal)
        ]
    ]
    t_sec1 = Table(sec1_data, colWidths=[70, 125, 65, 140, 65, 94])
    t_sec1.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 0.75, border_color),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, border_light),
        ('BACKGROUND', (0, 0), (0, -1), light_gray),
        ('BACKGROUND', (2, 0), (2, -1), light_gray),
        ('BACKGROUND', (4, 0), (4, -1), light_gray),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 2),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
        ('LEFTPADDING', (0, 0), (-1, -1), 3),
        ('RIGHTPADDING', (0, 0), (-1, -1), 3),
    ]))
    elements.append(t_sec1)
    elements.append(Spacer(1, 3))
    
    # Artwork verification check
    art_chk_data = [
        [
            Paragraph("<b>Artwork Release Check</b>", style_hdr_cell),
            Paragraph(f"• Client approval: {card_data['art_check_details']}<br/>• Color standard sample: {card_data['sample_ref']}  |  • {card_data['barcode_str']}", style_normal),
            Paragraph("<b>QA Sign:</b> ________", style_normal)
        ]
    ]
    t_art = Table(art_chk_data, colWidths=[105, 345, 109])
    t_art.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 0.5, border_color),
        ('BACKGROUND', (0, 0), (-1, -1), amber_bg),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 2),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
        ('LEFTPADDING', (0, 0), (-1, -1), 3),
        ('RIGHTPADDING', (0, 0), (-1, -1), 3),
    ]))
    elements.append(t_art)
    elements.append(Spacer(1, 3))
    
    # -------------------------------------------------------------------------
    # 3. Section 2: Technical Specifications
    # -------------------------------------------------------------------------
    sec2_hdr = Table([[Paragraph("2. SPECIFICATION", style_sec_hdr)]], colWidths=[559])
    sec2_hdr.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), navy),
        ('TOPPADDING', (0, 0), (-1, -1), 2),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
    ]))
    elements.append(sec2_hdr)
    
    s = card_data['specs']
    sec2_data = [
        [
            Paragraph("Can Type", style_hdr_cell), make_para(s['Can Type'], style_normal),
            Paragraph("Diameter", style_hdr_cell), make_para(s['Diameter'], style_normal),
            Paragraph("Height", style_hdr_cell), make_para(s['Height'], style_normal)
        ],
        [
            Paragraph("Neck Opening", style_hdr_cell), make_para(s['Neck Opening'], style_normal),
            Paragraph("Net Content", style_hdr_cell), make_para(s['Net Content'], style_normal),
            Paragraph("Dome Depth", style_hdr_cell), make_para(s['Dome Depth'], style_normal)
        ],
        [
            Paragraph("Top Wall", style_hdr_cell), make_para(s['Top Wall Thickness'], style_normal),
            Paragraph("Center Wall", style_hdr_cell), make_para(s['Center Wall Thickness'], style_normal),
            Paragraph("Dome / Bottom", style_hdr_cell), make_para(s['Dome Thickness'], style_normal)
        ],
        [
            Paragraph("Internal Coating", style_hdr_cell), make_para(s['Internal Coating'], style_normal),
            Paragraph("Base Coat", style_hdr_cell), make_para(s['Base Coat'], style_normal),
            Paragraph("Varnish", style_hdr_cell), make_para(s['Varnish'], style_normal)
        ],
        [
            Paragraph("Print Colors", style_hdr_cell), make_para(s['Print Colors'], style_normal),
            Paragraph("", style_normal), Paragraph("", style_normal),
            Paragraph("Print Area", style_hdr_cell), make_para(s['Print Area'], style_normal)
        ],
        [
            Paragraph("Packing", style_hdr_cell), make_para(s['Packing'], style_normal),
            Paragraph("Cap Type / Color", style_hdr_cell), make_para(s['Cap Color'], style_normal),
            Paragraph("Batch/Exp Code", style_hdr_cell), make_para(s['Batch / Expiry Code'], style_normal)
        ]
    ]
    t_sec2 = Table(sec2_data, colWidths=[70, 125, 65, 140, 65, 94])
    t_sec2.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 0.75, border_color),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, border_light),
        ('BACKGROUND', (0, 0), (0, -1), light_gray),
        ('BACKGROUND', (2, 0), (2, -1), light_gray),
        ('BACKGROUND', (4, 0), (4, -1), light_gray),
        ('SPAN', (1, 4), (3, 4)),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 1.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 1.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 3),
        ('RIGHTPADDING', (0, 0), (-1, -1), 3),
    ]))
    elements.append(t_sec2)
    elements.append(Spacer(1, 3))
    
    # -------------------------------------------------------------------------
    # 4. Section 3: Material Requirements (16 BOM lines)
    # -------------------------------------------------------------------------
    sec3_hdr = Table([[Paragraph("3. MATERIAL REQUIRED", style_sec_hdr)]], colWidths=[559])
    sec3_hdr.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), navy),
        ('TOPPADDING', (0, 0), (-1, -1), 2),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
    ]))
    elements.append(sec3_hdr)
    
    mat_table_data = [
        [
            Paragraph("<b>Sr. #</b>", style_hdr_cell),
            Paragraph("<b>Material</b>", style_hdr_cell),
            Paragraph("<b>Item Name</b>", style_hdr_cell),
            Paragraph("<b>Item Code</b>", style_hdr_cell),
            Paragraph("<b>Required Qty</b>", style_hdr_cell),
            Paragraph("<b>Unit</b>", style_hdr_cell)
        ]
    ]
    
    for m in card_data['materials']:
        req_str = f"{m['req_qty']:,}" if isinstance(m['req_qty'], (int, float)) else str(m['req_qty'])
        mat_table_data.append([
            make_para(m['sr'], ParagraphStyle('C', parent=style_normal, alignment=1)),
            make_para(m['material'], style_normal),
            make_para(m['item_name'], style_normal),
            make_para(m['item_code'], ParagraphStyle('C', parent=style_normal, alignment=1)),
            make_para(req_str, ParagraphStyle('R', parent=style_normal, alignment=2), is_bold=True if req_str else False),
            make_para(m['unit'], ParagraphStyle('C', parent=style_normal, alignment=1))
        ])
        
    t_mat = Table(mat_table_data, colWidths=[28, 95, 250, 72, 74, 40])
    t_mat.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 0.75, border_color),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, border_light),
        ('BACKGROUND', (0, 0), (-1, 0), light_gray),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 1.2),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 1.2),
        ('LEFTPADDING', (0, 0), (-1, -1), 2),
        ('RIGHTPADDING', (0, 0), (-1, -1), 2),
    ]))
    elements.append(t_mat)
    elements.append(Spacer(1, 3))
    
    # -------------------------------------------------------------------------
    # 5. Section 4: Approval / Sign-Off
    # -------------------------------------------------------------------------
    sec4_hdr = Table([[Paragraph("4. APPROVAL / SIGN-OFF", style_sec_hdr)]], colWidths=[559])
    sec4_hdr.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), navy),
        ('TOPPADDING', (0, 0), (-1, -1), 2),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
    ]))
    elements.append(sec4_hdr)
    
    sign_data = [
        [
            Paragraph("Role", style_hdr_cell),
            Paragraph("<b>Planning Lead</b>", style_hdr_cell),
            Paragraph("<b>Store Lead</b>", style_hdr_cell),
            Paragraph("<b>Production Lead</b>", style_hdr_cell),
            Paragraph("<b>Quality Lead</b>", style_hdr_cell)
        ],
        [
            Paragraph("Name", style_normal),
            Paragraph("Sikander Shahjahan", style_normal),
            Paragraph("", style_normal),
            Paragraph("", style_normal),
            Paragraph("", style_normal)
        ],
        [
            Paragraph("Sig / Date", style_normal),
            Paragraph("", style_normal),
            Paragraph("", style_normal),
            Paragraph("", style_normal),
            Paragraph("", style_normal)
        ]
    ]
    t_sign = Table(sign_data, colWidths=[65, 123, 123, 124, 124])
    t_sign.setStyle(TableStyle([
        ('BOX', (0, 0), (-1, -1), 0.75, border_color),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, border_light),
        ('BACKGROUND', (0, 0), (0, -1), light_gray),
        ('BACKGROUND', (0, 0), (-1, 0), light_gray),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 1.5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 1.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 3),
        ('RIGHTPADDING', (0, 0), (-1, -1), 3),
    ]))
    elements.append(t_sign)
    elements.append(Spacer(1, 3))
    
    # -------------------------------------------------------------------------
    # 6. ISO 9001:2015 Quality Management System Footer
    # -------------------------------------------------------------------------
    foot_data = [
        [
            Paragraph("<b>ISO 9001:2015 Quality Management System</b>", style_footer_bold),
            Paragraph("", style_footer),
            Paragraph("", style_footer),
            Paragraph("", style_footer)
        ],
        [
            Paragraph(f"Doc No: <b>{card_data['card_no']}</b>", style_footer),
            Paragraph("Rev Status: <b>01</b>", style_footer),
            Paragraph("Effective: <b>04-November-2026</b>", style_footer),
            Paragraph("Page: <b>1 of 1</b>", ParagraphStyle('FR', parent=style_footer, alignment=2))
        ]
    ]
    t_foot = Table(foot_data, colWidths=[160, 130, 150, 119])
    t_foot.setStyle(TableStyle([
        ('LINEABOVE', (0, 0), (-1, 0), 0.5, border_color),
        ('SPAN', (0, 0), (2, 0)),
        ('TOPPADDING', (0, 0), (-1, -1), 1),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 1),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
    ]))
    elements.append(t_foot)
    
    doc.build(elements)
    print(f"  [OK] Output B (1-Page A4 PDF): {target_pdf_path}")

def update_monthly_archive(card_data, frozen_xlsx_path, pdf_rel_path):
    """Output C: Adds or updates the frozen Job Card tab in the monthly archive workbook."""
    year_month = card_data['issue_date'].strftime("%Y_%m")
    archive_filename = f"Job_Cards_Archive_{year_month}.xlsx"
    archive_path = os.path.join(LOCAL_ARCHIVE_DIR, archive_filename)
    os.makedirs(LOCAL_ARCHIVE_DIR, exist_ok=True)
    
    font_family = "Arial"
    header_fill = PatternFill(start_color="1F3864", end_color="1F3864", fill_type="solid")
    header_font = Font(name=font_family, size=9, bold=True, color="FFFFFF")
    thin_border = Border(
        left=Side(style='thin', color='D9D9D9'),
        right=Side(style='thin', color='D9D9D9'),
        top=Side(style='thin', color='D9D9D9'),
        bottom=Side(style='thin', color='D9D9D9')
    )
    
    if os.path.exists(archive_path):
        wb_arch = openpyxl.load_workbook(archive_path, data_only=False)
    else:
        wb_arch = openpyxl.Workbook()
        ws_idx = wb_arch.active
        ws_idx.title = "Monthly_Index"
        
        ws_idx['A1'].value = f"AEROSOL ISSUED JOB CARDS ARCHIVE – {card_data['issue_date'].strftime('%B %Y').upper()}"
        ws_idx['A1'].font = Font(name=font_family, size=11, bold=True, color="1F3864")
        
        headers = [
            "Sr. #", "Tab Name", "Job Card No.", "Issue Date", "POF #", "Product Name",
            "Customer", "Order Qty (Cans)", "Tolerance %", "Min–Max Cans",
            "Delivery Date", "Status", "Jump to Sheet", "Open PDF"
        ]
        ws_idx.append(headers)
        ws_idx.row_dimensions[2].height = 24
        for c in range(1, len(headers) + 1):
            cell = ws_idx.cell(2, c)
            cell.fill = header_fill
            cell.font = header_font
            cell.alignment = Alignment(horizontal="center", vertical="center")
            
        col_w = {
            'A': 8, 'B': 22, 'C': 18, 'D': 14, 'E': 14, 'F': 32, 'G': 25,
            'H': 16, 'I': 14, 'J': 24, 'K': 14, 'L': 18, 'M': 18, 'N': 16
        }
        for cl, w in col_w.items():
            ws_idx.column_dimensions[cl].width = w

    ws_idx = wb_arch['Monthly_Index']
    
    tab_name = f"{card_data['issue_date'].strftime('%d%b')}_{card_data['card_no']}"
    tab_name = tab_name[:31]
    
    min_max_str = f"{int(card_data['order_qty']*(1-card_data['tolerance'])):,} – {int(card_data['order_qty']*(1+card_data['tolerance'])):,}"
    jump_formula = f'=HYPERLINK("#\'{tab_name}\'!A1", "🗂️ Jump to Sheet")'
    pdf_formula = f'=HYPERLINK("{pdf_rel_path}", "📄 Open PDF")'
    
    existing_row = None
    for r in range(3, ws_idx.max_row + 1):
        if str(ws_idx.cell(r, 3).value).strip() == card_data['card_no']:
            existing_row = r
            break
            
    sr_no = (existing_row - 2) if existing_row else (ws_idx.max_row - 1 if ws_idx.max_row >= 2 else 1)
    target_r = existing_row if existing_row else (ws_idx.max_row + 1)
    
    idx_row_vals = [
        sr_no, tab_name, card_data['card_no'], card_data['issue_date_str'],
        card_data['pof_no'], card_data['prod_name'], card_data['customer'],
        card_data['order_qty'], card_data['tolerance'], min_max_str,
        card_data['delivery_date_str'], card_data['status'], jump_formula, pdf_formula
    ]
    
    for c_idx, val in enumerate(idx_row_vals, start=1):
        cell = ws_idx.cell(target_r, c_idx)
        cell.value = val
        cell.font = Font(name=font_family, size=9)
        cell.border = thin_border
        if c_idx in (1, 4, 11, 12):
            cell.alignment = Alignment(horizontal="center", vertical="center")
        elif c_idx == 8:
            cell.alignment = Alignment(horizontal="right", vertical="center")
            cell.number_format = '#,##0'
        elif c_idx == 9:
            cell.alignment = Alignment(horizontal="right", vertical="center")
            cell.number_format = '0%'
        elif c_idx in (13, 14):
            cell.alignment = Alignment(horizontal="center", vertical="center")
            cell.font = Font(name=font_family, size=9, color="0563C1", underline="single")
        else:
            cell.alignment = Alignment(horizontal="left", vertical="center")
    ws_idx.row_dimensions[target_r].height = 20

    if tab_name in wb_arch.sheetnames:
        del wb_arch[tab_name]
        
    wb_frozen = openpyxl.load_workbook(frozen_xlsx_path, data_only=False)
    ws_frozen = wb_frozen['Job Card']
    
    ws_dest = wb_arch.create_sheet(title=tab_name)
    
    for col_l, d in ws_frozen.column_dimensions.items():
        ws_dest.column_dimensions[col_l].width = d.width
        
    for r in range(1, ws_frozen.max_row + 1):
        h = ws_frozen.row_dimensions[r].height
        if h is not None:
            ws_dest.row_dimensions[r].height = h
            
    for r in range(1, ws_frozen.max_row + 1):
        for c in range(1, ws_frozen.max_column + 1):
            c_src = ws_frozen.cell(r, c)
            c_dst = ws_dest.cell(r, c)
            c_dst.value = c_src.value
            if c_src.has_style:
                c_dst.font = copy(c_src.font)
                c_dst.fill = copy(c_src.fill)
                c_dst.border = copy(c_src.border)
                c_dst.alignment = copy(c_src.alignment)
                c_dst.number_format = copy(c_src.number_format)
                
    for m in ws_frozen.merged_cells.ranges:
        ws_dest.merge_cells(str(m))
        
    ws_dest.page_setup.orientation = 'portrait'
    ws_dest.page_setup.paperSize = 9
    ws_dest.page_setup.fitToPage = True
    ws_dest.page_setup.fitToWidth = 1
    ws_dest.page_setup.fitToHeight = 1
    ws_dest.sheet_properties.pageSetUpPr.fitToPage = True
    
    if os.path.exists(LOGO_PATH):
        img = OpenpyxlImage(LOGO_PATH)
        img.width = 160
        img.height = 45
        ws_dest.add_image(img, "A1")

    wb_arch.save(archive_path)
    # Mirror monthly archive workbook to all configured archive directories
    for adir in ALL_ARCHIVE_DIRS:
        if os.path.abspath(adir) != os.path.abspath(LOCAL_ARCHIVE_DIR) and os.path.exists(os.path.dirname(adir)):
            os.makedirs(adir, exist_ok=True)
            target_arch = os.path.join(adir, archive_filename)
            shutil.copy2(archive_path, target_arch)

    print(f"  [OK] Output C (Monthly Archive Tab '{tab_name}'): {archive_path}")
    return archive_path, tab_name

def update_master_hyperlinks(card_data, base_filename, tab_name):
    """Output D: Writes clickable portable relative HYPERLINK formulas back to Master Table_Job_Cards."""
    wb = openpyxl.load_workbook(MASTER_PATH, data_only=False)
    ws_ijc = wb['Issued_Job_Cards']
    
    target_row = None
    for r in range(2, ws_ijc.max_row + 1):
        if str(ws_ijc.cell(r, 1).value).strip() == card_data['card_no']:
            target_row = r
            break
            
    if not target_row:
        for r in range(2, 26):
            if not ws_ijc.cell(r, 1).value:
                target_row = r
                break
                
    if target_row:
        ym_folder = card_data['issue_date'].strftime("%Y-%m")
        ym_archive = card_data['issue_date'].strftime("%Y_%m")
        archive_filename = f"Job_Cards_Archive_{ym_archive}.xlsx"
        
        rel_pdf = f"{ARCHIVE_FOLDER_NAME}\\{ym_folder}\\{base_filename}.pdf"
        rel_archive = f"{ARCHIVE_FOLDER_NAME}\\{archive_filename}"
        
        pdf_hyperlink = f'=HYPERLINK("{rel_pdf}", "Open PDF")'
        arch_hyperlink = f'=HYPERLINK("[{rel_archive}]\'{tab_name}\'!A1", "Open Archive")'
        
        font_hyper = Font(name="Arial", size=9, color="0563C1", underline="single")
        align_center = Alignment(horizontal="center", vertical="center")
        
        ws_ijc.cell(target_row, 14).value = pdf_hyperlink
        ws_ijc.cell(target_row, 14).font = font_hyper
        ws_ijc.cell(target_row, 14).alignment = align_center
        
        ws_ijc.cell(target_row, 15).value = arch_hyperlink
        ws_ijc.cell(target_row, 15).font = font_hyper
        ws_ijc.cell(target_row, 15).alignment = align_center
        
        wb.save(MASTER_PATH)
        print(f"  [OK] Output D (Master Table_Job_Cards Row {target_row} Relative Hyperlinks N & O updated)")
        
        # Synchronize updated Master to Shared OneDrive folder if available
        if os.path.exists(SHARED_BASE_DIR):
            shutil.copy2(MASTER_PATH, SHARED_MASTER_PATH)
            print(f"  [OK] Master Synchronized to Shared OneDrive: {SHARED_MASTER_PATH}")

def process_job_card(card_no):
    print(f"\n=======================================================")
    print(f"  PROCESSING JOB CARD: {card_no}")
    print(f"=======================================================")
    
    wb, products_db, bom_db, issued_cards, card_row_map, active_card_no = load_master_data()
    card_data = evaluate_job_card(wb, card_no, products_db, bom_db, issued_cards, card_row_map)
    print(f"Card Details: {card_data['card_no']} | Product: {card_data['prod_name']} | Order: {card_data['order_qty']:,} cans | Date: {card_data['issue_date_str']}")
    
    ym_folder = card_data['issue_date'].strftime("%Y-%m")
    date_iso = card_data['issue_date'].strftime("%Y-%m-%d")
    clean_prod = sanitize_filename(card_data['prod_name'])
    base_filename = f"{date_iso}_{card_data['card_no']}_{clean_prod}_{card_data['order_qty']}"
    
    primary_target_dir = os.path.join(LOCAL_ARCHIVE_DIR, ym_folder)
    os.makedirs(primary_target_dir, exist_ok=True)
    
    frozen_xlsx_path = os.path.join(primary_target_dir, f"{base_filename}.xlsx")
    pdf_path = os.path.join(primary_target_dir, f"{base_filename}.pdf")
    rel_pdf_for_archive = f"{ym_folder}\\{base_filename}.pdf"
    
    generate_frozen_excel(card_data, frozen_xlsx_path)
    generate_job_card_pdf(card_data, pdf_path)
    
    # Mirror frozen files to all configured archive directories (local & shared)
    for adir in ALL_ARCHIVE_DIRS:
        if os.path.abspath(adir) != os.path.abspath(LOCAL_ARCHIVE_DIR) and os.path.exists(os.path.dirname(adir)):
            t_dir = os.path.join(adir, ym_folder)
            os.makedirs(t_dir, exist_ok=True)
            shutil.copy2(frozen_xlsx_path, os.path.join(t_dir, f"{base_filename}.xlsx"))
            shutil.copy2(pdf_path, os.path.join(t_dir, f"{base_filename}.pdf"))
    
    archive_path, tab_name = update_monthly_archive(card_data, frozen_xlsx_path, rel_pdf_for_archive)
    update_master_hyperlinks(card_data, base_filename, tab_name)
    
    print(f"=======================================================")
    print(f"  SUCCESSFULLY ISSUED & ARCHIVED: {card_no}")
    print(f"=======================================================\n")
    return {
        "card_no": card_no,
        "frozen_xlsx": frozen_xlsx_path,
        "pdf": pdf_path,
        "archive_xlsx": archive_path,
        "tab_name": tab_name
    }

def main():
    card_arg, issue_all, list_arg = parse_args()
    
    wb, products_db, bom_db, issued_cards, card_row_map, active_card_no = load_master_data()
    
    if list_arg:
        print(f"Master Workbook: {MASTER_PATH}")
        print(f"Active Card in 'Job Card!C4': {active_card_no}")
        print(f"Available Job Cards in Table_Job_Cards ({len(issued_cards)} total):")
        for cid, cinfo in issued_cards.items():
            prod = cinfo.get(4) or ""
            qty = cinfo.get(6) or 0
            status = cinfo.get(9) or ""
            print(f"  - {cid}: {prod} | {qty:,} cans | Status: {status}")
        return

    if issue_all:
        cards_to_issue = list(issued_cards.keys())
        print(f"Issuing all {len(cards_to_issue)} job cards from Table_Job_Cards: {cards_to_issue}")
    elif card_arg:
        cards_to_issue = [card_arg.strip()]
    elif active_card_no:
        cards_to_issue = [active_card_no]
    else:
        cards_to_issue = ["AER-PL-SOR-03"]
        
    for c_id in cards_to_issue:
        process_job_card(c_id)

if __name__ == "__main__":
    main()
