// === main.js ===
// Application entry point: initialize bindings and game state.

import { setupBindings } from "./viewmodel/bindings.js";
import { initGame } from "./viewmodel/gameEngine.js";

setupBindings();
initGame();
