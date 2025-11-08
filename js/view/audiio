// === view/audio.js ===
// Web Audio based sound engine for reward/fail/level-up tones and mute toggle.

import { gameState } from "../model/state.js";

const AudioCtx = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioCtx();

function playNote(freq, offset, duration, type = "sine", volume = 0.18) {
  if (gameState.muted) return;

  const startTime = audioCtx.currentTime + (offset || 0);
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = type;
  osc.frequency.value = freq;

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + (duration || 0.2));

  osc.start(startTime);
  osc.stop(startTime + (duration || 0.2) + 0.03);
}

export function playRewardSound() {
  playNote(523.25, 0.00, 0.20, "sine", 0.20);  // C5
  playNote(659.25, 0.15, 0.22, "sine", 0.20);  // E5
  playNote(783.99, 0.33, 0.24, "sine", 0.20);  // G5
}

export function playFailSound() {
  playNote(246.94, 0.00, 0.22, "triangle", 0.18); // B3
  playNote(207.65, 0.14, 0.22, "triangle", 0.16); // G#3
}

export function playLevelUpSound() {
  playNote(523.25, 0.00, 0.28, "sine", 0.22);    // C5
  playNote(783.99, 0.15, 0.30, "sine", 0.22);    // G5
  playNote(1046.50, 0.35, 0.40, "sine", 0.22);   // C6
}

export function toggleMute(buttonElement) {
  gameState.muted = !gameState.muted;
  if (buttonElement) {
    buttonElement.textContent = gameState.muted ? "🔇 Ton an" : "🔊 Ton aus";
  }
}
