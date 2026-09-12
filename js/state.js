/**
 * Alpha Aerosols (Kot Abdul Malik) — Central Reactive State & Offline Engine
 * Single-stage tracking, IndexedDB resilience, Dynamic ISO-8601 Temporal Model
 */

const DEFAULT_PRE_PRODUCTION_DATA = {
  meta: {
    plant_name: "Alpha Aerosols",
    location: "Kot Abdul Malik, Punjab, Pakistan",
    as_of_date: "2026-09-12",
    version: "2.0.0",
    status: "Pre-Production Readiness"
  },
  kpis: {
    today_output_cans: 0,
    today_scrap_cans: 0,
    today_scrap_pct: 0.0,
    mtd_output_cans: 0,
    mtd_scrap_cans: 0,
    mtd_scrap_pct: 0.0,
    today_dispatches_cans: 0,
    today_dispatches_count: 0,
    active_pofs_count: 1,
    downtime_hours_mtd: 0.0
  },
  orders: [
    {
      id: 1,
      pof_number: "POF-2026-001",
      customer_name: "Aerosol Customer",
      product_name: "Aerosol Container 45x160mm",
      product_size: "45x160mm",
      order_qty: 100000,
      tolerance_pct: 0.05,
      order_date: "2026-09-12",
      due_date: "2026-10-15",
      status: "In Production",
      artwork_ref: "AC-CAN-160-REV1",
      notes: "Inaugural pre-production commercial run. Monobloc aluminum container 45x160mm.",
      created_at: "2026-09-12T08:00:00",
      produced_good: 0,
      produced_scrap: 0,
      total_line_run: 0,
      dispatched_total: 0,
      min_acceptable_qty: 95000,
      max_acceptable_qty: 105000,
      completion_pct: 0.0,
      remaining_qty: 100000,
      order_scrap_pct: 0.0,
      is_within_tolerance: false
    }
  ],
  shifts: [
    {
      id: 1,
      shift_date: "2026-09-12",
      shift_type: "Day",
      pof_id: 1,
      pof_number: "POF-2026-001",
      customer_name: "Aerosol Customer",
      product_name: "Aerosol Container 45x160mm",
      product_size: "45x160mm",
      good_cans: 0,
      line_scrap: 0,
      total_cans: 0,
      scrap_pct: 0.0,
      downtime_hours: 0.0,
      downtime_reason: "Pre-production tooling readiness",
      supervisor: "Tariq Mahmood",
      created_at: "2026-09-12T08:00:00"
    }
  ],
  dispatches: [
    {
      id: 1,
      challan_number: "DC-2026-001",
      dispatch_date: "2026-09-12",
      pof_id: 1,
      pof_number: "POF-2026-001",
      customer_name: "Aerosol Customer",
      product_name: "Aerosol Container 45x160mm",
      product_size: "45x160mm",
      dispatched_cans: 0,
      carton_count: 0,
      pallet_count: 0,
      vehicle_number: "Line 1 - Pre-Production",
      driver_name: "Pending Assignment",
      receiver_party: "Aerosol Customer",
      status: "Scheduled",
      created_at: "2026-09-12T08:00:00"
    }
  ],
  downtime_pareto: [],
  inventory: [
    { item_code: "501", category: "Aluminum Slugs", item_name: "45mm Aluminum Slug (Al99.7%)", uom: "kg", balance_qty: 25000.0, min_stock_level: 5000.0, batch_number: "SLUG-2026-08A", received_date: "2026-08-15", shelf_life_days: 1080, storage_condition: "Ambient Dry Store (5°C - 30°C)", location: "Kot Abdul Malik Central Stores", daily_burn_rate: 0.0, days_of_stock: 999.0, is_climate_sensitive: false, stock_status: "Healthy", shelf_evaluation: { age_days: 28, remaining_days: 1052, status: "normal", label: "Fresh Stock", expiry_date: "2029-08-01" } },
    { item_code: "502", category: "Extrusion Lubricant", item_name: "SAPILUB LUBRIMET GR8", uom: "kg", balance_qty: 200.0, min_stock_level: 30.0, batch_number: "LUB-2026-04", received_date: "2026-08-15", shelf_life_days: 1080, storage_condition: "Ambient Dry Store (5°C - 30°C)", location: "Chemical Room Bay 1", daily_burn_rate: 0.0, days_of_stock: 999.0, is_climate_sensitive: false, stock_status: "Healthy", shelf_evaluation: { age_days: 28, remaining_days: 1052, status: "normal", label: "Fresh Stock", expiry_date: "2029-08-01" } },
    { item_code: "503", category: "Alkaline Cleaner", item_name: "SAPILUB ALULIQUID 13", uom: "kg", balance_qty: 1500.0, min_stock_level: 400.0, batch_number: "ALU-2026-03", received_date: "2026-08-15", shelf_life_days: 1080, storage_condition: "Ambient Chemical Bay (5°C - 35°C)", location: "Washer Chemical Storage", daily_burn_rate: 0.0, days_of_stock: 999.0, is_climate_sensitive: false, stock_status: "Healthy", shelf_evaluation: { age_days: 28, remaining_days: 1052, status: "normal", label: "Fresh Stock", expiry_date: "2029-08-01" } },
    { item_code: "504", category: "Internal Lacquer", item_name: "SCHEKOSOL INT PROT Gold (400 9 901)", uom: "kg", balance_qty: 1000.0, min_stock_level: 200.0, batch_number: "LAC-2026-G2", received_date: "2026-08-25", shelf_life_days: 240, storage_condition: "Air Conditioned (20°C - 25°C)", location: "Cold Room Rack A1", daily_burn_rate: 0.0, days_of_stock: 999.0, is_climate_sensitive: true, stock_status: "Healthy", shelf_evaluation: { age_days: 18, remaining_days: 222, status: "normal", label: "Fresh Stock", expiry_date: "2027-04-22" } },
    { item_code: "505", category: "Internal Lacquer", item_name: "SCHEKOSOL INT BEIGE (400 4 902)", uom: "kg", balance_qty: 500.0, min_stock_level: 150.0, batch_number: "LAC-2026-B2", received_date: "2026-08-25", shelf_life_days: 240, storage_condition: "Air Conditioned (20°C - 25°C)", location: "Cold Room Rack A2", daily_burn_rate: 0.0, days_of_stock: 999.0, is_climate_sensitive: true, stock_status: "Healthy", shelf_evaluation: { age_days: 18, remaining_days: 222, status: "normal", label: "Fresh Stock", expiry_date: "2027-04-22" } },
    { item_code: "506", category: "External Base Coat", item_name: "SCHEKOSOL WH BC (422 0 903)", uom: "kg", balance_qty: 1200.0, min_stock_level: 300.0, batch_number: "BC-2026-W3", received_date: "2026-08-28", shelf_life_days: 240, storage_condition: "Air Conditioned (20°C - 25°C)", location: "Cold Room Rack B1", daily_burn_rate: 0.0, days_of_stock: 999.0, is_climate_sensitive: true, stock_status: "Healthy", shelf_evaluation: { age_days: 15, remaining_days: 225, status: "normal", label: "Fresh Stock", expiry_date: "2027-04-25" } },
    { item_code: "507", category: "External Base Coat", item_name: "SCHEKOSOL CLEAR BC (422 9 918)", uom: "kg", balance_qty: 400.0, min_stock_level: 150.0, batch_number: "BC-2026-C2", received_date: "2026-08-28", shelf_life_days: 180, storage_condition: "Air Conditioned (20°C - 25°C)", location: "Cold Room Rack B2", daily_burn_rate: 0.0, days_of_stock: 999.0, is_climate_sensitive: true, stock_status: "Healthy", shelf_evaluation: { age_days: 15, remaining_days: 165, status: "normal", label: "Fresh Stock", expiry_date: "2027-02-24" } },
    { item_code: "508", category: "Overprint Varnish", item_name: "SCHEKOSOL OPV GLOSSY (422 9 900)", uom: "kg", balance_qty: 800.0, min_stock_level: 200.0, batch_number: "OPV-2026-G4", received_date: "2026-09-01", shelf_life_days: 180, storage_condition: "Air Conditioned (20°C - 25°C)", location: "Cold Room Rack C1", daily_burn_rate: 0.0, days_of_stock: 999.0, is_climate_sensitive: true, stock_status: "Healthy", shelf_evaluation: { age_days: 11, remaining_days: 169, status: "normal", label: "Fresh Stock", expiry_date: "2027-02-28" } },
    { item_code: "509", category: "Overprint Varnish", item_name: "SCHEKOSOL OPV SILKMATT (422 9 903)", uom: "kg", balance_qty: 350.0, min_stock_level: 150.0, batch_number: "OPV-2026-S2", received_date: "2026-09-01", shelf_life_days: 180, storage_condition: "Air Conditioned (20°C - 25°C)", location: "Cold Room Rack C2", daily_burn_rate: 0.0, days_of_stock: 999.0, is_climate_sensitive: true, stock_status: "Healthy", shelf_evaluation: { age_days: 11, remaining_days: 169, status: "normal", label: "Fresh Stock", expiry_date: "2027-02-28" } },
    { item_code: "510", category: "Printing Ink", item_name: "SunAltec MB PLUS 169766 Opaque White", uom: "kg", balance_qty: 100.0, min_stock_level: 20.0, batch_number: "INK-2026-OW", received_date: "2026-08-15", shelf_life_days: 1080, storage_condition: "Ambient Dry Store (15°C - 30°C)", location: "Ink Dispensing Station", daily_burn_rate: 0.0, days_of_stock: 999.0, is_climate_sensitive: false, stock_status: "Healthy", shelf_evaluation: { age_days: 28, remaining_days: 1052, status: "normal", label: "Fresh Stock", expiry_date: "2029-08-01" } },
    { item_code: "599", category: "Printing Ink", item_name: "SunAltec MB PLUS 168391 Yellow G/S", uom: "kg", balance_qty: 50.0, min_stock_level: 15.0, batch_number: "INK-2026-Y1", received_date: "2026-08-15", shelf_life_days: 1080, storage_condition: "Ambient Dry Store (15°C - 30°C)", location: "Ink Dispensing Station", daily_burn_rate: 0.0, days_of_stock: 999.0, is_climate_sensitive: false, stock_status: "Healthy", shelf_evaluation: { age_days: 28, remaining_days: 1052, status: "normal", label: "Fresh Stock", expiry_date: "2029-08-01" } },
    { item_code: "600", category: "Printing Ink", item_name: "SunAltec MB PLUS 168396 Magenta", uom: "kg", balance_qty: 50.0, min_stock_level: 15.0, batch_number: "INK-2026-M1", received_date: "2026-08-15", shelf_life_days: 1080, storage_condition: "Ambient Dry Store (15°C - 30°C)", location: "Ink Dispensing Station", daily_burn_rate: 0.0, days_of_stock: 999.0, is_climate_sensitive: false, stock_status: "Healthy", shelf_evaluation: { age_days: 28, remaining_days: 1052, status: "normal", label: "Fresh Stock", expiry_date: "2029-08-01" } },
    { item_code: "601", category: "Printing Ink", item_name: "SunAltec MB PLUS 168404 Black Conc.", uom: "kg", balance_qty: 60.0, min_stock_level: 15.0, batch_number: "INK-2026-BK", received_date: "2026-08-15", shelf_life_days: 1080, storage_condition: "Ambient Dry Store (15°C - 30°C)", location: "Ink Dispensing Station", daily_burn_rate: 0.0, days_of_stock: 999.0, is_climate_sensitive: false, stock_status: "Healthy", shelf_evaluation: { age_days: 28, remaining_days: 1052, status: "normal", label: "Fresh Stock", expiry_date: "2029-08-01" } },
    { item_code: "603", category: "Printing Ink", item_name: "SunAltec MB PLUS 168402 Reflex Blue", uom: "kg", balance_qty: 50.0, min_stock_level: 15.0, batch_number: "INK-2026-RB", received_date: "2026-08-15", shelf_life_days: 1080, storage_condition: "Ambient Dry Store (15°C - 30°C)", location: "Ink Dispensing Station", daily_burn_rate: 0.0, days_of_stock: 999.0, is_climate_sensitive: false, stock_status: "Healthy", shelf_evaluation: { age_days: 28, remaining_days: 1052, status: "normal", label: "Fresh Stock", expiry_date: "2029-08-01" } }
  ]
};

