// === viewmodel/bindings.js ===
// Wires DOM events (buttons, inputs) to the GameEngine and view layer.

import { checkAnswer } from "./gameEngine.js";
import { toggleMute } from "../view/audio.js";
import { focusInputIOS } from "../view/ui.js"; // 👈 added

export function setupBindings() {
  const checkBtn = document.getElementById("checkBtn");
  const input = document.getElementById("eingabe");
  const muteBtn = document.getElementById("muteBtn");

  if (checkBtn) {
    checkBtn.onclick = () => checkAnswer();
    checkBtn.ontouchstart = () => focusInputIOS(); // 👈 ensures keyboard opens on touch
  }

  if (input) {
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") checkAnswer();
    });
  }

  if (muteBtn) {
    muteBtn.onclick = () => toggleMute();
  }
}
