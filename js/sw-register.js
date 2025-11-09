// === sw-register.js ===
// Registers the service worker and handles update notifications.
// UI text is in German.

(async () => {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Worker nicht unterstützt.');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('./service-worker.js');
    console.log('Service Worker registriert:', registration.scope);

    // Listen for messages from service worker (e.g., new version)
    navigator.serviceWorker.addEventListener('message', event => {
      if (event.data?.type === 'VERSION') {
        const remoteVersion = event.data.version;
        checkLocalVersion(remoteVersion);
      }
    });

    // Request version check after registration
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'CHECK_VERSION' });
    }

  } catch (err) {
    console.error('Fehler bei der Registrierung des Service Workers:', err);
  }

  // --- Compare version & show update banner ---
  async function checkLocalVersion(remoteVersion) {
    try {
      const response = await fetch('./VERSION.txt', { cache: 'no-store' });
      const localVersion = (await response.text()).trim();

      if (remoteVersion && remoteVersion !== localVersion) {
        showUpdateBanner(remoteVersion);
      }
    } catch (err) {
      console.warn('Versionsvergleich fehlgeschlagen:', err);
    }
  }

  // --- Show update banner (German UI text) ---
  function showUpdateBanner(version) {
    const banner = document.createElement('div');
    banner.textContent = `Neue Version ${version} verfügbar – Jetzt aktualisieren`;
    banner.style.position = 'fixed';
    banner.style.bottom = '20px';
    banner.style.left = '50%';
    banner.style.transform = 'translateX(-50%)';
    banner.style.background = '#222';
    banner.style.color = '#fff';
    banner.style.padding = '10px 20px';
    banner.style.borderRadius = '8px';
    banner.style.cursor = 'pointer';
    banner.style.zIndex = '1000';
    banner.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
    banner.onclick = () => {
      banner.remove();
      location.reload(true);
    };
    document.body.appendChild(banner);
  }
})();
