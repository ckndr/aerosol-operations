/**
 * Alpha Aerosols (Kot Abdul Malik) — Progressive Web App Service Worker
 * Anti-Tubex Safe Lifecycle:
 * - Cache-First for static assets (HTML, CSS, JS)
 * - Network-First for dynamic production data (production.json, API routes)
 * - No aggressive self.skipWaiting() forcing unprompted reloads
 */

const CACHE_NAME = 'alpha-aerosols-v2.0.0';
const STATIC_ASSETS = [
  './',
  './aerosol.html',
  './index.html',
  './css/app.css',
  './logo_dark.png',
  './logo_light.png',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './js/state.js',
  './js/router.js',
  './js/components/dashboard.js',
  './js/components/orders.js',
  './js/components/shift_entry.js',
  './js/components/inventory.js',
  './js/components/dispatches.js',
  './js/components/simulator.js',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Dynamic Data Routes: Network-First (with cache fallback when offline)
  if (url.pathname.endsWith('production.json') || url.pathname.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && event.request.method === 'GET') {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Static Assets: Cache-First
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          event.request.method === 'GET'
        ) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      });
    })
  );
});

// User-prompted update listener
self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
