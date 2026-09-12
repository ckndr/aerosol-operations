/**
 * Component: Bidirectional Shift Logging Web Form (Alpha Aerosols)
 * Touch-friendly on-site floor logger with IndexedDB offline resilience
 * Single-Stage Finished Container Tracking Only
 */

let selectedShiftType = 'Day';

function renderShiftEntry(data) {
  const container = document.getElementById('view-entry');
  if (!container) return;

  const orders = (data.orders || []).filter(o => o.status === 'In Production' || o.status === 'Pending');
  const todayIso = new Date().toISOString().split('T')[0];

  container.innerHTML = `
    <div style="max-width: 800px; margin: 0 auto;">
      
      <!-- Offline Notice Banner -->
      <div id="offline-entry-banner" class="panel" style="display: ${AppState.isOnline ? 'none' : 'block'}; border-left: 4px solid var(--color-amber); padding: 12px 16px; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span class="status-dot amber"></span>
          <div>
            <strong>Offline Mode Active:</strong> Shifts will be saved safely into local IndexedDB and synced to central database once connected.
          </div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-header">
          <div class="panel-title">
            <span>On-Site Floor Shift Production Logger</span>
            <small>Single-Stage Finished Product Tracking</small>
          </div>
          <span class="badge badge-emerald">Kot Abdul Malik Floor</span>
        </div>

        <div class="panel-body">
          <form id="shift-entry-form" onsubmit="handleShiftSubmit(event)">
            
            <!-- Row 1: Date & Shift Toggle -->
            <div style="margin-bottom: 20px;">
              <label class="form-label" style="margin-bottom: 8px; display: block;">Select Shift Window</label>
              <div class="shift-toggle-group">
                <button type="button" class="shift-btn ${selectedShiftType === 'Day' ? 'active' : ''}" onclick="selectShift('Day')">
                  ☀️ DAY SHIFT (08:00 – 20:00)
                </button>
                <button type="button" class="shift-btn ${selectedShiftType === 'Night' ? 'active' : ''}" onclick="selectShift('Night')">
                  🌙 NIGHT SHIFT (20:00 – 08:00)
                </button>
              </div>
            </div>

            <!-- Row 2: Date & Order Selection -->
            <div class="form-grid" style="margin-bottom: 20px;">
              <div class="form-group">
                <label class="form-label">Shift Production Date</label>
                <input type="date" name="shift_date" class="form-input" value="${todayIso}" required>
              </div>

              <div class="form-group">
                <label class="form-label">Active POF # & Customer</label>
                <select name="pof_id" class="form-select" required onchange="handlePofChange(this)">
                  <option value="">-- Select Active POF --</option>
                  ${orders.map(o => `
                    <option value="${o.id}" data-size="${o.product_size}" data-customer="${o.customer_name}" data-rem="${o.remaining_qty}">
                      ${o.pof_number} — ${o.customer_name} (${o.product_size})
                    </option>
                  `).join('')}
                </select>
              </div>
            </div>

            <!-- Product Size Display -->
            <div id="pof-meta-box" style="display: none; background: var(--bg-base); border: 1px solid var(--border-subtle); padding: 10px 14px; border-radius: var(--radius-sm); margin-bottom: 20px; font-family: var(--font-mono); font-size: 12px;">
              Container Size: <strong id="selected-size-label" style="color: var(--color-amber);">45x160mm</strong> | Customer: <strong id="selected-customer-label">Golden Pearl</strong> | Remaining to Produce: <strong id="selected-rem-label">0</strong> cans
            </div>

            <input type="hidden" name="product_size" id="input-product-size" value="45x160mm">

            <!-- Row 3: Output Cans & Scrap (Large Touch Inputs) -->
            <div class="form-grid" style="margin-bottom: 20px;">
              <div class="form-group">
                <label class="form-label">Good Finished Cans Packed (pcs)</label>
                <input type="number" name="good_cans" id="input-good-cans" class="form-input form-input-lg" placeholder="e.g. 15000" min="0" required oninput="recalcShiftMetrics()">
                <small style="color: var(--text-dim); font-size: 11px;">Counted exclusively at final carton/pallet packing station.</small>
              </div>

              <div class="form-group">
                <label class="form-label">Total Line Rejections / Scrap (pcs)</label>
                <input type="number" name="line_scrap" id="input-line-scrap" class="form-input form-input-lg" placeholder="e.g. 500" min="0" required oninput="recalcShiftMetrics()">
                <small style="color: var(--text-dim); font-size: 11px;">Consolidated scrap dropped anywhere along the continuous line.</small>
              </div>
            </div>

            <!-- Live Calculated Mass Balance Metrics -->
            <div class="metric-highlight-box" style="margin-bottom: 24px;">
              <div>
                <div style="font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); text-transform: uppercase;">Total Line Run</div>
                <div id="calc-total-run" style="font-family: var(--font-mono); font-size: 22px; font-weight: bold; color: var(--text-main);">0</div>
                <div style="font-size: 11px; color: var(--text-dim);">Good + Rejections</div>
              </div>
              <div style="width: 1px; height: 40px; background: var(--border-subtle);"></div>
              <div>
                <div style="font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); text-transform: uppercase;">Line Scrap %</div>
                <div id="calc-scrap-pct" style="font-family: var(--font-mono); font-size: 22px; font-weight: bold; color: var(--color-emerald);">0.00%</div>
                <div id="calc-scrap-badge" class="badge badge-emerald">Optimal (<3.5%)</div>
              </div>
            </div>

            <!-- Row 4: Downtime Hours & Reason -->
            <div class="form-grid" style="margin-bottom: 20px;">
              <div class="form-group">
                <label class="form-label">Downtime Hours (Stoppages)</label>
                <input type="number" step="0.25" name="downtime_hours" class="form-input" value="0.0" min="0" max="12">
              </div>

              <div class="form-group">
                <label class="form-label">Primary Downtime Reason</label>
                <select name="downtime_reason" class="form-select">
                  <option value="None">None / Smooth continuous run</option>
                  <option value="Slug feeder / chute jam">Slug feeder / chute jam</option>
                  <option value="Print mandrel registration tuning">Print mandrel registration tuning</option>
                  <option value="Ink viscosity adjust">Ink viscosity adjust</option>
                  <option value="OPV coater doctor blade adjustment">OPV coater doctor blade adjustment</option>
                  <option value="Curing oven temperature stabilization">Curing oven temperature stabilization</option>
                  <option value="Washer nozzle clean">Washer nozzle clean</option>
                  <option value="Necker guide rail wiper change">Necker guide rail wiper change</option>
                  <option value="Scheduled line lubrication">Scheduled line lubrication</option>
                  <option value="Palletizer sensor cleaning">Palletizer sensor cleaning</option>
                  <option value="Electrical / Power utility trip">Electrical / Power utility trip</option>
                  <option value="Other">Other (Note in remarks)</option>
                </select>
              </div>
            </div>

            <!-- Row 5: Shift Supervisor -->
            <div class="form-group" style="margin-bottom: 28px;">
              <label class="form-label">Shift Supervisor / Line Lead</label>
              <select name="supervisor" class="form-select" required>
                <option value="Tariq Mahmood">Tariq Mahmood (Shift Lead)</option>
                <option value="M. Aslam">M. Aslam (Shift Lead)</option>
                <option value="Sikander">Sikander (Planning & Operations)</option>
                <option value="Production Manager">Production Manager</option>
              </select>
            </div>

            <!-- Submit Button -->
            <div style="display: flex; gap: 12px;">
              <button type="submit" class="btn btn-primary" style="flex: 1; padding: 14px; font-size: 15px;">
                💾 Record Finished Shift Production
              </button>
              <button type="reset" class="btn btn-secondary" onclick="resetShiftCalculations()">
                Clear
              </button>
            </div>

          </form>
        </div>
      </div>

      <!-- Floor Shift History Table -->
      <div class="panel" style="margin-top: 24px;">
        <div class="panel-header">
          <div class="panel-title">
            <span>Floor Shift History Log</span>
            <small>Single-Stage Verification • Final Saleable Cans Counted at Packing Stage</small>
          </div>
          <span class="badge badge-steel">${(data.shifts || []).length} Logged Shifts</span>
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
              ${(data.shifts || []).length === 0 ? `
                <tr>
                  <td colspan="8" style="text-align:center; padding: 36px 16px; color: var(--text-dim);">
                    <div style="font-size: 28px; margin-bottom: 6px;">🏭</div>
                    <div style="font-weight: 600; color: var(--text-main); font-size: 14px; margin-bottom: 4px;">No floor shifts logged yet</div>
                    <div style="font-size: 12px; color: var(--text-muted); max-width: 440px; margin: 0 auto;">Plant is configured in pre-production readiness mode. Floor entries logged via the form above will be recorded here immediately.</div>
                  </td>
                </tr>
              ` : (data.shifts || []).map(s => {
                const badgeStyle = s.scrap_pct >= 5.0 ? 'badge-red' : (s.scrap_pct >= 3.5 ? 'badge-amber' : 'badge-emerald');
                const shiftPill = s.shift_type === 'Day' ? '<span class="badge badge-amber">DAY</span>' : '<span class="badge badge-steel">NIGHT</span>';
                return `
                  <tr>
                    <td>
                      <div style="font-weight: 600;">${formatDate(s.shift_date)}</div>
                      <div>${shiftPill}</div>
                    </td>
                    <td>
                      <div style="font-weight: 600; color: var(--color-amber);">${s.pof_number || 'POF-' + s.pof_id}</div>
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
                    <td style="color: var(--text-main); font-weight: 500;">${s.supervisor}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}

