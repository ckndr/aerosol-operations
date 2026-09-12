/**
 * Component: Raw Material Inventory Ledger (Alpha Aerosols)
 * Real-time stock balances, chemical shelf-life countdowns, AC safeguards, and days-of-stock cover
 */

function renderInventory(data) {
  const container = document.getElementById('view-inventory');
  if (!container) return;

  const inventory = data.inventory || [];

  // Summary counts
  const criticalItems = inventory.filter(i => i.shelf_evaluation && i.shelf_evaluation.status === 'critical');
  const warningItems = inventory.filter(i => i.shelf_evaluation && i.shelf_evaluation.status === 'warning');
  const acSensitiveItems = inventory.filter(i => i.is_climate_sensitive);

  container.innerHTML = `
    <!-- Top Shelf-Life & Climate Safeguard Banner -->
    ${(criticalItems.length > 0 || warningItems.length > 0) ? `
      <div class="panel" style="border-left: 4px solid var(--color-amber); background: rgba(245, 158, 11, 0.05); margin-bottom: 20px;">
        <div class="panel-body" style="padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span class="status-dot red"></span>
            <div>
              <strong style="color: var(--color-amber);">Chemical Shelf-Life Safeguard Alert:</strong>
              <span>${criticalItems.length} critical batch(es) (>=150 days) and ${warningItems.length} warning batch(es) (>=120 days) require first-in, first-out (FIFO) consumption.</span>
            </div>
          </div>
          <div style="font-family: var(--font-mono); font-size: 11px; color: var(--text-dim);">
            Schekosol Coating Specs: 180-day shelf life at 20°C–25°C
          </div>
        </div>
      </div>
    ` : ''}

    <div class="panel">
      <div class="panel-header">
        <div class="panel-title">
          <span>Raw Material Inventory Ledger</span>
          <small>Physical Stock Balances, Days-of-Stock Cover & Chemical Countdown</small>
        </div>
        <div style="display: flex; gap: 8px;">
          <span class="badge badge-emerald">${inventory.length} SKUs Tracked</span>
          <span class="badge badge-steel">${acSensitiveItems.length} AC-Climate Safeguarded</span>
        </div>
      </div>

      <div class="panel-body" style="padding-bottom: 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 12px;">
          <div style="display: flex; gap: 6px; flex-wrap: wrap;">
            <button class="btn btn-secondary active" onclick="filterInventory('all', this)">All Items (${inventory.length})</button>
            <button class="btn btn-secondary" onclick="filterInventory('Aluminum Slugs', this)">Slugs</button>
            <button class="btn btn-secondary" onclick="filterInventory('coatings', this)">Coatings (Schekosol)</button>
            <button class="btn btn-secondary" onclick="filterInventory('Printing Ink', this)">Inks</button>
            <button class="btn btn-secondary" onclick="filterInventory('alerts', this)">⚠️ Shelf-Life Alerts (${criticalItems.length + warningItems.length})</button>
          </div>
          <div style="font-family: var(--font-mono); font-size: 11px; color: var(--text-dim);">
            Warehouse: Kot Abdul Malik Central Stores
          </div>
        </div>
      </div>

      <div class="table-responsive">
        <table class="data-table" id="inventory-table">
          <thead>
            <tr>
              <th>Item Code</th>
              <th>Material Name & Description</th>
              <th>Category</th>
              <th class="num">Live Balance</th>
              <th class="num">Daily Burn</th>
              <th class="num">Stock Cover</th>
              <th>Batch # & Rec. Date</th>
              <th>Shelf-Life Age / Expiry</th>
              <th>Shelf-Life Status</th>
              <th>Storage Safeguard</th>
            </tr>
          </thead>
          <tbody>
            ${inventory.length === 0 ? '<tr><td colspan="10" style="text-align: center; padding: 24px;">No inventory records found.</td></tr>' : inventory.map(item => {
              const shelf = item.shelf_evaluation || {};
              const shelfBadgeClass = shelf.status === 'critical' ? 'badge-red' : (shelf.status === 'warning' ? 'badge-amber' : 'badge-emerald');
              const coverDays = item.days_of_stock;
              const coverColor = coverDays < 7 ? 'var(--color-danger)' : (coverDays < 15 ? 'var(--color-amber)' : 'var(--color-emerald)');
              const isCoating = item.category.includes('Lacquer') || item.category.includes('Base Coat') || item.category.includes('Varnish');

              return `
                <tr data-category="${item.category}" data-shelf="${shelf.status || 'normal'}" data-iscoating="${isCoating}">
                  <td><strong style="font-family: var(--font-mono); color: var(--color-amber);">${item.item_code}</strong></td>
                  <td>
                    <div style="font-weight: 600;">${item.item_name}</div>
                    <div style="font-size: 10px; color: var(--text-dim);">${item.location}</div>
                  </td>
                  <td><span class="badge badge-steel">${item.category}</span></td>
                  <td class="num" style="font-weight: bold; font-size: 14px;">
                    ${formatNumber(item.balance_qty, 1)} <small style="font-weight: normal; color: var(--text-muted); font-size: 11px;">${item.uom}</small>
                  </td>
                  <td class="num" style="color: var(--text-muted);">${formatNumber(item.daily_burn_rate, 1)} ${item.uom}/d</td>
                  <td class="num">
                    <strong style="color: ${coverColor}; font-family: var(--font-mono); font-size: 13px;">
                      ${coverDays >= 900 ? '> 1 Year' : coverDays + ' days'}
                    </strong>
                  </td>
                  <td>
                    <div style="font-family: var(--font-mono); font-size: 11px;">${item.batch_number || 'BATCH-STD'}</div>
                    <div style="font-size: 10px; color: var(--text-dim);">Rec: ${formatDate(item.received_date)}</div>
                  </td>
                  <td>
                    <div style="font-family: var(--font-mono); font-size: 11px;">${shelf.age_days}d old / ${shelf.remaining_days}d left</div>
                    <div style="font-size: 10px; color: var(--text-dim);">Exp: ${formatDate(shelf.expiry_date)}</div>
                  </td>
                  <td>
                    <span class="badge ${shelfBadgeClass}">${shelf.label || 'Fresh'}</span>
                  </td>
                  <td>
                    ${item.is_climate_sensitive ? `
                      <span class="badge badge-amber" title="Schekosol coating requires air conditioning to prevent premature curing.">
                        ❄ AC 20°C–25°C
                      </span>
                    ` : `
                      <span class="badge badge-steel" style="font-size: 10px;">Ambient Dry Store</span>
                    `}
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

function filterInventory(filter, btnElement) {
  const buttons = btnElement.parentElement.querySelectorAll('.btn');
  buttons.forEach(b => b.classList.remove('active'));
  btnElement.classList.add('active');

  const rows = document.querySelectorAll('#inventory-table tbody tr');
  rows.forEach(r => {
    if (filter === 'all') {
      r.style.display = '';
    } else if (filter === 'coatings') {
      r.style.display = r.getAttribute('data-iscoating') === 'true' ? '' : 'none';
    } else if (filter === 'alerts') {
      const shelfStatus = r.getAttribute('data-shelf');
      r.style.display = (shelfStatus === 'warning' || shelfStatus === 'critical') ? '' : 'none';
    } else {
      r.style.display = r.getAttribute('data-category') === filter ? '' : 'none';
    }
  });
}
