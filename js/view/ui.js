// === view/ui.js ===
// Pure DOM updates: segments, badges, task text, level labels, version info, iOS focus helper.

import {
  LEVEL_NAMES,
  LEVEL_ICONS,
  BADGE_THRESHOLDS,
  STREAK_COLORS,
  BADGE_COLORS,
  LEVEL_UP_DISPLAY_DURATION
} from "../model/balancing.js";
import { gameState } from "../model/state.js";

// --- Display app version from VERSION.txt ---
export async function updateVersionDisplay() {
  const el = document.getElementById("appVersion");
  if (!el) return;
  try {
    const res = await fetch("./VERSION.txt", { cache: "no-store" });
    if (!res.ok) throw new Error("VERSION.txt not found");
    const version = (await res.text()).trim();
    el.textContent = "v" + version;
  } catch (err) {
    console.warn("[UI] Version info unavailable:", err);
    el.textContent = "Dev-Version";
  }
}

// --- iOS Keyboard Focus Helper ---
export function focusInputIOS() {
  const input = document.getElementById("eingabe");
  if (!input) return;

  const ua = navigator.userAgent || navigator.vendor || window.opera;
  const isiOS = /iPad|iPhone|iPod/.test(ua);

  if (isiOS) {
    // Trick: short-lived invisible input to unlock keyboard focus
    const tmp = document.createElement("input");
    tmp.style.position = "absolute";
    tmp.style.opacity = 0;
    tmp.style.height = 0;
    tmp.style.width = 0;
    tmp.style.border = "none";
    document.body.appendChild(tmp);
    tmp.focus();
    setTimeout(() => {
      tmp.remove();
      input.focus();
    }, 50);
  } else {
    input.focus();
  }
}

// --- Segments / progress bar ---
export function updateSegments() {
  for (let i = 0; i < 10; i++) {
    const seg = document.getElementById("seg" + i);
    if (!seg) continue;
    seg.style.backgroundImage = "url('./assets/icons/paw_grey_256.png')";
    seg.style.opacity = "0.6";
  }

  for (let i = 0; i < gameState.streak; i++) {
    const colorKey = gameState.streakColors[i] || "normal";
    const seg = document.getElementById("seg" + i);
    if (!seg) continue;

    let pawIcon = "";
    if (colorKey === "purple") {
      pawIcon = "url('./assets/icons/paw_purple_256.png')";
    } else if (colorKey === "blue") {
      pawIcon = "url('./assets/icons/paw_green_256.png')"; // Super-Streak uses green paw
    } else if (colorKey === "orange") {
      pawIcon = "url('./assets/icons/paw_blue_256.png')"; // Frozen/Rescue uses blue paw
    } else {
      pawIcon = "url('./assets/icons/paw_orange_256.png')"; // Normal active uses orange paw
    }

    seg.style.backgroundImage = pawIcon;
    seg.style.opacity = "1";
  }

  document.getElementById("levelName").textContent =
    LEVEL_NAMES[gameState.levelIndex];
  document.getElementById("levelIcon").textContent =
    LEVEL_ICONS[gameState.levelIndex];
}

// --- Badges ---
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

// --- Badge blink animation ---
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

// --- Task display ---
export function setTaskText(text) {
  const el = document.getElementById("aufgabe");
  if (el) el.textContent = text;
}

// --- Input & feedback handling ---
export function resetInputAndFeedback(blockFocus) {
  const input = document.getElementById("eingabe");
  if (!input) return;

  input.value = "";
  if (!blockFocus) {
    focusInputIOS(); // 🔧 now uses iOS-safe focus
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

// --- Level-up flash ---
export function showLevelUpFlash(newLevelName) {
  const flash = document.getElementById("levelUpFlash");
  if (!flash) return;
  flash.textContent = "Neues Level: " + newLevelName;
  flash.style.display = "block";
  setTimeout(() => {
    flash.style.display = "none";
  }, LEVEL_UP_DISPLAY_DURATION - 1000); // Hide slightly before next task
}