function selectShift(type) {
  selectedShiftType = type;
  const buttons = document.querySelectorAll('.shift-btn');
  buttons.forEach(b => {
    if (b.textContent.includes(type.toUpperCase())) {
      b.classList.add('active');
    } else {
      b.classList.remove('active');
    }
  });
}

function handlePofChange(selectElem) {
  const opt = selectElem.selectedOptions[0];
  const metaBox = document.getElementById('pof-meta-box');
  const hiddenSize = document.getElementById('input-product-size');

  if (opt && opt.value) {
    const size = opt.getAttribute('data-size') || '45x160mm';
    const customer = opt.getAttribute('data-customer') || '';
    const rem = opt.getAttribute('data-rem') || '0';

    hiddenSize.value = size;
    document.getElementById('selected-size-label').textContent = size;
    document.getElementById('selected-customer-label').textContent = customer;
    document.getElementById('selected-rem-label').textContent = formatNumber(rem);
    metaBox.style.display = 'block';
  } else {
    metaBox.style.display = 'none';
  }
}

function recalcShiftMetrics() {
  const good = parseInt(document.getElementById('input-good-cans').value) || 0;
  const scrap = parseInt(document.getElementById('input-line-scrap').value) || 0;
  const total = good + scrap;

  const totalElem = document.getElementById('calc-total-run');
  const scrapPctElem = document.getElementById('calc-scrap-pct');
  const badgeElem = document.getElementById('calc-scrap-badge');

  totalElem.textContent = formatNumber(total);

  if (total > 0) {
    const pct = ((scrap / total) * 100).toFixed(2);
    scrapPctElem.textContent = `${pct}%`;

    if (pct >= 5.0) {
      scrapPctElem.style.color = 'var(--color-danger)';
      badgeElem.className = 'badge badge-red';
      badgeElem.textContent = 'Critical High (>=5.0%)';
    } else if (pct >= 3.5) {
      scrapPctElem.style.color = 'var(--color-amber)';
      badgeElem.className = 'badge badge-amber';
      badgeElem.textContent = 'Attention (>=3.5%)';
    } else {
      scrapPctElem.style.color = 'var(--color-emerald)';
      badgeElem.className = 'badge badge-emerald';
      badgeElem.textContent = 'Optimal (<3.5%)';
    }
  } else {
    scrapPctElem.textContent = '0.00%';
    scrapPctElem.style.color = 'var(--color-emerald)';
    badgeElem.className = 'badge badge-emerald';
    badgeElem.textContent = 'Optimal (<3.5%)';
  }
}

