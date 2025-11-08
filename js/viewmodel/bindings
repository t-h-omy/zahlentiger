// === viewmodel/bindings.js ===
// Wires DOM events (buttons, inputs) to the GameEngine and view layer.

import { checkAnswer } from "./gameEngine.js";
import { toggleMute } from "../view/audio.js";

export function setupBindings() {
  const checkBtn = document.getElementById("checkBtn");
  const input = document.getElementById("eingabe");
  const muteBtn = document.getElementById("muteBtn");

  if (checkBtn) {
    checkBtn.onclick = () => checkAnswer();
  }

  if (input) {
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") checkAnswer();
    });
  }

  if (muteBtn) {
    muteBtn.onclick = () => toggleMute(muteBtn);
  }
}
