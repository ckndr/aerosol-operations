/**
 * Component: Interactive Customer Order & BOM Simulator (Alpha Aerosols)
 * Instant quotation & MRP estimator using true physical yield-inverse mass balance
 * Formula: Req = Net / (1 - Scrap) (35% Lacquer, 10% Base Coat/OPV)
 */

function renderSimulator(data) {
  const container = document.getElementById('view-simulator');
  if (!container) return;

  container.innerHTML = `
    <div style="max-width: 1100px; margin: 0 auto;">
      <div class="panel">
        <div class="panel-header">
          <div class="panel-title">
            <span>Customer Order Quotation & Master BOM Simulator</span>
            <small>Yield-Inverse Physical Mass Balance Engine (No Tubex Additive Errors)</small>
          </div>
          <span class="badge badge-amber">Aerosol v2.0 Engine</span>
        </div>

        <div class="panel-body">
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
                  <option value="45x160mm" selected>45 x 160 mm (Primary 0.40mm Wall)</option>
                  <option value="45x150mm">45 x 150 mm (Alternate 0.35mm Wall)</option>
                </select>
                <small style="color: var(--text-dim); font-size: 11px;" id="sim-geometry-note">Outer: 0.0226 m² | Inner: 0.0238 m² | 20.0g slug</small>
              </div>

              <div class="form-group">
                <label class="form-label">Internal Protective Lacquer</label>
                <select id="sim-lacquer-type" class="form-select form-input-lg" onchange="runSimulation()">
                  <option value="gold" selected>Gold (400 9 901, 44g/m²)</option>
                  <option value="beige">Beige (400 4 902, 48g/m²)</option>
                </select>
                <small style="color: var(--text-dim); font-size: 11px;">Yield-inverse /0.65 (35% loss)</small>
              </div>

              <div class="form-group">
                <label class="form-label">External Base Coat</label>
                <select id="sim-base-type" class="form-select form-input-lg" onchange="runSimulation()">
                  <option value="white" selected>White BC (422 0 903, 43g/m²)</option>
                  <option value="clear">Clear BC (422 9 918, 31g/m²)</option>
                </select>
                <small style="color: var(--text-dim); font-size: 11px;">Yield-inverse /0.90 (10% loss)</small>
              </div>

              <div class="form-group">
                <label class="form-label">Overprint Varnish (OPV)</label>
                <select id="sim-varnish-type" class="form-select form-input-lg" onchange="runSimulation()">
                  <option value="glossy" selected>Glossy OPV (422 9 900, 19g/m²)</option>
                  <option value="silkmatt">Silk-Matt OPV (422 9 903, 17g/m²)</option>
                </select>
                <small style="color: var(--text-dim); font-size: 11px;">Yield-inverse /0.90 (10% loss)</small>
              </div>

              <div class="form-group">
                <label class="form-label">Dry-Offset Ink Colors</label>
                <select id="sim-num-colors" class="form-select form-input-lg" onchange="runSimulation()">
                  <option value="1">1 Color (Monochrome)</option>
                  <option value="2">2 Colors</option>
                  <option value="3">3 Colors</option>
                  <option value="4" selected>4 Colors (CMYK Standard)</option>
                  <option value="5">5 Colors (CMYK + 1 Spot)</option>
                  <option value="6">6 Colors (Full Station)</option>
                </select>
                <small style="color: var(--text-dim); font-size: 11px;">0.280 kg/1000 cans net/color</small>
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
                <small>Gross Requirements vs Warehouse Inventory</small>
              </div>
            </div>
            <div class="table-responsive">
              <table class="data-table" id="sim-results-table">
                <thead>
                  <tr>
                    <th>Item Code</th>
                    <th>Material Description</th>
                    <th class="num">Net Spec / 1000</th>
                    <th>Transfer Loss %</th>
                    <th class="num">Gross Rate / 1000</th>
                    <th class="num">Total Gross Required</th>
                    <th class="num">Stores Stock Balance</th>
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
              Physics Proof: Lacquer 35% loss = Net / 0.65 (1.5385x); Base coat 10% loss = Net / 0.90 (1.1111x)
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
  const productSize = sizeInput.value || '45x160mm';
  const numColors = parseInt(colorsInput ? colorsInput.value : 4) || 4;
  const lacquerType = (document.getElementById('sim-lacquer-type')?.value) || 'gold';
  const baseType = (document.getElementById('sim-base-type')?.value) || 'white';
  const varnishType = (document.getElementById('sim-varnish-type')?.value) || 'glossy';

  const geomNote = document.getElementById('sim-geometry-note');
  if (geomNote) {
    if (productSize === '45x160mm') {
      geomNote.textContent = 'Outer: 0.0226 m² | Inner: 0.0238 m² | 20.0g slug';
    } else {
      geomNote.textContent = 'Outer: 0.0212 m² | Inner: 0.0224 m² | 19.0g slug';
    }
  }

  // Calculate BOM using true yield-inverse physics
  const is160 = productSize === '45x160mm';
  const innerArea = is160 ? 0.023751 : 0.022417;
  const outerArea = is160 ? 0.022619 : 0.021206;
  const slugWeight = is160 ? 20.0 : 19.0;
  const thousandUnits = canQty / 1000.0;

  // Mass balance formulas
  const slugNet = slugWeight;
  const slugGross = slugNet / 0.90; // 10% line scrap

  const lubNet = (slugNet * 0.105) / 100.0; // 105g per 100kg
  const lubGross = lubNet / 0.90;

  const cleanerNet = 5.0;
  const cleanerGross = cleanerNet / 0.90;

  // Lacquer: Gold 44 g/m² vs Beige 48 g/m², 35% airless spray loss
  let lacquerItemCode = '504';
  let lacquerItemName = 'SCHEKOSOL INT PROT Gold (400 9 901)';
  let lacquerNet = innerArea * 44.0;
  if (lacquerType === 'beige') {
    lacquerItemCode = '505';
    lacquerItemName = 'SCHEKOSOL INT BEIGE (400 4 902)';
    lacquerNet = 1.140;
  }
  const lacquerGross = lacquerNet / (1.0 - 0.35);

  // Base coat: White 43 g/m² vs Clear 31 g/m², 10% roller loss
  let baseItemCode = '506';
  let baseItemName = 'SCHEKOSOL WH BC White Base Coat (422 0 903)';
  let baseNet = outerArea * 43.0;
  if (baseType === 'clear') {
    baseItemCode = '507';
    baseItemName = 'SCHEKOSOL CLEAR BC (422 9 918)';
    baseNet = 0.701;
  }
  const baseGross = baseNet / (1.0 - 0.10);

  // Varnish: Glossy 19 g/m² vs Silkmatt 17 g/m², 10% roller loss
  let varnishItemCode = '508';
  let varnishItemName = 'SCHEKOSOL OPV GLOSSY Varnish (422 9 900)';
  let varnishNet = outerArea * 19.0;
  if (varnishType === 'silkmatt') {
    varnishItemCode = '509';
    varnishItemName = 'SCHEKOSOL OPV SILKMATT (422 9 903)';
    varnishNet = 0.385;
  }
  const varnishGross = varnishNet / (1.0 - 0.10);

  // Inks: 0.280 kg/1000 net per color, 10% loss
  const inkPerStationGross = 0.280 / 0.90;
  const inkTotalGross = inkPerStationGross * numColors;

  // Production shifts: 30k cans/shift nominal @ 90% OEE = 27,000 net cans/shift
  const estShifts = Math.ceil(canQty / 27000.0);
  const totalSlugTons = (slugGross * thousandUnits) / 1000.0;

  // Render Summary Cards
  const summaryGrid = document.getElementById('sim-summary-grid');
  if (summaryGrid) {
    summaryGrid.innerHTML = `
      <div class="kpi-card amber">
        <div class="kpi-label">Required Aluminum Slugs</div>
        <div class="kpi-value">${formatNumber(totalSlugTons, 2)} <small style="font-size:13px; font-weight:normal; color:var(--text-dim);">MTons</small></div>
        <div class="kpi-sub">${formatNumber(slugGross * thousandUnits, 0)} kg gross (10% line loss)</div>
      </div>

      <div class="kpi-card emerald">
        <div class="kpi-label">Internal Lacquer (${lacquerType === 'beige' ? 'Beige' : 'Gold'})</div>
        <div class="kpi-value">${formatNumber(lacquerGross * thousandUnits, 1)} <small style="font-size:13px; font-weight:normal; color:var(--text-dim);">kg</small></div>
        <div class="kpi-sub">35% airless spray loss factor (/0.65)</div>
      </div>

      <div class="kpi-card blue">
        <div class="kpi-label">Base Coat (${baseType === 'clear' ? 'Clear' : 'White'})</div>
        <div class="kpi-value">${formatNumber(baseGross * thousandUnits, 1)} <small style="font-size:13px; font-weight:normal; color:var(--text-dim);">kg</small></div>
        <div class="kpi-sub">10% roller loss factor (/0.90)</div>
      </div>

      <div class="kpi-card steel">
        <div class="kpi-label">Varnish (${varnishType === 'silkmatt' ? 'Silk-Matt' : 'Gloss'})</div>
        <div class="kpi-value">${formatNumber(varnishGross * thousandUnits, 1)} <small style="font-size:13px; font-weight:normal; color:var(--text-dim);">kg</small></div>
        <div class="kpi-sub">10% roller loss factor (/0.90)</div>
      </div>

      <div class="kpi-card emerald">
        <div class="kpi-label">Production Line Time</div>
        <div class="kpi-value">${estShifts} <small style="font-size:13px; font-weight:normal; color:var(--text-dim);">shifts</small></div>
        <div class="kpi-sub">${(estShifts / 2).toFixed(1)} days (2 shifts/day @ 90% OEE)</div>
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
    { code: '501', name: `${is160 ? '45mm' : '45mm'} Aluminum Slugs`, net: slugNet, loss: '10.0%', grossRate: slugGross, grossTotal: slugGross * thousandUnits, uom: 'kg' },
    { code: '502', name: 'SAPILUB LUBRIMET GR8 Extrusion Paste', net: lubNet, loss: '10.0%', grossRate: lubGross, grossTotal: lubGross * thousandUnits, uom: 'kg' },
    { code: '503', name: 'SAPILUB ALULIQUID 13 Alkaline Cleaner', net: cleanerNet, loss: '10.0%', grossRate: cleanerGross, grossTotal: cleanerGross * thousandUnits, uom: 'kg' },
    { code: lacquerItemCode, name: lacquerItemName, net: lacquerNet, loss: '35.0% (Spray)', grossRate: lacquerGross, grossTotal: lacquerGross * thousandUnits, uom: 'kg' },
    { code: baseItemCode, name: baseItemName, net: baseNet, loss: '10.0% (Roller)', grossRate: baseGross, grossTotal: baseGross * thousandUnits, uom: 'kg' },
    { code: varnishItemCode, name: varnishItemName, net: varnishNet, loss: '10.0% (Roller)', grossRate: varnishGross, grossTotal: varnishGross * thousandUnits, uom: 'kg' },
    { code: '510', name: `SunAltec MB PLUS Dry-Offset Inks (${numColors} Colors)`, net: 0.280 * numColors, loss: '10.0%', grossRate: inkTotalGross, grossTotal: inkTotalGross * thousandUnits, uom: 'kg' }
  ];

  const tableBody = document.getElementById('sim-table-body');
  if (tableBody) {
    tableBody.innerHTML = simItems.map(itm => {
      const stock = getStock(itm.code);
      const isCovered = stock >= itm.grossTotal;
      const covPct = itm.grossTotal > 0 ? ((stock / itm.grossTotal) * 100).toFixed(0) : '100';
      const badge = isCovered ?
        `<span class="badge badge-emerald">✓ In Stock (${covPct}%)</span>` :
        `<span class="badge badge-red">⚠️ Shortage: ${formatNumber(itm.grossTotal - stock, 1)} ${itm.uom}</span>`;

      return `
        <tr>
          <td><strong style="font-family: var(--font-mono); color: var(--color-amber);">${itm.code}</strong></td>
          <td style="font-weight: 500;">${itm.name}</td>
          <td class="num">${formatNumber(itm.net, 4)}</td>
          <td><span class="badge badge-steel">${itm.loss}</span></td>
          <td class="num">${formatNumber(itm.grossRate, 4)}</td>
          <td class="num" style="font-weight: bold; color: var(--color-amber);">${formatNumber(itm.grossTotal, 2)} ${itm.uom}</td>
          <td class="num">${formatNumber(stock, 1)} ${itm.uom}</td>
          <td>${badge}</td>
        </tr>
      `;
    }).join('');
  }
}
