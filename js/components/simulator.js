/**
 * Component: Customer Order Quotation & Master BOM Simulator (Alpha Aerosols)
 * Instant quotation & MRP estimator using true physical yield-inverse mass balance
 * Source of Truth: Alpha Aerosols - Planning & MRP.xlsx
 */

const PRODUCT_PRESETS = {
  "9001": { name: "Markhor Blanc 120ml", size: "45x140mm", lacquer: "gold", base: "white", varnish: "silkmatt", colors: 5, pantones: "Pantone 185 C (607), Cyan (608), Magenta (600), Yellow (599), Black (601)" },
  "9002": { name: "Markhor Noir 120ml", size: "45x140mm", lacquer: "gold", base: "white", varnish: "silkmatt", colors: 2, pantones: "Pantone 185 C (607), Black (601)" },
  "9003": { name: "Dari Mooch Cove 100ml", size: "45x140mm", lacquer: "gold", base: "white", varnish: "silkmatt", colors: 2, pantones: "Pantone 166-7 C (610), Black (601) — Base Coat & OPV pending artwork" },
  "9004": { name: "Dari Mooch Shore 100ml", size: "45x140mm", lacquer: "gold", base: "white", varnish: "silkmatt", colors: 2, pantones: "Pantone 157-76 C (611), Black (601) — Base Coat & OPV pending artwork" },
  "9005": { name: "KRONE NOIR Desire 120ml", size: "45x140mm", lacquer: "gold", base: "clear", varnish: "silkmatt", colors: 6, pantones: "Green 168403 (612), Orange 168393 (613), Gray Metalized (614), Red Metalized (615), Opaque White (609), Black Conc. (601)" },
  "9006": { name: "ME Saxe 120ml", size: "45x140mm", lacquer: "gold", base: "white", varnish: "glossy", colors: 3, pantones: "Pantone 2728 C Royal Blue (616), Pantone 2758 C Navy Blue (617), Black Conc. (601)" }
};

