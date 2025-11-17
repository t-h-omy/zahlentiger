// === main.js ===
// Application entry point: initialize bindings and game state.

import { setupBindings } from "./viewmodel/bindings.js";
import { initGame } from "./viewmodel/gameEngine.js";
import { updateVersionDisplay } from "./view/ui.js";
import { PAW_PULSE_INTENSITY } from "./model/balancing.js";
import { setAppMode, APP_MODE } from "./model/appState.js";
import { selectedOperations, toggleOperation, hasActiveOperation } from "./model/operations.js";

// Initialize CSS custom properties from balancing config
document.documentElement.style.setProperty("--paw-pulse-scale", PAW_PULSE_INTENSITY);

updateVersionDisplay();

// Start in menu mode
setAppMode(APP_MODE.MENU);

// Set up operation toggle buttons
const operationButtons = document.querySelectorAll(".operation-btn");
operationButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const operation = btn.dataset.operation;
    toggleOperation(operation);
    
    // Update button visual state
    const isActive = selectedOperations[operation];
    btn.dataset.active = isActive.toString();
  });
});

// Set up Start Game button
const startGameBtn = document.getElementById("startGameBtn");
if (startGameBtn) {
  startGameBtn.onclick = () => {
    // Ensure at least one operation is selected
    if (!hasActiveOperation()) {
      alert("Bitte wähle mindestens eine Rechenart aus!");
      return;
    }
    
    setAppMode(APP_MODE.GAME);
    // Initialize game only when user starts
    setupBindings();
    initGame();
  };
}
