// === view/effects.js ===
// Confetti engine, vibration and mascot animation.

import { CONFETTI_COLORS, VIBRATION, LEVEL_ICONS } from "../model/balancing.js";
import { gameState } from "../model/state.js";

const confettiCanvas = document.getElementById("confetti-canvas");
const ctx = confettiCanvas.getContext("2d");

let confettiParticles = [];
let confettiAnimating = false;

// Resize canvas to full viewport
function resizeCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function vibrate(duration) {
  if (navigator.vibrate) {
    navigator.vibrate(duration);
  }
}

function spawnFountain(count, heightScale = 1) {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight * 0.65; // Moved up from bottom to encouragement text position

  for (let i = 0; i < count; i++) {
    const angle = -Math.PI / 2 + (Math.random() * 0.6 - 0.3);
    const speed = 9 + Math.random() * 5;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed * heightScale;

    confettiParticles.push({
      x: cx + (Math.random() * 90 - 45),
      y: cy - 2,
      vx,
      vy,
      g: 0.38 + Math.random() * 0.28,
      rot: Math.random() * Math.PI * 2,
      rv: Math.random() * 0.25 - 0.125,
      w: 5 + Math.random() * 6,
      h: (5 + Math.random() * 6) * (0.7 + Math.random() * 0.6),
      life: 0,
      max: 90 + Math.random() * 30,
      col: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]
    });
  }

  vibrate(VIBRATION.CONFETTI);
  if (!confettiAnimating) {
    confettiAnimating = true;
    requestAnimationFrame(confettiLoop);
  }
}

function spawnRain(durationMs, density = 12) {
  const endTime = performance.now() + durationMs;
  vibrate(VIBRATION.CONFETTI);

  (function tick() {
    if (performance.now() > endTime) return;

    for (let i = 0; i < density; i++) {
      confettiParticles.push({
        x: Math.random() * window.innerWidth,
        y: -10,
        vx: Math.random() * 1 - 0.5,
        vy: 3 + Math.random() * 2,
        g: 0,
        rot: Math.random() * Math.PI * 2,
        rv: Math.random() * 0.2,
        w: 5 + Math.random() * 6,
        h: (5 + Math.random() * 6) * (0.7 + Math.random() * 0.6),
        life: 0,
        max: window.innerHeight / 3,
        col: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]
      });
    }

    setTimeout(tick, 40);
    if (!confettiAnimating) {
      confettiAnimating = true;
      requestAnimationFrame(confettiLoop);
    }
  })();
}

function confettiLoop() {
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  const alive = [];
  for (const p of confettiParticles) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.g * 0.2;
    p.rot += p.rv;
    p.life++;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = Math.max(0, 1 - p.life / p.max);
    ctx.fillStyle = p.col;
    ctx.fillRect(-p.w * 0.5, -p.h * 0.5, p.w, p.h);
    ctx.restore();

    if (p.life < p.max && p.y < confettiCanvas.height + 60) {
      alive.push(p);
    }
  }

  confettiParticles = alive;
  if (confettiParticles.length > 0) {
    requestAnimationFrame(confettiLoop);
  } else {
    confettiAnimating = false;
  }
}

// Public wrappers – used by GameEngine
export function confettiSuper() {
  spawnFountain(35, 1.0);
}

export function confettiMega() {
  spawnFountain(55, 1.0);
}

export function confettiLevelUp() {
  spawnRain(5000, 12);
}

// Mascot animation: jump overlay with next level icon
export function showMascotJump(iconIndex) {
  const overlay = document.getElementById("mascotOverlay");
  const m = document.getElementById("mascot");
  const icon = LEVEL_ICONS[Math.min(iconIndex, LEVEL_ICONS.length - 1)];

  if (!overlay || !m) return;

  m.textContent = icon;
  overlay.style.display = "flex";
  m.classList.remove("mascotJump");
  // Force reflow to restart CSS animation
  void m.offsetWidth;
  m.classList.add("mascotJump");

  setTimeout(() => {
    overlay.style.display = "none";
  }, 1550);
}
