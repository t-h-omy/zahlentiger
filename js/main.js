// === main.js ===
// Application entry point: initialize bindings and game state.

import { setupBindings } from "./viewmodel/bindings.js";
import { initGame } from "./viewmodel/gameEngine.js";
import { updateVersionDisplay } from "./view/ui.js";
import { PAW_PULSE_INTENSITY } from "./model/balancing.js";

// Initialize CSS custom properties from balancing config
document.documentElement.style.setProperty("--paw-pulse-scale", PAW_PULSE_INTENSITY);

updateVersionDisplay();

// Start game immediately
setupBindings();
initGame();
