/**
 * Component: Executive KPI Dashboard (Alpha Aerosols)
 * Real-time operational metrics for Sikander & Production Manager
 * Single-Stage Finished Container Tracking & Order Fulfillment Matrix
 */

function renderDashboard(data) {
  const container = document.getElementById('view-dashboard');
  if (!container) return;

  const kpis = data.kpis || {};
  const downtimePareto = data.downtime_pareto || [];

  // Determine Scrap Status Indicator
  let scrapClass = 'emerald';
  let scrapLabel = (kpis.mtd_output_cans && kpis.mtd_output_cans > 0) ? 'Optimal (<3.5%)' : 'Pre-Production (Ready)';
  if (kpis.mtd_scrap_pct >= 5.0) {
    scrapClass = 'red';
    scrapLabel = 'Critical High (>=5.0%)';
  } else if (kpis.mtd_scrap_pct >= 3.5) {
    scrapClass = 'amber';
    scrapLabel = 'Attention (>=3.5%)';
  }

  // Latest Completed Shift (Fixes Morning Zero Trap)
  const latestShift = kpis.latest_shift || ((data.shifts || []).find(s => (s.good_cans > 0 || s.line_scrap > 0)) || (data.shifts || [])[0] || {
    good_cans: 0,
    line_scrap: 0,
    scrap_pct: 0.0,
    shift_date: kpis.as_of_date || '2026-09-12',
    shift_type: 'Day',
    supervisor: 'Tariq Mahmood'
  });

  // Finished Goods Warehouse Buffer (Produced - Dispatched)
  const fgBufferCans = kpis.fg_buffer_cans !== undefined
    ? kpis.fg_buffer_cans
    : (data.orders || []).reduce((acc, o) => acc + Math.max(0, (o.produced_good || 0) - (o.dispatched_total || 0)), 0);
  const fgBufferPallets = kpis.fg_buffer_pallets !== undefined
    ? kpis.fg_buffer_pallets
    : (fgBufferCans > 0 ? (fgBufferCans / 3000).toFixed(1) : 0);

  // Active Production Orders & Product Fulfillment Matrix calculation
  const activeOrders = (data.orders || []).filter(o => o.status === 'In Production' || o.status === 'Pending');
  const displayOrders = activeOrders.length > 0 ? activeOrders : (data.orders || []);

  let totalOrderQty = 0;
  let totalProduced = 0;
  let totalFgStock = 0;
  let totalDispatched = 0;
  let totalRemaining = 0;

  displayOrders.forEach(ord => {
    const fgStock = ord.fg_stock !== undefined
      ? ord.fg_stock
      : Math.max(0, (ord.produced_good || 0) - (ord.dispatched_total || 0));
    totalOrderQty += (ord.order_qty || 0);
    totalProduced += (ord.produced_good || 0);
    totalFgStock += fgStock;
    totalDispatched += (ord.dispatched_total || 0);
    totalRemaining += (ord.remaining_qty || 0);
  });

  const overallCompletionPct = totalOrderQty > 0
    ? ((totalProduced / totalOrderQty) * 100).toFixed(1)
    : '0.0';

  container.innerHTML = `
    <!-- Top Executive KPI Grid -->
    <div class="kpi-grid">
      
      <!-- Card 1: Latest Completed Shift (Fixes Morning Zero Trap) -->
      <div class="kpi-card emerald" title="Output from the most recently completed production shift (eliminates morning zero perception)">
        <div class="kpi-label">
          <span>Latest Completed Shift</span>
          <span class="badge ${latestShift.shift_type === 'Night' ? 'badge-steel' : 'badge-amber'}">${(latestShift.shift_type || 'DAY').toUpperCase()}</span>
        </div>
        <div class="kpi-value">${formatNumber(latestShift.good_cans || 0)} <small style="font-size: 13px; font-weight: normal; color: var(--text-dim)">cans</small></div>
        <div class="kpi-sub">
          <span>${latestShift.shift_date ? formatDate(latestShift.shift_date) : '-'} • <strong>${latestShift.supervisor || 'Shift Lead'}</strong> (${latestShift.scrap_pct || 0}% scrap)</span>
        </div>
      </div>

      <!-- Card 2: Today's Finished Output -->
      <div class="kpi-card emerald">
        <div class="kpi-label">
          <span>Today's Finished Output</span>
          <span class="status-dot emerald"></span>
        </div>
        <div class="kpi-value">${formatNumber(kpis.today_output_cans || 0)} <small style="font-size: 13px; font-weight: normal; color: var(--text-dim)">cans</small></div>
        <div class="kpi-sub">
          <span>Line Scrap: <strong>${formatNumber(kpis.today_scrap_cans || 0)} pcs (${kpis.today_scrap_pct || 0}%)</strong></span>
        </div>
      </div>

      <!-- Card 3: Month-to-Date (MTD) Output -->
      <div class="kpi-card emerald">
        <div class="kpi-label">
          <span>Month-to-Date (MTD) Output</span>
          <span class="badge badge-emerald">Sep 2026</span>
        </div>
        <div class="kpi-value">${formatNumber(kpis.mtd_output_cans || 0)} <small style="font-size: 13px; font-weight: normal; color: var(--text-dim)">cans</small></div>
        <div class="kpi-sub">
          <span>Total MTD Line Scrap: <strong>${formatNumber(kpis.mtd_scrap_cans || 0)} pcs</strong></span>
        </div>
      </div>

      <!-- Card 4: Consolidated Line Scrap % -->
      <div class="kpi-card ${scrapClass}">
        <div class="kpi-label">
          <span>Consolidated Line Scrap %</span>
          <span class="status-dot ${scrapClass}"></span>
        </div>
        <div class="kpi-value">${kpis.mtd_scrap_pct || 0}%</div>
        <div class="kpi-sub">
          <span>Status: <strong>${scrapLabel}</strong></span>
        </div>
      </div>

      <!-- Card 5: FG Warehouse Buffer (Pallets / Cans Awaiting Dispatch) -->
      <div class="kpi-card amber" title="Finished goods physically produced and stored in central warehouse awaiting delivery challan dispatch">
        <div class="kpi-label">
          <span>FG Warehouse Buffer</span>
          <span class="status-dot amber"></span>
        </div>
        <div class="kpi-value">${formatNumber(fgBufferCans)} <small style="font-size: 13px; font-weight: normal; color: var(--text-dim)">cans</small></div>
        <div class="kpi-sub">
          <span>~<strong>${fgBufferPallets} Pallet(s)</strong> awaiting customer dispatch</span>
        </div>
      </div>

      <!-- Card 6: Active Production Orders -->
      <div class="kpi-card blue">
        <div class="kpi-label">
          <span>Active Production Orders</span>
          <span class="badge badge-steel">${kpis.active_pofs_count || displayOrders.length} POFs</span>
        </div>
        <div class="kpi-value">${kpis.active_pofs_count || displayOrders.length}</div>
        <div class="kpi-sub">
          <span>45x160mm & 45x150mm Lines Active</span>
        </div>
      </div>

      <!-- Card 7: Today's Dispatches -->
      <div class="kpi-card amber">
        <div class="kpi-label">
          <span>Today's Dispatches</span>
          <span class="status-dot amber"></span>
        </div>
        <div class="kpi-value">${formatNumber(kpis.today_dispatches_cans || 0)} <small style="font-size: 13px; font-weight: normal; color: var(--text-dim)">cans</small></div>
        <div class="kpi-sub">
          <span>${kpis.today_dispatches_count || 0} Delivery Challan(s) Issued</span>
        </div>
      </div>

    </div>

    <!-- Active Production Orders & Product Fulfillment Matrix -->
    <div class="panel">
      <div class="panel-header">
        <div class="panel-title">
          <span>Active Production Orders & Product Fulfillment Matrix</span>
          <small>POF Manufacturing Progress, FG Warehouse Buffer, Tolerance & Fulfillment</small>
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
          <a href="#orders" class="btn btn-secondary" style="padding: 6px 12px; font-size: 12px;">Customer POF Tracker →</a>
          <a href="#entry" class="btn btn-primary" style="padding: 6px 12px; font-size: 12px;">+ Log Floor Shift</a>
        </div>
      </div>
      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>POF #</th>
              <th>Customer & Product</th>
              <th>Size</th>
              <th class="num">Order Qty</th>
              <th class="num">Produced MTD</th>
              <th class="num" title="Produced Good cans minus Dispatched cans">FG Stock<br><small style="font-size: 10px; font-weight: normal; color: var(--text-muted);">(Prod - Disp)</small></th>
              <th class="num">Dispatched Total</th>
              <th class="num">Remaining</th>
              <th style="min-width: 170px;">Progress Bar & Tolerance</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            ${displayOrders.length === 0 ? `
              <tr>
                <td colspan="10" style="text-align:center; padding: 36px 16px; color: var(--text-dim);">
                  <div style="font-size: 28px; margin-bottom: 6px;">📋</div>
                  <div style="font-weight: 600; color: var(--text-main); font-size: 14px; margin-bottom: 4px;">No active production orders found</div>
                  <div style="font-size: 12px; color: var(--text-muted); max-width: 440px; margin: 0 auto;">Active commercial production orders will appear here automatically with real-time fulfillment and tolerance indicators.</div>
                </td>
              </tr>
            ` : displayOrders.map(ord => {
              const fgStock = ord.fg_stock !== undefined
                ? ord.fg_stock
                : Math.max(0, (ord.produced_good || 0) - (ord.dispatched_total || 0));
              const barClass = ord.completion_pct >= 100 ? 'emerald' : 'amber';
              const isTol = ord.is_within_tolerance;
              const tolLabel = isTol
                ? '<span style="color: var(--color-emerald); font-weight: 600;">✓ In Tol (±5%)</span>'
                : (ord.produced_good === 0
                  ? '<span style="color: var(--text-dim);">Pending Run</span>'
                  : (ord.produced_good < ord.min_acceptable_qty
                    ? '<span style="color: var(--color-amber);">In Progress</span>'
                    : '<span style="color: var(--color-danger);">Over Tol</span>'));

              return `
                <tr>
                  <td>
                    <strong style="font-family: var(--font-mono); color: var(--color-amber);">${ord.pof_number}</strong>
                    <div style="font-size: 10px; color: var(--text-dim);">${ord.artwork_ref || 'Art Proof Rev1'}</div>
                  </td>
                  <td>
                    <div style="font-weight: 600;">${ord.customer_name}</div>
                    <div style="font-size: 11px; color: var(--text-muted);">${ord.product_name}</div>
                  </td>
                  <td><span class="badge badge-steel">${ord.product_size}</span></td>
                  <td class="num" style="font-weight: 600;">${formatNumber(ord.order_qty)}</td>
                  <td class="num" style="font-weight: bold; color: var(--color-emerald);">${formatNumber(ord.produced_good || 0)}</td>
                  <td class="num" style="font-weight: bold; color: ${fgStock > 0 ? 'var(--color-amber)' : 'var(--text-dim)'};">
                    ${formatNumber(fgStock)}
                  </td>
                  <td class="num" style="color: var(--text-main);">${formatNumber(ord.dispatched_total || 0)}</td>
                  <td class="num" style="font-weight: 600; color: ${(ord.remaining_qty || 0) > 0 ? 'var(--text-main)' : 'var(--color-emerald)'};">
                    ${formatNumber(ord.remaining_qty || 0)}
                  </td>
                  <td>
                    <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 11px; margin-bottom: 2px;">
                      <span>${ord.completion_pct}%</span>
                      <span>${tolLabel}</span>
                    </div>
                    <div class="progress-bar-container">
                      <div class="progress-bar-fill ${barClass}" style="width: ${Math.min(100, ord.completion_pct)}%"></div>
                    </div>
                  </td>
                  <td>
                    <div style="font-weight: 500;">${formatDate(ord.due_date)}</div>
                    <div style="font-size: 10px; color: var(--text-dim);">${ord.status}</div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
          <tfoot>
            <tr style="background: rgba(255, 255, 255, 0.025); font-weight: bold; border-top: 2px solid var(--border-strong);">
              <td colspan="3" style="font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-main);">
                TOTAL (${displayOrders.length} Active Orders)
              </td>
              <td class="num" style="font-weight: 700;">${formatNumber(totalOrderQty)}</td>
              <td class="num" style="font-weight: 700; color: var(--color-emerald);">${formatNumber(totalProduced)}</td>
              <td class="num" style="font-weight: 700; color: var(--color-amber);">${formatNumber(totalFgStock)}</td>
              <td class="num" style="font-weight: 700;">${formatNumber(totalDispatched)}</td>
              <td class="num" style="font-weight: 700;">${formatNumber(totalRemaining)}</td>
              <td>
                <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 11px; margin-bottom: 2px;">
                  <strong>${overallCompletionPct}%</strong>
                  <span style="color: var(--text-dim);">Fulfillment</span>
                </div>
                <div class="progress-bar-container">
                  <div class="progress-bar-fill ${parseFloat(overallCompletionPct) >= 100 ? 'emerald' : 'amber'}" style="width: ${Math.min(100, parseFloat(overallCompletionPct))}%"></div>
                </div>
              </td>
              <td style="color: var(--text-dim);">-</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Operational Analytics: Downtime Root Cause Pareto & Single-Stage Quality Governance -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
      
      <!-- Left: Downtime Root Cause Pareto Breakdown -->
      <div class="panel">
        <div class="panel-header">
          <div class="panel-title">
            <span>Downtime Root Cause Pareto</span>
            <small>MTD Stoppage Impact</small>
          </div>
          <span class="badge badge-amber">${kpis.downtime_hours_mtd || 0} Total Hrs</span>
        </div>
        <div class="panel-body">
          ${downtimePareto.length === 0 ? `
            <div style="text-align: center; padding: 28px 12px; color: var(--text-dim);">
              <div style="font-size: 24px; margin-bottom: 6px;">⏱️</div>
              <div style="font-weight: 600; color: var(--text-main); font-size: 13px; margin-bottom: 2px;">Zero Downtime Recorded</div>
              <div style="font-size: 11px; color: var(--text-muted);">Continuous line ready for operation. Stoppages and root causes will be categorized here automatically.</div>
            </div>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 14px;">
              ${downtimePareto.map(item => {
                const pct = kpis.downtime_hours_mtd > 0 ? Math.round((item.hours / kpis.downtime_hours_mtd) * 100) : 0;
                return `
                  <div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px; font-size: 12px;">
                      <span style="font-weight: 500;">${item.reason}</span>
                      <span style="font-family: var(--font-mono); color: var(--color-amber);">${item.hours} hrs (${pct}%)</span>
                    </div>
                    <div class="progress-bar-container">
                      <div class="progress-bar-fill amber" style="width: ${pct}%"></div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          `}
        </div>
      </div>

      <!-- Right: Operational Controls & Single-Stage Rules -->
      <div class="panel">
        <div class="panel-header">
          <div class="panel-title">
            <span>Plant Operational Standards</span>
            <small>Kot Abdul Malik Operations Governance</small>
          </div>
          <span class="badge badge-emerald">Locked v2.0</span>
        </div>
        <div class="panel-body" style="font-size: 12px; line-height: 1.5; color: var(--text-muted);">
          <div style="margin-bottom: 12px;">
            <strong style="color: var(--text-main); display: block; margin-bottom: 2px;">1. Single-Stage Finished Tracking</strong>
            Container counts are recorded exclusively at the final packing stage. Rejections anywhere along the line are consolidated into Total Line Scrap.
          </div>
          <div style="margin-bottom: 12px;">
            <strong style="color: var(--text-main); display: block; margin-bottom: 2px;">2. Physical Yield-Inverse Mass Balance</strong>
            Coating consumption strictly enforces <code>Req = Net / (1 - Scrap)</code> (35% lacquer loss = 1.5385×Net; 10% base coat/OPV loss = 1.1111×Net).
          </div>
          <div>
            <strong style="color: var(--text-main); display: block; margin-bottom: 2px;">3. Chemical Climate Safeguards</strong>
            Schekosol coatings have a 6-month shelf life and require strict 20°C–25°C air-conditioned storage with automated amber/red warning badges.
          </div>
        </div>
      </div>

    </div>
  `;
}

