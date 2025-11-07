// ✅ Version der installierten App
const APP_VERSION = "v1.1.0";

// ✅ Name des aktiven Caches (Version inkludiert)
const CACHE_NAME = `zahlentiger-cache-${APP_VERSION}`;

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

// ✅ INSTALL – Dateien cachen
self.addEventListener("install", event => {
  console.log(`📦 Installiere Service Worker ${APP_VERSION}`);

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );

  self.skipWaiting(); // SW sofort aktiv machen
});

// ✅ ACTIVATE – Alte Caches löschen
self.addEventListener("activate", event => {
  console.log("🧹 Lösche alte Caches…");

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

// ✅ FETCH – Cache first
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return (
        cached ||
        fetch(event.request).catch(() => {
          // Optional: Offline-Fallback
        })
      );
    })
  );
});

// ✅ COMMUNICATION – Browser informieren, dass neue Version bereit ist
self.addEventListener("message", event => {
  if (event.data === "skipWaiting") {
    console.log("⏩ SkipWaiting ausgelöst");
    self.skipWaiting();
  }
});
