// === viewmodel/bindings.js ===
// Wires DOM events (buttons, inputs) to the GameEngine and view layer.

import { checkAnswer } from "./gameEngine.js";
import { toggleMute } from "../view/audio.js";
import { focusInputIOS } from "../view/ui.js";
import { openSettingsModal, closeSettingsModal } from "../view/modal.js";

export function setupBindings() {
  const checkBtn = document.getElementById("checkBtn");
  const input = document.getElementById("eingabe");
  const burgerMenuBtn = document.getElementById("burgerMenuBtn");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const modalOverlay = document.querySelector(".modal-overlay");
  const soundToggleBtn = document.getElementById("soundToggleBtn");

  if (checkBtn) {
    checkBtn.onclick = () => checkAnswer();
    checkBtn.ontouchstart = () => focusInputIOS(); // 👈 ensures keyboard opens on touch
  }

  if (input) {
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") checkAnswer();
    });
  }

  // Burger menu opens settings modal
  if (burgerMenuBtn) {
    burgerMenuBtn.onclick = () => openSettingsModal();
  }

  // Close modal via X button
  if (closeModalBtn) {
    closeModalBtn.onclick = () => closeSettingsModal();
  }

  // Close modal via overlay click
  if (modalOverlay) {
    modalOverlay.onclick = () => closeSettingsModal();
  }

  // Sound toggle button
  if (soundToggleBtn) {
    soundToggleBtn.onclick = () => toggleMute(soundToggleBtn);
  }
}
