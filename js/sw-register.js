// ✅ Service Worker mit Update-Erkennung registrieren

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {

        navigator.serviceWorker.register("./service-worker.js", { scope: "./" })
            .then(reg => {
                console.log("✅ Service Worker registriert:", reg);

                // Prüfen auf Updates
                reg.addEventListener("updatefound", () => {
                    const installing = reg.installing;

                    installing.addEventListener("statechange", () => {
                        if (installing.state === "installed") {
                            // Neue Version verfügbar?
                            if (navigator.serviceWorker.controller) {
                                console.log("🔄 Neue Version verfügbar!");

                                // Benachrichtigung im UI anzeigen
                                const banner = document.getElementById("updateBanner");
                                if (banner) banner.style.display = "block";
                            }
                        }
                    });
                });
            })
            .catch(err => console.error("❌ SW Fehler:", err));
    });
}

// ✅ Funktion aus UI, um neue Version zu aktivieren
function applyUpdate() {
    if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage("skipWaiting");
    }
    window.location.reload();
}
