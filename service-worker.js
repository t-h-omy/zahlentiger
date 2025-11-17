// === service-worker.js ===
// Handles offline caching and automatic version update detection.

const CACHE_NAME = 'zahlentiger-cache-v5';
const CORE_ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './js/main.js',
  './manifest.json',
  // 🐯 All icon sizes for offline splash and install screens
  './assets/icons/icon_48.png',
  './assets/icons/icon_72.png',
  './assets/icons/icon_96.png',
  './assets/icons/icon_128.png',
  './assets/icons/icon_144.png',
  './assets/icons/icon_152.png',
  './assets/icons/icon_180.png',
  './assets/icons/icon_192.png',
  './assets/icons/icon_256.png',
  './assets/icons/icon_384.png',
  './assets/icons/icon_512.png',
  // 🐾 Progress bar paw icons (256x256 versions)
  './assets/icons/paw_grey_256.png',
  './assets/icons/paw_orange_256.png',
  './assets/icons/paw_green_256.png',
  './assets/icons/paw_blue_256.png',
  './assets/icons/paw_purple_256.png'
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
    }).then(() => self.clients.claim())
  );
});
// Fetch phase – network-first for HTML/CSS/JS, cache-first for other assets
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Network-first strategy for HTML, CSS, and JS to ensure updates
  if (event.request.destination === 'document' || 
      event.request.destination === 'style' ||
      event.request.destination === 'script' ||
      url.pathname.endsWith('.html') || 
      url.pathname.endsWith('.css') ||
      url.pathname.endsWith('.js')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache the new version
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Fall back to cache if network fails
          return caches.match(event.request);
        })
    );
  } else {
    // Cache-first for other assets (images, icons)
    event.respondWith(
      caches.match(event.request).then(response => response || fetch(event.request))
    );
  }
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
