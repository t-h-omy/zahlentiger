// === service-worker.js ===
// Handles offline caching and automatic version update detection for Zahlentiger.

const VERSION_URL = './VERSION.txt'; // must exist in repo root
const CACHE_PREFIX = 'zahlentiger-cache';
let CACHE_NAME = `${CACHE_PREFIX}-init`;

const CORE_ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './js/main.js',
  './manifest.json',
  './assets/icons/icon_192.png',
  './assets/icons/icon_512.png',
];

// --- Helper: fetch version from VERSION.txt ---
async function fetchRemoteVersion() {
  try {
    const response = await fetch(VERSION_URL, { cache: 'no-cache' });
    if (!response.ok) throw new Error('VERSION.txt not reachable');
    return (await response.text()).trim();
  } catch (err) {
    console.warn('[SW] Version check failed:', err);
    return null;
  }
}

// --- Install phase: cache core files ---
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const version = await fetchRemoteVersion();
    if (version) CACHE_NAME = `${CACHE_PREFIX}-${version}`;
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(CORE_ASSETS);
    console.log('[SW] Installed:', CACHE_NAME);
  })());
  self.skipWaiting();
});

// --- Activate phase: delete old caches ---
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const version = await fetchRemoteVersion();
    if (version) CACHE_NAME = `${CACHE_PREFIX}-${version}`;
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter(k => k.startsWith(CACHE_PREFIX) && k !== CACHE_NAME)
        .map(k => {
          console.log('[SW] Deleting old cache:', k);
          return caches.delete(k);
        })
    );
    await self.clients.claim();
    console.log('[SW] Active cache:', CACHE_NAME);
  })());
});

// --- Fetch phase: serve from cache first ---
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

// --- Message handler: check version & notify clients ---
self.addEventListener('message', async event => {
  if (!event.data) return;
  if (event.data.type === 'CHECK_VERSION') {
    const remoteVersion = await fetchRemoteVersion();
    if (remoteVersion) {
      event.source.postMessage({ type: 'VERSION', version: remoteVersion });
    }
  }
});