function renderSimulator(data) {
  const container = document.getElementById('view-simulator');
  if (!container) return;

  container.innerHTML = `
    <div style="max-width: 1150px; margin: 0 auto;">
      <div class="panel">
        <div class="panel-header">
          <div class="panel-title">
            <span>Customer Order Quotation & Master BOM Simulator</span>
            <small>Yield-Inverse Physical Mass Balance Engine (Source: Alpha Aerosols - Planning & MRP.xlsx)</small>
          </div>
          <span class="badge badge-amber">Aerosol v2.1 Engine</span>
        </div>

        <div class="panel-body">
          <!-- Preset Selector Banner -->
          <div style="background: rgba(245, 158, 11, 0.05); border: 1px solid rgba(245, 158, 11, 0.25); border-left: 4px solid var(--color-amber); padding: 14px 18px; border-radius: var(--radius-sm); margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span class="status-dot amber"></span>
              <div>
                <strong style="color: var(--color-amber);">Quick Load Registered Product Preset:</strong>
                <span style="font-size: 12px; color: var(--text-muted);">Populate all coating, ink, and geometry parameters from Products_DB</span>
              </div>
            </div>
            <select id="sim-preset-select" class="form-select" style="min-width: 260px;" onchange="loadProductPreset(this.value)">
              <option value="">-- Choose Registered Product --</option>
              <option value="9001" selected>9001: Markhor Blanc 120ml (100k active)</option>
              <option value="9002">9002: Markhor Noir 120ml</option>
              <option value="9003">9003: Dari Mooch Cove 100ml</option>
              <option value="9004">9004: Dari Mooch Shore 100ml</option>
              <option value="9005">9005: KRONE NOIR Desire 120ml (Clear BC)</option>
              <option value="9006">9006: ME Saxe 120ml (Glossy OPV)</option>
            </select>
          </div>

          <!-- Simulator Controls -->
          <div style="background: var(--bg-base); border: 1px solid var(--border-subtle); padding: 20px; border-radius: var(--radius-sm); margin-bottom: 24px;">
            <div class="form-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
              
              <div class="form-group">
                <label class="form-label">Target Can Quantity</label>
                <input type="number" id="sim-can-qty" class="form-input form-input-lg" value="100000" step="5000" min="1000" oninput="runSimulation()">
                <div style="display: flex; gap: 6px; margin-top: 6px;">
                  <button type="button" class="btn btn-secondary" style="padding: 2px 8px; font-size: 10px;" onclick="setSimQty(50000)">50k</button>
                  <button type="button" class="btn btn-secondary" style="padding: 2px 8px; font-size: 10px;" onclick="setSimQty(100000)">100k</button>
                  <button type="button" class="btn btn-secondary" style="padding: 2px 8px; font-size: 10px;" onclick="setSimQty(250000)">250k</button>
                  <button type="button" class="btn btn-secondary" style="padding: 2px 8px; font-size: 10px;" onclick="setSimQty(500000)">500k</button>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Container Geometry Standard</label>
                <select id="sim-product-size" class="form-select form-input-lg" onchange="runSimulation()">
                  <option value="45x140mm" selected>45 x 140 mm (Post-Press Cylinder - Standard)</option>
                  <option value="45x160mm">45 x 160 mm (Tall Can Standard, 0.40mm)</option>
                  <option value="45x150mm">45 x 150 mm (Medium Can Standard, 0.35mm)</option>
                </select>
                <small style="color: var(--text-dim); font-size: 11px;" id="sim-geometry-note">Outer: 0.019792 m² | Inner: 0.020975 m² | 26.316g slug</small>
              </div>

              <div class="form-group">
                <label class="form-label">Internal Protective Lacquer</label>
                <select id="sim-lacquer-type" class="form-select form-input-lg" onchange="runSimulation()">
                  <option value="gold" selected>Gold Lacquer (44g/m² - Standard)</option>
                  <option value="beige">Beige Lacquer (48g/m²)</option>
                </select>
                <small style="color: var(--text-dim); font-size: 11px;">10% Scrap (/0.90) | Thinner 1.5% + purge</small>
              </div>

              <div class="form-group">
                <label class="form-label">External Base Coat</label>
                <select id="sim-base-type" class="form-select form-input-lg" onchange="runSimulation()">
                  <option value="white" selected>White Base Coat (43g/m²)</option>
                  <option value="clear">Clear Base Coat (31g/m² - Metallic)</option>
                </select>
                <small style="color: var(--text-dim); font-size: 11px;">15% Scrap (/0.85) | Thinner 3% of ext</small>
              </div>

              <div class="form-group">
                <label class="form-label">Overprint Varnish (OPV)</label>
                <select id="sim-varnish-type" class="form-select form-input-lg" onchange="runSimulation()">
                  <option value="silkmatt" selected>Silk-Matt OPV (17g/m²)</option>
                  <option value="glossy">Glossy OPV (19g/m²)</option>
                </select>
                <small style="color: var(--text-dim); font-size: 11px;">15% Scrap (/0.85) | 180d AC storage</small>
              </div>

              <div class="form-group">
                <label class="form-label">Dry-Offset Ink Colors</label>
                <select id="sim-num-colors" class="form-select form-input-lg" onchange="runSimulation()">
                  <option value="1">1 Color (Monochrome)</option>
                  <option value="2">2 Colors (Dari Mooch / Noir)</option>
                  <option value="3">3 Colors (ME Saxe)</option>
                  <option value="4">4 Colors (CMYK)</option>
                  <option value="5" selected>5 Colors (Markhor Blanc)</option>
                  <option value="6">6 Colors (KRONE NOIR)</option>
                </select>
                <small style="color: var(--text-dim); font-size: 11px;">0.245 kg net + 12.5% scrap = 0.280 kg gross</small>
              </div>

            </div>
          </div>

          <!-- Simulation Output Cards -->
          <div id="sim-summary-grid" class="kpi-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); margin-bottom: 24px;">
            <!-- Populated dynamically by runSimulation() -->
          </div>

          <!-- Detailed Mass-Balance Material Ledger -->
          <div class="panel" style="margin-bottom: 0;">
            <div class="panel-header">
              <div class="panel-title">
                <span>Detailed Raw Material BOM & Stores Stock Feasibility</span>
                <small>Gross Requirements vs Kot Abdul Malik Store Inventory</small>
              </div>
            </div>
            <div class="table-responsive">
              <table class="data-table" id="sim-results-table">
                <thead>
                  <tr>
                    <th>Item Code</th>
                    <th>Material Description</th>
                    <th class="num">Net Spec / 1000</th>
                    <th>Scrap %</th>
                    <th class="num">Gross Rate / 1000</th>
                    <th class="num">Total Gross Required</th>
                    <th class="num">Stores Stock Balance</th>
                    <th>Surplus / Deficit</th>
                    <th>Feasibility Status</th>
                  </tr>
                </thead>
                <tbody id="sim-table-body">
                  <!-- Populated dynamically -->
                </tbody>
              </table>
            </div>
          </div>

          <div style="margin-top: 20px; background: rgba(255, 255, 255, 0.015); border: 1px solid var(--border-subtle); padding: 14px 18px; border-radius: var(--radius-sm); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
            <div style="font-family: var(--font-mono); font-size: 12px; color: var(--text-muted);">
              Physics Proof: Yield-Inverse Req = Net / (1 - Scrap). Slugs: 15% scrap (30.96 kg/1k gross). Lacquer: 10% scrap (1.0256 kg/1k gross).
            </div>
            <button class="btn btn-secondary" onclick="window.print()">
              🖨️ Print Quotation Spec
            </button>
          </div>

        </div>
      </div>
    </div>
  `;

  runSimulation();
}

