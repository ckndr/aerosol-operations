/**
 * Component: Executive KPI Dashboard (Alpha Aerosols)
 * Real-time operational metrics for Sikander & Production Manager
 */

function renderDashboard(data) {
  const container = document.getElementById('view-dashboard');
  if (!container) return;

  const kpis = data.kpis || {};
  const shifts = (data.shifts || []).slice(0, 8); // Latest 8 shifts
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

  container.innerHTML = `
    <!-- Top Executive KPI Grid -->
    <div class="kpi-grid">
      <div class="kpi-card emerald">
        <div class="kpi-label">
          <span>Today's Finished Output</span>
          <span class="status-dot emerald"></span>
        </div>
        <div class="kpi-value">${formatNumber(kpis.today_output_cans)} <small style="font-size: 13px; font-weight: normal; color: var(--text-dim)">cans</small></div>
        <div class="kpi-sub">
          <span>Line Scrap: <strong>${formatNumber(kpis.today_scrap_cans)} pcs (${kpis.today_scrap_pct}%)</strong></span>
        </div>
      </div>

      <div class="kpi-card emerald">
        <div class="kpi-label">
          <span>Month-to-Date (MTD) Output</span>
          <span class="badge badge-emerald">Sep 2026</span>
        </div>
        <div class="kpi-value">${formatNumber(kpis.mtd_output_cans)} <small style="font-size: 13px; font-weight: normal; color: var(--text-dim)">cans</small></div>
        <div class="kpi-sub">
          <span>Total MTD Line Scrap: <strong>${formatNumber(kpis.mtd_scrap_cans)} pcs</strong></span>
        </div>
      </div>

      <div class="kpi-card ${scrapClass}">
        <div class="kpi-label">
          <span>Consolidated Line Scrap %</span>
          <span class="status-dot ${scrapClass}"></span>
        </div>
        <div class="kpi-value">${kpis.mtd_scrap_pct}%</div>
        <div class="kpi-sub">
          <span>Status: <strong>${scrapLabel}</strong></span>
        </div>
      </div>

      <div class="kpi-card blue">
        <div class="kpi-label">
          <span>Active Production Orders</span>
          <span class="badge badge-steel">${kpis.active_pofs_count} POFs</span>
        </div>
        <div class="kpi-value">${kpis.active_pofs_count}</div>
        <div class="kpi-sub">
          <span>45x160mm & 45x150mm Lines Active</span>
        </div>
      </div>

      <div class="kpi-card amber">
        <div class="kpi-label">
          <span>Today's Dispatches</span>
          <span class="status-dot amber"></span>
        </div>
        <div class="kpi-value">${formatNumber(kpis.today_dispatches_cans)} <small style="font-size: 13px; font-weight: normal; color: var(--text-dim)">cans</small></div>
        <div class="kpi-sub">
          <span>${kpis.today_dispatches_count} Delivery Challan(s) Issued</span>
        </div>
      </div>
    </div>

    <!-- Operational Split: Recent Shifts Log & Downtime Root Cause Pareto -->
    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px;">
      
      <!-- Left: Recent Shift Production Run Log -->
      <div class="panel">
        <div class="panel-header">
          <div class="panel-title">
            <span>Single-Stage Finished Shift Log</span>
            <small>Final Saleable Cans Counted at Packing Stage</small>
          </div>
          <a href="#entry" class="btn btn-primary" style="padding: 6px 12px; font-size: 12px;">+ Log Floor Shift</a>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Date & Shift</th>
                <th>POF # & Customer</th>
                <th>Size</th>
                <th class="num">Good Cans</th>
                <th class="num">Line Scrap</th>
                <th class="num">Scrap %</th>
                <th>Downtime Reason</th>
                <th>Supervisor</th>
              </tr>
            </thead>
            <tbody>
              ${shifts.length === 0 ? `
                <tr>
                  <td colspan="8" style="text-align:center; padding: 36px 16px; color: var(--text-dim);">
                    <div style="font-size: 28px; margin-bottom: 6px;">🏭</div>
                    <div style="font-weight: 600; color: var(--text-main); font-size: 14px; margin-bottom: 4px;">No floor shifts logged yet</div>
                    <div style="font-size: 12px; color: var(--text-muted); max-width: 440px; margin: 0 auto;">Plant is configured in pre-production readiness mode. Floor entries logged via the Shift Entry tab will be recorded here immediately.</div>
                  </td>
                </tr>
              ` : shifts.map(s => {
                const badgeStyle = s.scrap_pct >= 5.0 ? 'badge-red' : (s.scrap_pct >= 3.5 ? 'badge-amber' : 'badge-emerald');
                const shiftPill = s.shift_type === 'Day' ? '<span class="badge badge-amber">DAY</span>' : '<span class="badge badge-steel">NIGHT</span>';
                return `
                  <tr>
                    <td>
                      <div style="font-weight: 600;">${formatDate(s.shift_date)}</div>
                      <div>${shiftPill}</div>
                    </td>
                    <td>
                      <div style="font-weight: 600; color: var(--color-amber);">${s.pof_number}</div>
                      <div style="font-size: 11px; color: var(--text-muted);">${s.customer_name || 'Alpha Standard'}</div>
                    </td>
                    <td><span class="badge badge-steel">${s.product_size}</span></td>
                    <td class="num" style="font-weight: bold; color: var(--color-emerald);">${formatNumber(s.good_cans)}</td>
                    <td class="num" style="color: var(--text-muted);">${formatNumber(s.line_scrap)}</td>
                    <td class="num"><span class="badge ${badgeStyle}">${s.scrap_pct}%</span></td>
                    <td>
                      <div>${s.downtime_reason || 'None'}</div>
                      <small style="color: var(--text-dim);">${s.downtime_hours > 0 ? s.downtime_hours + ' hrs stoppage' : 'Full continuous run'}</small>
                    </td>
                    <td style="color: var(--text-muted);">${s.supervisor}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Right: Downtime Pareto Breakdown -->
      <div class="panel">
        <div class="panel-header">
          <div class="panel-title">
            <span>Downtime Root Cause Pareto</span>
            <small>MTD Stoppage Impact</small>
          </div>
          <span class="badge badge-amber">${kpis.downtime_hours_mtd} Total Hrs</span>
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
          
          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border-subtle);">
            <div style="font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px;">
              Single-Stage Tracking Rule
            </div>
            <p style="font-size: 12px; color: var(--text-dim); line-height: 1.4;">
              Intermediate machine counts (press, washer, trimmer) are excluded. Line rejections anywhere along the line are consolidated into Total Line Scrap.
            </p>
          </div>
        </div>
      </div>

    </div>
  `;
}
