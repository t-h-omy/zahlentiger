// === view/ui.js ===
// Pure DOM updates: segments, badges, task text, level labels.

import {
  LEVEL_NAMES,
  LEVEL_ICONS,
  BADGE_THRESHOLDS,
  STREAK_COLORS,
  BADGE_COLORS
} from "../model/balancing.js";
import { gameState } from "../model/state.js";

export function updateSegments() {
  // Reset all segments to neutral
  for (let i = 0; i < 10; i++) {
    const seg = document.getElementById("seg" + i);
    if (!seg) continue;
    seg.style.background = "#ccc";
  }

  // Color segments based on stored streak colors
  for (let i = 0; i < gameState.streak; i++) {
    const colorKey = gameState.streakColors[i] || "normal";
    const seg = document.getElementById("seg" + i);
    if (!seg) continue;

    const color =
      colorKey === "purple" ? STREAK_COLORS.purple :
      colorKey === "blue"   ? STREAK_COLORS.blue   :
      colorKey === "orange" ? STREAK_COLORS.orange :
      STREAK_COLORS.normal;

    seg.style.background = color;
  }

  // Level label and icon
  document.getElementById("levelName").textContent =
    LEVEL_NAMES[gameState.levelIndex];
  document.getElementById("levelIcon").textContent =
    LEVEL_ICONS[gameState.levelIndex];
}

export function updateBadge() {
  const badge = document.getElementById("statusBadge");
  badge.innerHTML = "";

  if (gameState.rescueMode) {
    badge.innerHTML =
      `<span class="badge badge-rescue rescuePulse">⚠️ Rette deinen Streak!</span>`;
    return;
  }

  if (gameState.chainCount >= BADGE_THRESHOLDS.MEGA) {
    badge.innerHTML = `<span class="badge badge-mega">MEGA-STREAK! 🚀</span>`;
  } else if (gameState.chainCount >= BADGE_THRESHOLDS.SUPER) {
    badge.innerHTML = `<span class="badge badge-super">SUPER-STREAK! 🔥</span>`;
  }
}

export function triggerBadgeBlink(kind) {
  const badge = document.querySelector("#statusBadge .badge");
  if (!badge) return;

  if (kind === "mega" && !gameState.megaBadgeBlinked) {
    badge.classList.add("blink");
    gameState.megaBadgeBlinked = true;
    setTimeout(() => badge.classList.remove("blink"), 1100);
  } else if (kind === "super" && !gameState.superBadgeBlinked) {
    badge.classList.add("blink");
    gameState.superBadgeBlinked = true;
    setTimeout(() => badge.classList.remove("blink"), 1100);
  }
}

export function setTaskText(text) {
  const el = document.getElementById("aufgabe");
  if (el) el.textContent = text;
}

export function resetInputAndFeedback(blockFocus) {
  const input = document.getElementById("eingabe");
  if (!input) return;

  input.value = "";
  if (!blockFocus) {
    input.focus();
    input.select();
  }

  const fb = document.getElementById("feedback");
  if (fb) {
    fb.textContent = "";
    fb.className = "";
  }
}

export function setFeedback(text, className) {
  const fb = document.getElementById("feedback");
  if (!fb) return;
  fb.textContent = text;
  fb.className = className || "";
}

export function showLevelUpFlash(newLevelName) {
  const flash = document.getElementById("levelUpFlash");
  if (!flash) return;
  flash.textContent = "Neues Level: " + newLevelName;
  flash.style.display = "block";
  setTimeout(() => {
    flash.style.display = "none";
  }, 4000);
}