function loadProductPreset(pid) {
  if (!pid || !PRODUCT_PRESETS[pid]) return;
  const p = PRODUCT_PRESETS[pid];
  const sizeSelect = document.getElementById('sim-product-size');
  const lacquerSelect = document.getElementById('sim-lacquer-type');
  const baseSelect = document.getElementById('sim-base-type');
  const varnishSelect = document.getElementById('sim-varnish-type');
  const colorsSelect = document.getElementById('sim-num-colors');

  if (sizeSelect) sizeSelect.value = p.size;
  if (lacquerSelect) lacquerSelect.value = p.lacquer;
  if (baseSelect) baseSelect.value = p.base;
  if (varnishSelect) varnishSelect.value = p.varnish;
  if (colorsSelect) colorsSelect.value = p.colors;

  runSimulation();
}

function setSimQty(qty) {
  document.getElementById('sim-can-qty').value = qty;
  runSimulation();
}

function runSimulation() {
  const canQtyInput = document.getElementById('sim-can-qty');
  const sizeInput = document.getElementById('sim-product-size');
  const colorsInput = document.getElementById('sim-num-colors');
  if (!canQtyInput || !sizeInput) return;

  const canQty = Math.max(1, parseInt(canQtyInput.value) || 100000);
  const productSize = sizeInput.value || '45x140mm';
  const numColors = parseInt(colorsInput ? colorsInput.value : 5) || 5;
  const lacquerType = (document.getElementById('sim-lacquer-type')?.value) || 'gold';
  const baseType = (document.getElementById('sim-base-type')?.value) || 'white';
  const varnishType = (document.getElementById('sim-varnish-type')?.value) || 'silkmatt';

  const geomNote = document.getElementById('sim-geometry-note');
  if (geomNote) {
    if (productSize === '45x140mm') {
      geomNote.textContent = 'Outer: 0.019792 m² | Inner: 0.020975 m² | 26.316g slug (38 pcs/kg)';
    } else if (productSize === '45x160mm') {
      geomNote.textContent = 'Outer: 0.022619 m² | Inner: 0.023751 m² | 20.0g slug';
    } else {
      geomNote.textContent = 'Outer: 0.021206 m² | Inner: 0.022417 m² | 19.0g slug';
    }
  }

  const thousandUnits = canQty / 1000.0;

  // Geometry areas
  let innerArea = 0.020975;
  let outerArea = 0.019792;
  let slugNet = 26.3158; // 38 pcs/kg
  let slugScrap = 0.15;

  if (productSize === '45x160mm') {
    innerArea = 0.023751;
    outerArea = 0.022619;
    slugNet = 20.0;
    slugScrap = 0.10;
  } else if (productSize === '45x150mm') {
    innerArea = 0.022417;
    outerArea = 0.021206;
    slugNet = 19.0;
    slugScrap = 0.10;
  }

  // 1. Slug (15% scrap on 140mm standard)
  const slugGross = slugNet / (1.0 - slugScrap);

  // 2. Lubricant: 105g / 100kg slugs, 15% scrap
  const lubNet = (slugNet * 0.105) / 100.0;
  const lubGross = lubNet / (1.0 - slugScrap);

  // 3. Cleaner: 5.0 kg/1k cans, 15% scrap
  const cleanerNet = 5.0;
  const cleanerGross = cleanerNet / (1.0 - slugScrap);

  // 4. Lacquer: Gold 44 g/m² vs Beige 48 g/m², 10% scrap
  const lacquerNet = innerArea * (lacquerType === 'beige' ? 48.0 : 44.0);
  const lacquerGross = lacquerNet / (1.0 - 0.10);

  // 5. Lacquer Thinner: 1.5% dilution + purge = 2 * (1.5% * lacquerNet), 20% scrap
  const lacThinnerNet = lacquerNet * 0.015 * 2.0;
  const lacThinnerGross = lacThinnerNet / (1.0 - 0.20);

  // 6. Base Coat: White 43 g/m² vs Clear 31 g/m², 15% scrap
  const baseNet = outerArea * (baseType === 'clear' ? 31.0 : 43.0);
  const baseGross = baseNet / (1.0 - 0.15);

  // 7. Varnish: Silk-Matt 17 g/m² vs Glossy 19 g/m², 15% scrap
  const varnishNet = outerArea * (varnishType === 'glossy' ? 19.0 : 17.0);
  const varnishGross = varnishNet / (1.0 - 0.15);

  // 8. Coating Thinner: 3% of (baseNet + varnishNet), 20% scrap
  const coatThinnerNet = (baseNet + varnishNet) * 0.03;
  const coatThinnerGross = coatThinnerNet / (1.0 - 0.20);

  // 9. Printing Inks: 0.245 kg net per station, 12.5% scrap = 0.280 kg gross (Alkyd thermal-curing 150-180°C)
  const inkNetTotal = 0.245 * numColors;
  const inkGrossTotal = 0.280 * numColors;

  // 10. Packaging
  const cartonNet = 1000.0 / 450.0; // 450 cans/box (61.5x50x41 cm), net = 2.2222 boxes/1k
  const cartonGross = (cartonNet / 0.95); // 5% scrap = 2.3392 boxes/1k
  const palletGross = (0.3333 / 0.98); // 3,000 cans/pallet, 2% scrap = 0.3401 pallets/1k

  // Production shifts: 25,000 cans/shift nominal
  const estShifts = Math.ceil(canQty / 25000.0);
  const totalSlugTons = (slugGross * thousandUnits) / 1000.0;

  // Render Summary Cards
  const summaryGrid = document.getElementById('sim-summary-grid');
  if (summaryGrid) {
    summaryGrid.innerHTML = `
      <div class="kpi-card amber">
        <div class="kpi-label">Required Aluminum Slugs</div>
        <div class="kpi-value">${formatNumber(totalSlugTons, 2)} <small style="font-size:13px; font-weight:normal; color:var(--text-dim);">MTons</small></div>
        <div class="kpi-sub">${formatNumber(slugGross * thousandUnits, 0)} kg gross (15% line waste)</div>
      </div>

      <div class="kpi-card emerald">
        <div class="kpi-label">Internal Lacquer (${lacquerType === 'beige' ? 'Beige' : 'Gold'})</div>
        <div class="kpi-value">${formatNumber(lacquerGross * thousandUnits, 1)} <small style="font-size:13px; font-weight:normal; color:var(--text-dim);">kg</small></div>
        <div class="kpi-sub">10% loss factor (/0.90)</div>
      </div>

      <div class="kpi-card blue">
        <div class="kpi-label">Base Coat (${baseType === 'clear' ? 'Clear' : 'White'})</div>
        <div class="kpi-value">${formatNumber(baseGross * thousandUnits, 1)} <small style="font-size:13px; font-weight:normal; color:var(--text-dim);">kg</small></div>
        <div class="kpi-sub">15% loss factor (/0.85)</div>
      </div>

      <div class="kpi-card steel">
        <div class="kpi-label">Varnish (${varnishType === 'silkmatt' ? 'Silk-Matt' : 'Glossy'})</div>
        <div class="kpi-value">${formatNumber(varnishGross * thousandUnits, 1)} <small style="font-size:13px; font-weight:normal; color:var(--text-dim);">kg</small></div>
        <div class="kpi-sub">15% loss factor (/0.85)</div>
      </div>

      <div class="kpi-card emerald">
        <div class="kpi-label">Production Line Time</div>
        <div class="kpi-value">${estShifts} <small style="font-size:13px; font-weight:normal; color:var(--text-dim);">shifts</small></div>
        <div class="kpi-sub">${(estShifts / 2).toFixed(1)} days (2 shifts/day @ 25k/shift)</div>
      </div>
    `;
  }

  // Stock inventory check from AppState
  const currentInventory = (AppState.data && AppState.data.inventory) || [];
  const getStock = (code) => {
    const item = currentInventory.find(i => i.item_code === code);
    return item ? item.balance_qty : 0;
  };

  const simItems = [
    { code: '501', name: '45mm Aluminum Slugs (38 pcs/kg)', net: slugNet, scrap: '15.0%', grossRate: slugGross, grossTotal: slugGross * thousandUnits, uom: 'kg' },
    { code: '502', name: 'SAPILUB LUBRIMET GR8 (Extrusion Paste)', net: lubNet, scrap: '15.0%', grossRate: lubGross, grossTotal: lubGross * thousandUnits, uom: 'kg' },
    { code: '503', name: 'SAPILUB ALULIQUID 13 (Alkaline Cleaner)', net: cleanerNet, scrap: '15.0%', grossRate: cleanerGross, grossTotal: cleanerGross * thousandUnits, uom: 'kg' },
    { code: lacquerType === 'beige' ? '505' : '504', name: `SCHEKOSOL INT ${lacquerType === 'beige' ? 'BEIGE (400 4 902)' : 'PROT Gold (400 9 901)'} Lacquer`, net: lacquerNet, scrap: '10.0%', grossRate: lacquerGross, grossTotal: lacquerGross * thousandUnits, uom: 'kg' },
    { code: '506 9 901', name: 'SCHEKOSOL Reducer 506 9 901 (Lacquer Thinner)', net: lacThinnerNet, scrap: '20.0%', grossRate: lacThinnerGross, grossTotal: lacThinnerGross * thousandUnits, uom: 'kg' },
    { code: baseType === 'clear' ? '507' : '506', name: `SCHEKOSOL ${baseType === 'clear' ? 'CLEAR BC (422 9 918)' : 'WH BC (422 0 903)'} Base Coat`, net: baseNet, scrap: '15.0%', grossRate: baseGross, grossTotal: baseGross * thousandUnits, uom: 'kg' },
    { code: varnishType === 'glossy' ? '508' : '509', name: `SCHEKOSOL OPV ${varnishType === 'glossy' ? 'GLOSSY (422 9 900)' : 'SILKMATT (422 9 903)'} Varnish`, net: varnishNet, scrap: '15.0%', grossRate: varnishGross, grossTotal: varnishGross * thousandUnits, uom: 'kg' },
    { code: '506 9 003', name: 'SCHEKOSOL Reducer 506 9 003 (Coating Thinner)', net: coatThinnerNet, scrap: '20.0%', grossRate: coatThinnerGross, grossTotal: coatThinnerGross * thousandUnits, uom: 'kg' },
    { code: '601', name: `SunAltec MB PLUS Alkyd Thermal-Cure Inks (${numColors} Color Stations)`, net: inkNetTotal, scrap: '12.5%', grossRate: inkGrossTotal, grossTotal: inkGrossTotal * thousandUnits, uom: 'kg' },
    { code: 'PKG-BOX', name: 'Corrugated Cartons (450 pcs/box | 61.5×50×41 cm | NW 10.3 / GW 12.5 kg)', net: cartonNet, scrap: '5.0%', grossRate: cartonGross, grossTotal: Math.ceil(cartonGross * thousandUnits), uom: 'Box' },
    { code: 'PKG-PLT', name: 'Wooden Pallets (3,000 cans/pallet)', net: 0.3333, scrap: '2.0%', grossRate: palletGross, grossTotal: Math.ceil(palletGross * thousandUnits), uom: 'PLT' }
  ];

  const tableBody = document.getElementById('sim-table-body');
  if (tableBody) {
    tableBody.innerHTML = simItems.map(itm => {
      const stock = getStock(itm.code);
      const diff = stock - itm.grossTotal;
      const isCovered = diff >= 0;
      const covPct = itm.grossTotal > 0 ? ((stock / itm.grossTotal) * 100).toFixed(0) : '100';
      const badge = isCovered ?
        `<span class="badge badge-emerald">✓ Covered (${covPct}%)</span>` :
        `<span class="badge badge-red">⚠️ Deficit: ${formatNumber(Math.abs(diff), 1)} ${itm.uom}</span>`;

      return `
        <tr style="${!isCovered ? 'background: rgba(239, 68, 68, 0.02);' : ''}">
          <td><strong style="font-family: var(--font-mono); color: var(--color-amber);">${itm.code}</strong></td>
          <td style="font-weight: 500;">${itm.name}</td>
          <td class="num" style="font-family: var(--font-mono);">${formatNumber(itm.net, 4)}</td>
          <td><span class="badge badge-steel">${itm.scrap}</span></td>
          <td class="num" style="font-family: var(--font-mono);">${formatNumber(itm.grossRate, 4)}</td>
          <td class="num" style="font-weight: bold; color: var(--color-amber);">${formatNumber(itm.grossTotal, 2)} ${itm.uom}</td>
          <td class="num" style="font-family: var(--font-mono);">${formatNumber(stock, 1)} ${itm.uom}</td>
          <td class="num" style="font-weight: bold; font-family: var(--font-mono); color: ${isCovered ? 'var(--color-emerald)' : 'var(--color-danger)'};">
            ${isCovered ? '+' : ''}${formatNumber(diff, 1)} ${itm.uom}
          </td>
          <td>${badge}</td>
        </tr>
      `;
    }).join('');
  }
}
