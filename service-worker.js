// ✅ Versionierung für saubere Updates
const CACHE_NAME = "zahlentiger-v1";

// ✅ Dateien, die offline verfügbar sein sollen
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/styles.css",
  "./js/game.js",
  "./js/sw-register.js",
  "./assets/icons/icon_192.png",
  "./assets/icons/icon_256.png",
  "./assets/icons/icon_384.png",
  "./assets/icons/icon_512.png"
];

// ✅ Install – Dateien in Cache laden
self.addEventListener("install", event => {
  console.log("📦 Service Worker installiert");
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// ✅ Activate – alte Caches löschen
self.addEventListener("activate", event => {
  console.log("🧹 Alte Caches löschen…");
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log("❌ Lösche Cache:", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// ✅ Fetch – Cache First
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return (
        cached ||
        fetch(event.request).catch(() => {
          // Optional: Fallback-Seite / Fallback-Bild etc.
        })
      );
    })
  );
});
