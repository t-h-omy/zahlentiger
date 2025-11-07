
/* === service-worker.js – Offline Cache für Zahlentiger === */

const CACHE_NAME = "zahlentiger-cache-v1";

const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./game.js",
  "./manifest.json",
  "./icon_192.png",
  "./icon_256.png",
  "./icon_384.png",
  "./icon_512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
