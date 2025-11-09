// === service-worker.js ===
// Handles offline caching and automatic version update detection.

const CACHE_NAME = 'zahlentiger-cache-v1';
const CORE_ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './js/main.js',
  './manifest.json',
  './assets/icons/icon_192.png',
  './assets/icons/icon_512.png',
];

// Install phase – cache all core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

// Activate phase – cleanup old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

// Fetch phase – serve from cache, then network fallback
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

// === Version check (for update notification) ===
self.addEventListener('message', async event => {
  if (event.data && event.data.type === 'CHECK_VERSION') {
    try {
      const response = await fetch('./VERSION.txt', { cache: 'no-store' });
      const remoteVersion = (await response.text()).trim();
      event.source.postMessage({ type: 'VERSION', version: remoteVersion });
    } catch (err) {
      console.error('Version check failed:', err);
    }
  }
});
