/**
 * Component: Customer Orders & POF Tracker (Alpha Aerosols)
 * Manages customer sales orders, tolerance bounds, completion %, and Job Card exports
 */

function renderOrders(data) {
  const container = document.getElementById('view-orders');
  if (!container) return;

  const orders = data.orders || [];

  container.innerHTML = `
    <div class="panel">
      <div class="panel-header">
        <div class="panel-title">
          <span>Customer Production Orders & POF Tracker</span>
          <small>Enforcing ±5% Manufacturing Tolerance Bounds</small>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="btn btn-primary" onclick="openNewOrderModal()">+ Create New POF</button>
        </div>
      </div>

      <div class="panel-body" style="padding-bottom: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 12px;">
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-secondary active" onclick="filterOrders('all', this)">All Orders (${orders.length})</button>
            <button class="btn btn-secondary" onclick="filterOrders('In Production', this)">In Production</button>
            <button class="btn btn-secondary" onclick="filterOrders('Pending', this)">Pending</button>
            <button class="btn btn-secondary" onclick="filterOrders('Completed', this)">Completed</button>
          </div>
          <div style="font-family: var(--font-mono); font-size: 12px; color: var(--text-dim);">
            Active Standard: Monobloc Aluminum (45x160mm & 45x150mm)
          </div>
        </div>
      </div>

      <div class="table-responsive">
        <table class="data-table" id="orders-table">
          <thead>
            <tr>
              <th>POF #</th>
              <th>Customer & Product</th>
              <th>Size</th>
              <th class="num">Order Qty</th>
              <th>Tolerance Bounds (±5%)</th>
              <th class="num">Produced Good</th>
              <th style="min-width: 140px;">Completion %</th>
              <th class="num">Dispatched</th>
              <th>Due Date</th>
              <th>Status</th>
              <th style="text-align: center;">Artifacts & Actions</th>
            </tr>
          </thead>
          <tbody>
            ${orders.length === 0 ? '<tr><td colspan="11" style="text-align: center; padding: 24px;">No active orders found.</td></tr>' : orders.map(ord => {
              const statusBadge = ord.status === 'Completed' ? 'badge-emerald' : (ord.status === 'In Production' ? 'badge-amber' : 'badge-steel');
              const barClass = ord.completion_pct >= 100 ? 'emerald' : 'amber';
              return `
                <tr data-status="${ord.status}">
                  <td>
                    <strong style="font-family: var(--font-mono); color: var(--color-amber);">${ord.pof_number}</strong>
                    <div style="font-size: 10px; color: var(--text-dim);">${ord.artwork_ref || 'Proof Rev0'}</div>
                  </td>
                  <td>
                    <div style="font-weight: 600;">${ord.customer_name}</div>
                    <div style="font-size: 11px; color: var(--text-muted);">${ord.product_name}</div>
                  </td>
                  <td><span class="badge badge-steel">${ord.product_size}</span></td>
                  <td class="num" style="font-weight: 600;">${formatNumber(ord.order_qty)}</td>
                  <td>
                    <div style="font-family: var(--font-mono); font-size: 11px;">
                      <span style="color: var(--text-muted);">${formatNumber(ord.min_acceptable_qty)}</span>
                      <span style="color: var(--text-dim);"> to </span>
                      <span style="color: var(--text-muted);">${formatNumber(ord.max_acceptable_qty)}</span>
                    </div>
                    <div style="font-size: 10px; color: ${ord.is_within_tolerance ? 'var(--color-emerald)' : (ord.produced_good === 0 ? 'var(--color-amber)' : 'var(--text-dim)')}">
                      ${ord.is_within_tolerance ? '✓ Within Tolerance' : (ord.produced_good === 0 ? 'Ready to Produce' : (ord.produced_good < ord.min_acceptable_qty ? 'Under Tolerance' : 'Exceeded Max'))}
                    </div>
                  </td>
                  <td class="num" style="font-weight: bold; color: var(--color-emerald);">${formatNumber(ord.produced_good)}</td>
                  <td>
                    <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 11px; margin-bottom: 2px;">
                      <span>${ord.completion_pct}%</span>
                      <span style="color: var(--text-dim);">${formatNumber(ord.remaining_qty)} rem</span>
                    </div>
                    <div class="progress-bar-container">
                      <div class="progress-bar-fill ${barClass}" style="width: ${Math.min(100, ord.completion_pct)}%"></div>
                    </div>
                  </td>
                  <td class="num" style="color: var(--text-muted);">${formatNumber(ord.dispatched_total)}</td>
                  <td>
                    <div style="font-weight: 500;">${formatDate(ord.due_date)}</div>
                    <div style="font-size: 10px; color: var(--text-dim);">Rec: ${formatDate(ord.order_date)}</div>
                  </td>
                  <td><span class="badge ${statusBadge}">${ord.status}</span></td>
                  <td style="text-align: center; white-space: nowrap;">
                    <a href="/api/export/job-card/${ord.id}" target="_blank" class="btn btn-secondary" style="padding: 4px 8px; font-size: 11px;" title="Export Job Card Excel (openpyxl)">
                      📄 Job Card (.xlsx)
                    </a>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function filterOrders(status, btnElement) {
  const buttons = btnElement.parentElement.querySelectorAll('.btn');
  buttons.forEach(b => b.classList.remove('active'));
  btnElement.classList.add('active');

  const rows = document.querySelectorAll('#orders-table tbody tr');
  rows.forEach(r => {
    if (status === 'all' || r.getAttribute('data-status') === status) {
      r.style.display = '';
    } else {
      r.style.display = 'none';
    }
  });
}

function openNewOrderModal() {
  const modal = document.getElementById('modal-new-order');
  if (modal) modal.classList.add('active');
}

function closeNewOrderModal() {
  const modal = document.getElementById('modal-new-order');
  if (modal) modal.classList.remove('active');
}

async function submitNewOrder(event) {
  event.preventDefault();
  const form = event.target;
  const payload = {
    pof_number: form.pof_number.value.trim(),
    customer_name: form.customer_name.value.trim(),
    product_name: form.product_name.value.trim(),
    product_size: form.product_size.value,
    order_qty: parseInt(form.order_qty.value),
    tolerance_pct: parseFloat(form.tolerance_pct.value) / 100.0,
    order_date: form.order_date.value,
    due_date: form.due_date.value,
    artwork_ref: form.artwork_ref.value.trim(),
    notes: form.notes.value.trim()
  };

  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    if (result.success) {
      showToast(`POF ${payload.pof_number} created successfully.`, 'emerald');
      closeNewOrderModal();
      form.reset();
      await fetchProductionData();
    } else {
      showToast(`Error: ${result.error}`, 'red');
    }
  } catch (err) {
    console.warn('Backend API unavailable, recording order in local preview session:', err);
    const newId = (AppState.data?.orders?.length || 0) + 1;
    const minQty = Math.floor(payload.order_qty * (1.0 - payload.tolerance_pct));
    const maxQty = Math.ceil(payload.order_qty * (1.0 + payload.tolerance_pct));
    const newOrder = {
      id: newId,
      ...payload,
      status: 'In Production',
      produced_good: 0,
      produced_scrap: 0,
      total_line_run: 0,
      dispatched_total: 0,
      min_acceptable_qty: minQty,
      max_acceptable_qty: maxQty,
      completion_pct: 0.0,
      remaining_qty: payload.order_qty,
      order_scrap_pct: 0.0,
      is_within_tolerance: false,
      created_at: new Date().toISOString()
    };
    if (!AppState.data.orders) AppState.data.orders = [];
    AppState.data.orders.unshift(newOrder);
    if (AppState.data.kpis) {
      AppState.data.kpis.active_pofs_count = AppState.data.orders.filter(o => o.status === 'In Production' || o.status === 'Pending').length;
    }
    window.dispatchEvent(new CustomEvent('app:state-changed', { detail: AppState.data }));
    closeNewOrderModal();
    form.reset();
    showToast(`POF ${payload.pof_number} created in preview session. (Run local server for SQLite sync)`, 'amber');
  }
}