const AppState = {
  data: DEFAULT_PRE_PRODUCTION_DATA,
  isOnline: navigator.onLine,
  pendingShiftsCount: 0,
  currentTheme: localStorage.getItem('alpha_theme') || 'dark'
};

// IndexedDB configuration for offline floor logging resilience
const IDB_NAME = 'AlphaAerosolsOfflineDB';
const IDB_VERSION = 1;
const IDB_STORE = 'pending_shifts';

function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, IDB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE, { keyPath: 'client_uuid' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function getPendingShifts() {
  try {
    const db = await openIndexedDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const store = tx.objectStore(IDB_STORE);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB read error:', err);
    return [];
  }
}

async function savePendingShift(shiftPayload) {
  const db = await openIndexedDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readwrite');
    const store = tx.objectStore(IDB_STORE);
    shiftPayload.client_uuid = 'shift_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    shiftPayload.queued_at = new Date().toISOString();
    const req = store.put(shiftPayload);
    req.onsuccess = () => {
      updatePendingCount();
      resolve(shiftPayload.client_uuid);
    };
    req.onerror = () => reject(req.error);
  });
}

async function removePendingShift(uuid) {
  const db = await openIndexedDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readwrite');
    const store = tx.objectStore(IDB_STORE);
    const req = store.delete(uuid);
    req.onsuccess = () => {
      updatePendingCount();
      resolve();
    };
    req.onerror = () => reject(req.error);
  });
}

