// === sw-register.js ===
// Registers the Service Worker and handles version checking & update banner.
// UI text in German; comments in English.

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./service-worker.js')
    .then(reg => {
      console.log('[SW-Register] Service Worker registriert:', reg.scope);

      // Periodic version check every 60 seconds
      setInterval(async () => {
        const sw = await navigator.serviceWorker.ready;
        sw.active.postMessage({ type: 'CHECK_VERSION' });
      }, 60000);

      // Listen for version messages from the Service Worker
      navigator.serviceWorker.addEventListener('message', e => {
        if (e.data?.type === 'VERSION') {
          const stored = localStorage.getItem('appVersion') || '0';
          const remote = e.data.version;
          if (remote !== stored) {
            localStorage.setItem('appVersion', remote);
            showUpdateBanner(remote);
          }
        }
      });
    })
    .catch(err => console.error('[SW-Register] Registrierung fehlgeschlagen:', err));
}

// --- Show update banner ---
function showUpdateBanner(version) {
  let banner = document.getElementById('updateBanner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'updateBanner';
    banner.style.position = 'fixed';
    banner.style.bottom = '20px';
    banner.style.left = '50%';
    banner.style.transform = 'translateX(-50%)';
    banner.style.background = '#ffcc00';
    banner.style.color = '#000';
    banner.style.padding = '15px 25px';
    banner.style.borderRadius = '10px';
    banner.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
    banner.style.fontSize = '18px';
    banner.style.zIndex = '9999';
    banner.style.cursor = 'pointer';
    banner.textContent = `Neue Version ${version} verfügbar – Jetzt aktualisieren`;
    banner.onclick = () => {
      banner.remove();
      location.reload(true);
    };
    document.body.appendChild(banner);
  } else {
    banner.style.display = 'block';
  }
}
