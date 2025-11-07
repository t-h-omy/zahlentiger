// Service Worker Registration

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("./service-worker.js", { scope: "./" })
            .then(reg => {
                console.log("✅ Service Worker registriert:", reg);

                reg.onupdatefound = () => {
                    console.log("🔄 Update gefunden");
                };
            })
            .catch(err => {
                console.error("❌ Service Worker Fehler:", err);
            });
    });
}
