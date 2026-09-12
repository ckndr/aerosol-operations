/**
 * Component: Finished Goods Dispatches (Alpha Aerosols)
 * Manages delivery challans, carton counts, pallet logs, vehicle tracking, and customer handoffs
 */

function renderDispatches(data) {
  const container = document.getElementById('view-dispatches');
  if (!container) return;

  const dispatches = data.dispatches || [];
  const totalDispatched = dispatches.reduce((acc, d) => acc + (d.dispatched_cans || 0), 0);
  const totalPallets = dispatches.reduce((acc, d) => acc + (d.pallet_count || 0), 0);

  container.innerHTML = `
    <div class="panel">
      <div class="panel-header">
        <div class="panel-title">
          <span>Finished Goods Dispatches & Delivery Challans</span>
          <small>Vehicle Gate Passes & Customer Handoff Log</small>
        </div>
        <button class="btn btn-primary" onclick="openNewDispatchModal()">+ Issue Delivery Challan</button>
      </div>

      <div class="panel-body" style="padding-bottom: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 12px;">
          <div style="display: flex; gap: 12px; align-items: center;">
            <div class="status-pill">
              <span class="status-dot emerald"></span>
              <span>Total Dispatched: <strong>${formatNumber(totalDispatched)} cans</strong></span>
            </div>
            <div class="status-pill">
              <span class="status-dot blue"></span>
              <span>Total Pallets: <strong>${formatNumber(totalPallets)}</strong></span>
            </div>
          </div>
          <div style="font-family: var(--font-mono); font-size: 11px; color: var(--text-dim);">
            Gate Pass Location: Kot Abdul Malik Factory Dispatch Bay
          </div>
        </div>
      </div>

      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Challan #</th>
              <th>Dispatch Date</th>
              <th>Customer & POF #</th>
              <th>Size Standard</th>
              <th class="num">Dispatched Cans</th>
              <th class="num">Carton Count</th>
              <th class="num">Pallet Count</th>
              <th>Vehicle #</th>
              <th>Driver</th>
              <th>Receiver Party</th>
              <th>Delivery Status</th>
            </tr>
          </thead>
          <tbody>
            ${dispatches.length === 0 ? `
              <tr>
                <td colspan="11" style="text-align:center; padding: 36px 16px; color: var(--text-dim);">
                  <div style="font-size: 28px; margin-bottom: 6px;">🚚</div>
                  <div style="font-weight: 600; color: var(--text-main); font-size: 14px; margin-bottom: 4px;">No dispatches issued yet</div>
                  <div style="font-size: 12px; color: var(--text-muted); max-width: 440px; margin: 0 auto;">Finished goods dispatches, delivery challans, and gate passes will appear here once production containers are palletized.</div>
                </td>
              </tr>
            ` : dispatches.map(d => {
              const statusClass = d.status === 'Delivered' ? 'badge-emerald' : 'badge-amber';
              return `
                <tr>
                  <td><strong style="font-family: var(--font-mono); color: var(--color-amber);">${d.challan_number}</strong></td>
                  <td>${formatDate(d.dispatch_date)}</td>
                  <td>
                    <div style="font-weight: 600;">${d.customer_name || d.receiver_party}</div>
                    <div style="font-size: 10px; color: var(--text-muted); font-family: var(--font-mono);">${d.pof_number}</div>
                  </td>
                  <td><span class="badge badge-steel">${d.product_size || '45x160mm'}</span></td>
                  <td class="num" style="font-weight: bold; color: var(--color-emerald); font-size: 14px;">${formatNumber(d.dispatched_cans)}</td>
                  <td class="num" style="font-family: var(--font-mono);">${formatNumber(d.carton_count)}</td>
                  <td class="num" style="font-family: var(--font-mono);">${formatNumber(d.pallet_count)}</td>
                  <td><strong style="font-family: var(--font-mono);">${d.vehicle_number}</strong></td>
                  <td style="color: var(--text-muted);">${d.driver_name || '—'}</td>
                  <td>${d.receiver_party}</td>
                  <td><span class="badge ${statusClass}">${d.status}</span></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function handleDispatchPofChange(selectElem) {
  const pofId = selectElem.value;
  const orders = (AppState.data && AppState.data.orders) || [];
  const ord = orders.find(o => String(o.id) === String(pofId));
  const receiverInput = document.querySelector('#modal-new-dispatch input[name="receiver_party"]');
  if (ord && receiverInput) {
    receiverInput.value = ord.customer_name;
  }
}

function openNewDispatchModal() {
  const modal = document.getElementById('modal-new-dispatch');
  if (modal) modal.classList.add('active');
  const dispSelect = document.getElementById('dispatch-pof-select');
  if (dispSelect && dispSelect.value) {
    handleDispatchPofChange(dispSelect);
  }
}

function closeNewDispatchModal() {
  const modal = document.getElementById('modal-new-dispatch');
  if (modal) modal.classList.remove('active');
}

async function submitNewDispatch(event) {
  event.preventDefault();
  const form = event.target;
  const payload = {
    challan_number: form.challan_number.value.trim(),
    dispatch_date: form.dispatch_date.value,
    pof_id: parseInt(form.pof_id.value),
    dispatched_cans: parseInt(form.dispatched_cans.value),
    carton_count: parseInt(form.carton_count.value),
    pallet_count: parseInt(form.pallet_count.value),
    vehicle_number: form.vehicle_number.value.trim(),
    receiver_party: form.receiver_party.value.trim(),
    driver_name: form.driver_name.value.trim()
  };

  try {
    const res = await fetch('/api/dispatches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    if (result.success) {
      showToast(`Challan ${payload.challan_number} logged successfully.`, 'emerald');
      closeNewDispatchModal();
      form.reset();
      await fetchProductionData();
    } else {
      showToast(`Error: ${result.error}`, 'red');
    }
  } catch (err) {
    showToast('Failed to record dispatch. Please check connection.', 'red');
  }
}
