/**
 * Component: Job Cards & MRP Planning (Alpha Aerosols)
 * Factory Manufacturing Operations, Orders, Inventory, Dispatches, and BOM Planning
 * Source of Truth: Alpha Aerosols - Planning & MRP.xlsx
 */

function renderJobCards(data) {
  const container = document.getElementById('view-jobcards');
  if (!container) return;

  const jobCards = data.job_cards || [];
  const mrpList = data.mrp || [];
  const products = data.products || [];
  const inventory = data.inventory || [];

  // Active Campaign Details
  const activeJobCard = jobCards.find(j => j.job_card_no === 'AER-PL-SOR-03') || jobCards[0] || {};
  const activePof = (data.orders || []).find(o => o.pof_number === 'AER-POF-03') || {};

  // Count items with deficit in the active MRP run
  const deficitItems = mrpList.filter(m => (m.surplus_deficit || 0) < 0);
  const totalDeficitCount = deficitItems.length;

  container.innerHTML = `
    <!-- Active Campaign Header Banner -->
    <div class="panel" style="border-left: 4px solid var(--color-amber); background: rgba(245, 158, 11, 0.04); margin-bottom: 24px;">
      <div class="panel-body" style="padding: 18px 24px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px;">
          <div>
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
              <span class="badge badge-amber" style="font-size: 12px; font-weight: 700; padding: 3px 10px;">ACTIVE MRP CAMPAIGN</span>
              <span class="badge badge-emerald">Job Card: ${activeJobCard.job_card_no || 'AER-PL-SOR-03'}</span>
              <span class="badge badge-steel">${activeJobCard.pof_number || 'AER-POF-03'}</span>
            </div>
            <h2 style="font-family: var(--font-display); font-size: 22px; color: var(--text-main); margin: 0 0 4px 0;">
              ${activeJobCard.product_name || 'Markhor Blanc 120ml'} — 100,000 Cans Run
            </h2>
            <div style="font-size: 13px; color: var(--text-muted);">
              Customer: <strong style="color: var(--text-main);">${activeJobCard.customer_name || 'Sarwana & Sohzsihm'}</strong> • 
              Container: <strong style="font-family: var(--font-mono); color: var(--color-amber);">${activeJobCard.finished_height || '45x131mm'}</strong> (140mm post-press cylinder) • 
              Barcode: <span style="font-family: var(--font-mono);">${activeJobCard.barcode || '8964000571651'}</span>
            </div>
          </div>

          <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
            ${activeJobCard.pdf_path ? `
              <a href="${activeJobCard.pdf_path}" target="_blank" class="btn btn-primary" style="padding: 8px 14px; font-size: 12px; display: inline-flex; align-items: center; gap: 6px;">
                📄 View Frozen PDF
              </a>
            ` : ''}
            ${activeJobCard.excel_path ? `
              <a href="${activeJobCard.excel_path}" target="_blank" class="btn btn-secondary" style="padding: 8px 14px; font-size: 12px; display: inline-flex; align-items: center; gap: 6px;">
                📊 Job Card (.xlsx)
              </a>
            ` : ''}
            <a href="./Alpha Aerosols - Planning & MRP.xlsx" download class="btn btn-secondary" style="padding: 8px 14px; font-size: 12px; display: inline-flex; align-items: center; gap: 6px;" title="Download Master Planning & MRP Workbook">
              📗 Master MRP (.xlsx)
            </a>
            <a href="./AER-PL-SOR-01 - Job Order Form (JOF).xlsx" download class="btn btn-secondary" style="padding: 8px 14px; font-size: 12px; display: inline-flex; align-items: center; gap: 6px;" title="Download Official QMS Job Order Form Template">
              📋 JOF Template (.xlsx)
            </a>
          </div>
        </div>

        <!-- Procurement Shortage Warning Alert -->
        ${totalDeficitCount > 0 ? `
          <div style="margin-top: 16px; padding: 12px 16px; background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.25); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span class="status-dot red"></span>
              <span style="font-size: 13px; color: var(--text-main);">
                <strong>Critical Procurement Alert:</strong> 
                <span style="color: var(--color-danger); font-weight: 600;">${totalDeficitCount} Material(s) in Deficit</span> for this 100k run. 
                Immediate purchase orders required for Slugs (def: 2,946 kg), Gold Lacquer (def: 72.6 kg), White Base Coat (def: 85.1 kg), Silk-Matt Varnish (def: 39.5 kg), Inks, and Cartons (def: 184 boxes @ 450 pcs/box).
              </span>
            </div>
            <a href="#inventory" class="btn btn-secondary" style="padding: 4px 10px; font-size: 11px;">View Stores Ledger →</a>
          </div>
        ` : ''}
      </div>
    </div>

    <!-- Section 1: Active Campaign MRP Material Requirements Table -->
    <div class="panel" style="margin-bottom: 24px;">
      <div class="panel-header">
        <div class="panel-title">
          <span>Active Campaign MRP Material Requirements Breakdown</span>
          <small>Yield-Inverse Physical Mass Balance & Store Feasibility for AER-PL-SOR-03 (100,000 cans)</small>
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
          <span class="badge ${totalDeficitCount > 0 ? 'badge-amber' : 'badge-emerald'}">${totalDeficitCount} Material Deficits</span>
          <span class="badge badge-steel">${mrpList.length} Line Items</span>
        </div>
      </div>

      <div class="table-responsive">
        <table class="data-table" id="mrp-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Material Category & Description</th>
              <th class="num">Net Spec</th>
              <th>Scrap %</th>
              <th class="num">Gross Required</th>
              <th class="num">Store Stock</th>
              <th class="num">Surplus / Deficit</th>
              <th class="num" title="Number of cans this stock balance can produce">Cans Can Produce</th>
              <th>Readiness</th>
            </tr>
          </thead>
          <tbody>
            ${mrpList.length === 0 ? `
              <tr><td colspan="9" style="text-align: center; padding: 24px;">No MRP requirements recorded.</td></tr>
            ` : mrpList.map(item => {
              const isZeroMix = (item.gross_required || 0) === 0;
              const deficit = !isZeroMix && (item.surplus_deficit || 0) < 0;
              const readinessBadge = isZeroMix ? 'badge-steel' : (deficit ? 'badge-red' : 'badge-emerald');
              const readinessLabel = isZeroMix ? '0% MIX (NOT REQ)' : (deficit ? 'SHORTAGE' : 'READY');
              const canProduce = item.cans_can_produce;
              const isNumericCanProduce = typeof canProduce === 'number' && !isNaN(canProduce);
              const canColor = isZeroMix ? 'var(--text-dim)' : ((isNumericCanProduce && canProduce < 100000) ? 'var(--color-danger)' : 'var(--color-emerald)');

              return `
                <tr style="${deficit ? 'background: rgba(239, 68, 68, 0.02);' : ''}">
                  <td><strong style="font-family: var(--font-mono); color: var(--color-amber);">${item.item_id}</strong></td>
                  <td>
                    <div style="font-weight: 600;">${item.item_name}</div>
                    <div style="font-size: 10px; color: var(--text-dim);">${item.category}</div>
                  </td>
                  <td class="num" style="font-family: var(--font-mono); font-size: 12px; color: var(--text-muted);">
                    ${formatNumber(item.net_required, 2)} ${item.uom}
                  </td>
                  <td>
                    <span class="badge badge-steel" style="font-size: 10px;">${(item.scrap_pct * 100).toFixed(1)}%</span>
                  </td>
                  <td class="num" style="font-weight: 700; font-size: 13px; color: var(--text-main);">
                    ${formatNumber(item.gross_required, 2)} <small style="font-size: 10px; color: var(--text-muted);">${item.uom}</small>
                  </td>
                  <td class="num" style="font-family: var(--font-mono); font-weight: 600; color: ${item.current_stock > 0 ? 'var(--text-main)' : 'var(--text-dim)'};">
                    ${formatNumber(item.current_stock, 2)} ${item.uom}
                  </td>
                  <td class="num" style="font-weight: 700; font-family: var(--font-mono); color: ${isZeroMix ? 'var(--text-dim)' : (deficit ? 'var(--color-danger)' : 'var(--color-emerald)')};">
                    ${isZeroMix ? '0.00' : `${deficit ? '' : '+'}${formatNumber(item.surplus_deficit, 2)}`} ${item.uom}
                  </td>
                  <td class="num" style="font-weight: 700; font-family: var(--font-mono); color: ${canColor};">
                    ${isZeroMix ? '—' : formatNumber(isNumericCanProduce ? canProduce : 0)}
                  </td>
                  <td>
                    <span class="badge ${readinessBadge}">${readinessLabel}</span>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Section 2: Master Issued Job Cards Ledger Table -->
    <div class="panel" style="margin-bottom: 24px;">
      <div class="panel-header">
        <div class="panel-title">
          <span>Master Issued Job Cards Ledger</span>
          <small>Authoritative Shop-Floor Production Specifications & Frozen Workbooks</small>
        </div>
        <div style="display: flex; gap: 8px;">
          <span class="badge badge-emerald">${jobCards.length} Cards Issued</span>
        </div>
      </div>

      <div class="table-responsive">
        <table class="data-table" id="jobcards-ledger-table">
          <thead>
            <tr>
              <th>Job Card #</th>
              <th>POF # & Customer</th>
              <th>Product & Height</th>
              <th class="num">Order Qty</th>
              <th>Coating Specs (Internal / Base / OPV)</th>
              <th>Ink Colors & Barcode</th>
              <th>Status</th>
              <th style="text-align: center;">Frozen Job Cards</th>
            </tr>
          </thead>
          <tbody>
            ${jobCards.length === 0 ? `
              <tr><td colspan="8" style="text-align: center; padding: 24px;">No issued job cards found.</td></tr>
            ` : jobCards.map(jc => {
              const statusClass = jc.status === 'Completed' ? 'badge-emerald' : 
                                 (jc.status === 'In Progress' ? 'badge-amber' : 
                                 (jc.status === 'Issued to Floor' ? 'badge-blue' : 'badge-steel'));
              return `
                <tr>
                  <td>
                    <strong style="font-family: var(--font-mono); color: var(--color-amber); font-size: 13px;">${jc.job_card_no}</strong>
                    <div style="font-size: 10px; color: var(--text-dim);">${jc.issue_date || '2026-11-01'}</div>
                  </td>
                  <td>
                    <div style="font-weight: 600;">${jc.customer_name}</div>
                    <div style="font-family: var(--font-mono); font-size: 11px; color: var(--color-amber);">${jc.pof_number}</div>
                  </td>
                  <td>
                    <div style="font-weight: 600;">${jc.product_name}</div>
                    <div style="font-size: 11px; color: var(--text-muted); font-family: var(--font-mono);">${jc.finished_height}</div>
                  </td>
                  <td class="num" style="font-weight: 700; font-size: 13px;">
                    ${formatNumber(jc.order_qty)} <small style="font-weight: normal; color: var(--text-muted);">±${jc.tolerance_pct ? (jc.tolerance_pct * 100).toFixed(0) : 5}%</small>
                  </td>
                  <td>
                    <div style="font-size: 11px;"><strong>Internal:</strong> ${jc.internal_lacquer}</div>
                    <div style="font-size: 11px;"><strong>Base:</strong> ${jc.base_coat}</div>
                    <div style="font-size: 11px;"><strong>Varnish:</strong> ${jc.overprint_varnish}</div>
                  </td>
                  <td>
                    <div style="font-size: 11px; font-weight: 500;">${jc.num_colors || 2} Color(s)</div>
                    <div style="font-size: 10px; font-family: var(--font-mono); color: var(--text-dim);">${jc.barcode || '-'}</div>
                  </td>
                  <td>
                    <span class="badge ${statusClass}">${jc.status}</span>
                  </td>
                  <td style="text-align: center; white-space: nowrap;">
                    <div style="display: inline-flex; gap: 6px;">
                      ${jc.pdf_path ? `
                        <a href="${jc.pdf_path}" target="_blank" class="btn btn-secondary" style="padding: 4px 8px; font-size: 11px;" title="Open Frozen PDF Job Card">
                          📄 PDF
                        </a>
                      ` : ''}
                      ${jc.excel_path ? `
                        <a href="${jc.excel_path}" target="_blank" class="btn btn-secondary" style="padding: 4px 8px; font-size: 11px;" title="Download Frozen XLSX Job Card">
                          📊 XLSX
                        </a>
                      ` : ''}
                    </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Section 3: Registered Master Products Directory -->
    <div class="panel">
      <div class="panel-header">
        <div class="panel-title">
          <span>Registered Master Products Directory</span>
          <small>Products_DB Specifications (Kot Abdul Malik Standard)</small>
        </div>
        <span class="badge badge-steel">${products.length} Products</span>
      </div>

      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>PID</th>
              <th>Product Name</th>
              <th>Customer</th>
              <th>Dimensions</th>
              <th>Base Coat Spec</th>
              <th>Colors & Inks</th>
              <th>Finish Spec</th>
              <th>Packing & Carton Spec</th>
              <th>Barcode</th>
            </tr>
          </thead>
          <tbody>
            ${products.length === 0 ? `
              <tr><td colspan="9" style="text-align: center; padding: 24px;">No registered products found.</td></tr>
            ` : products.map(p => `
              <tr>
                <td><strong style="font-family: var(--font-mono); color: var(--color-amber);">${p.id}</strong></td>
                <td><strong style="color: var(--text-main);">${p.product_name}</strong></td>
                <td>${p.customer_name}</td>
                <td>
                  <span class="badge badge-steel">${p.product_size}</span>
                  <div style="font-size: 10px; color: var(--text-dim);">${p.trimmed_height} trimmed</div>
                </td>
                <td><span style="font-size: 11px; ${p.base_coat_g_m2 === '—' ? 'color: var(--text-dim); font-style: italic;' : ''}">${p.base_coat_type}${p.base_coat_g_m2 !== '—' ? ` (${p.base_coat_g_m2} g/m²)` : ''}</span></td>
                <td><span style="font-size: 11px;">${p.ink_colors_count} Colors (${p.ink_pantones || 'CMYK'})</span></td>
                <td><span style="font-size: 11px; ${p.varnish_g_m2 === '—' ? 'color: var(--text-dim); font-style: italic;' : ''}">${p.varnish_type}${p.varnish_g_m2 !== '—' ? ` (${p.varnish_g_m2} g/m²)` : ''}</span></td>
                <td><span style="font-size: 11px; color: var(--text-muted);">${p.packing_spec || '450 pcs/Carton (61.5×50×41 cm) / 3,000 per Pallet'}</span></td>
                <td><span style="font-family: var(--font-mono); font-size: 11px; color: var(--text-muted);">${p.barcode}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}
