/**
 * Client-side Hash Router for Alpha Aerosols Single Page Application (PWA)
 * Supports #dashboard, #orders, #entry, #inventory, #dispatches, #simulator
 */

const routes = {
  '#dashboard': { sectionId: 'view-dashboard', render: (data) => renderDashboard(data) },
  '#orders': { sectionId: 'view-orders', render: (data) => renderOrders(data) },
  '#entry': { sectionId: 'view-entry', render: (data) => renderShiftEntry(data) },
  '#inventory': { sectionId: 'view-inventory', render: (data) => renderInventory(data) },
  '#dispatches': { sectionId: 'view-dispatches', render: (data) => renderDispatches(data) },
  '#simulator': { sectionId: 'view-simulator', render: (data) => renderSimulator(data) }
};

let currentHash = '#dashboard';

function handleRoute() {
  const hash = window.location.hash || '#dashboard';
  const targetRoute = routes[hash] || routes['#dashboard'];
  currentHash = routes[hash] ? hash : '#dashboard';

  // Update Navigation Active State
  document.querySelectorAll('.nav-tab').forEach(tab => {
    if (tab.getAttribute('href') === currentHash) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  // Switch View Sections
  document.querySelectorAll('.view-section').forEach(sec => {
    sec.classList.remove('active');
  });

  const activeSection = document.getElementById(targetRoute.sectionId);
  if (activeSection) {
    activeSection.classList.add('active');
  }

  // Render Component if state data is loaded
  if (AppState.data) {
    targetRoute.render(AppState.data);
  }
}

// Re-render when central state changes
window.addEventListener('app:state-changed', (e) => {
  const targetRoute = routes[currentHash] || routes['#dashboard'];
  if (targetRoute && e.detail) {
    targetRoute.render(e.detail);
  }
});

window.addEventListener('hashchange', handleRoute);
window.addEventListener('DOMContentLoaded', async () => {
  // Render immediately with baseline / cached data so screen is never blank
  handleRoute();
  try {
    await fetchProductionData();
  } catch (err) {
    console.warn('Live fetch failed, active state retained:', err);
  }
});