async function updatePendingCount() {
  const pending = await getPendingShifts();
  AppState.pendingShiftsCount = pending.length;
  const badge = document.getElementById('offline-queue-badge');
  if (badge) {
    badge.textContent = `${AppState.pendingShiftsCount} queued`;
    badge.style.display = AppState.pendingShiftsCount > 0 ? 'inline-flex' : 'none';
  }
}

// Fetch dynamic production data (Decoupled UI & Data)
async function fetchProductionData() {
  try {
    // Try Network-First
    let res;
    try {
      res = await fetch('./data/production.json', { cache: 'no-cache' });
    } catch (e) {
      // Fallback to API if available
      res = await fetch('/api/data', { cache: 'no-cache' });
    }

    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status}`);
    }
    const data = await res.json();
    AppState.data = data;
    window.dispatchEvent(new CustomEvent('app:state-changed', { detail: data }));
    return data;
  } catch (err) {
    console.warn('Network fetch unavailable, using pre-production baseline data state:', err);
    if (AppState.data) {
      window.dispatchEvent(new CustomEvent('app:state-changed', { detail: AppState.data }));
    }
    return AppState.data;
  }
}

// Replay offline shifts when online
async function syncPendingShifts() {
  if (!navigator.onLine) return;
  const pending = await getPendingShifts();
  if (pending.length === 0) return;

  showToast(`Syncing ${pending.length} offline shift log(s)...`, 'amber');
  for (const shift of pending) {
    try {
      const res = await fetch('/api/shifts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shift)
      });
      if (res.ok) {
        await removePendingShift(shift.client_uuid);
      } else if (res.status >= 400 && res.status < 500) {
        // Permanent rejection from server (e.g. invalid data or constraints) — drop to avoid infinite loop
        console.error('Queued shift permanently rejected by server:', shift.client_uuid, res.status);
        await removePendingShift(shift.client_uuid);
        showToast(`Offline shift rejected by server (${res.status}). Removed from queue.`, 'red');
      }
    } catch (e) {
      console.warn('Shift sync network error for item:', shift.client_uuid, e);
    }
  }
  await updatePendingCount();
  await fetchProductionData();
  showToast('Offline shift sync completed.', 'emerald');
}

// Dynamic ISO-8601 Temporal Model Helpers
function formatDate(isoStr) {
  if (!isoStr) return '—';
  try {
    const parts = isoStr.split('T')[0].split('-');
    if (parts.length === 3) {
      const d = new Date(Date.UTC(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])));
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
    }
    return isoStr;
  } catch (e) {
    return isoStr;
  }
}

function formatNumber(num, decimals = 0) {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return Number(num).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

function showToast(message, type = 'amber', duration = 4000) {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Network status listeners
window.addEventListener('online', () => {
  AppState.isOnline = true;
  document.getElementById('connection-status-dot')?.classList.remove('amber');
  document.getElementById('connection-status-dot')?.classList.add('emerald');
  document.getElementById('connection-status-text').textContent = 'Online';
  showToast('Connection restored. Syncing operational data...', 'emerald');
  syncPendingShifts();
});

window.addEventListener('offline', () => {
  AppState.isOnline = false;
  document.getElementById('connection-status-dot')?.classList.remove('emerald');
  document.getElementById('connection-status-dot')?.classList.add('amber');
  document.getElementById('connection-status-text').textContent = 'Offline (Floor Cache Active)';
  showToast('Operating in Offline Mode. Shifts will be queued in IndexedDB.', 'amber');
});

// Theme and Logo Sync
function updateLogoTheme(theme) {
  const logos = document.querySelectorAll('#header-logo');
  logos.forEach(img => {
    img.src = theme === 'light' ? './logo_light.png' : './logo_dark.png';
  });
}

// Theme toggle
function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const target = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', target);
  localStorage.setItem('alpha_theme', target);
  const label = document.getElementById('theme-toggle-label');
  if (label) label.textContent = target === 'dark' ? 'Graphite Dark' : 'Daylight White';
  updateLogoTheme(target);
}

// Initialize theme on start
document.documentElement.setAttribute('data-theme', AppState.currentTheme);
window.addEventListener('DOMContentLoaded', () => {
  updatePendingCount();
  updateLogoTheme(AppState.currentTheme);
  const label = document.getElementById('theme-toggle-label');
  if (label) label.textContent = AppState.currentTheme === 'dark' ? 'Graphite Dark' : 'Daylight White';
});

// Explicit global exports for inline event handlers and component modules
if (typeof window !== 'undefined') {
  window.AppState = AppState;
  window.formatDate = formatDate;
  window.formatNumber = formatNumber;
  window.showToast = showToast;
  window.syncPendingShifts = syncPendingShifts;
  window.toggleTheme = toggleTheme;
  window.fetchProductionData = fetchProductionData;
}