function resetShiftCalculations() {
  setTimeout(() => {
    recalcShiftMetrics();
    document.getElementById('pof-meta-box').style.display = 'none';
  }, 50);
}

async function handleShiftSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const submitBtn = form.querySelector('button[type="submit"]');

  const goodCans = parseInt(form.good_cans.value) || 0;
  const lineScrap = parseInt(form.line_scrap.value) || 0;

  if (goodCans === 0 && lineScrap === 0) {
    showToast('Please enter production quantities.', 'red');
    return;
  }

  const payload = {
    shift_date: form.shift_date.value,
    shift_type: selectedShiftType,
    pof_id: parseInt(form.pof_id.value),
    product_size: form.product_size.value,
    good_cans: goodCans,
    line_scrap: lineScrap,
    downtime_hours: parseFloat(form.downtime_hours.value) || 0.0,
    downtime_reason: form.downtime_reason.value,
    supervisor: form.supervisor.value
  };

  // Prevent double submissions
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Recording Shift...';
  }

  try {
    // Check if online
    if (navigator.onLine) {
      try {
        const res = await fetch('/api/shifts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await res.json();
        if (res.ok && result.success) {
          showToast(`Shift logged: ${formatNumber(goodCans)} good cans recorded!`, 'emerald');
          form.reset();
          resetShiftCalculations();
          await fetchProductionData();
          window.location.hash = '#dashboard';
          return;
        } else {
          // Explicit server rejection (HTTP 4xx/5xx) — show error, DO NOT queue in IndexedDB
          showToast(`Shift rejected: ${result.error || 'Server rejected entry'}`, 'red');
          return;
        }
      } catch (netErr) {
        console.warn('API post network failure, falling back to IndexedDB:', netErr);
        // Fall through to offline queue ONLY on true network exception
      }
    }

    // Fallback to offline IndexedDB
    await savePendingShift(payload);

    // Update local preview state in memory for immediate UI responsiveness
    const pof = (AppState.data?.orders || []).find(o => String(o.id) === String(payload.pof_id));
    const totalRun = payload.good_cans + payload.line_scrap;
    const scrapPct = totalRun > 0 ? parseFloat(((payload.line_scrap / totalRun) * 100).toFixed(2)) : 0.0;
    const clientShift = {
      id: Date.now(),
      ...payload,
      total_cans: totalRun,
      scrap_pct: scrapPct,
      pof_number: pof ? pof.pof_number : `POF-${payload.pof_id}`,
      customer_name: pof ? pof.customer_name : 'Alpha Customer',
      created_at: new Date().toISOString()
    };
    if (!AppState.data.shifts) AppState.data.shifts = [];
    AppState.data.shifts.unshift(clientShift);
    if (AppState.data.kpis) {
      AppState.data.kpis.today_output_cans = (AppState.data.kpis.today_output_cans || 0) + payload.good_cans;
      AppState.data.kpis.today_scrap_cans = (AppState.data.kpis.today_scrap_cans || 0) + payload.line_scrap;
      const todayTotal = AppState.data.kpis.today_output_cans + AppState.data.kpis.today_scrap_cans;
      AppState.data.kpis.today_scrap_pct = todayTotal > 0 ? parseFloat(((AppState.data.kpis.today_scrap_cans / todayTotal) * 100).toFixed(2)) : 0.0;
      AppState.data.kpis.mtd_output_cans = (AppState.data.kpis.mtd_output_cans || 0) + payload.good_cans;
      AppState.data.kpis.mtd_scrap_cans = (AppState.data.kpis.mtd_scrap_cans || 0) + payload.line_scrap;
      const mtdTotal = AppState.data.kpis.mtd_output_cans + AppState.data.kpis.mtd_scrap_cans;
      AppState.data.kpis.mtd_scrap_pct = mtdTotal > 0 ? parseFloat(((AppState.data.kpis.mtd_scrap_cans / mtdTotal) * 100).toFixed(2)) : 0.0;
      AppState.data.kpis.downtime_hours_mtd = parseFloat(((AppState.data.kpis.downtime_hours_mtd || 0) + payload.downtime_hours).toFixed(2));
    }
    if (pof) {
      pof.produced_good = (pof.produced_good || 0) + payload.good_cans;
      pof.produced_scrap = (pof.produced_scrap || 0) + payload.line_scrap;
      pof.total_line_run = pof.produced_good + pof.produced_scrap;
      pof.remaining_qty = Math.max(0, pof.order_qty - pof.produced_good);
      pof.completion_pct = parseFloat(((pof.produced_good / pof.order_qty) * 100).toFixed(1));
    }
    window.dispatchEvent(new CustomEvent('app:state-changed', { detail: AppState.data }));

    showToast(`Saved offline in IndexedDB (${formatNumber(goodCans)} cans). Will sync when online.`, 'amber');
    form.reset();
    resetShiftCalculations();
    window.location.hash = '#dashboard';
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = '💾 Record Finished Shift Production';
    }
  }
}
