// === view/audio.js ===
// Hybrid audio engine: file-based SFX with Web Audio fallback for reward/fail/level-up tones and mute toggle.

import { gameState } from "../model/state.js";

const AudioCtx = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioCtx();

// Audio file paths
const SOUND_FILES = {
  correct: "./assets/sounds/correct.mp3",
  incorrect: "./assets/sounds/incorrect.mp3",
  click: "./assets/sounds/click.mp3"
};

// Preloaded audio elements with resilient loading
const audioCache = {};

/**
 * Preload an audio file with error handling
 * Returns the Audio element if successful, null if failed
 */
function preloadAudio(key, path) {
  try {
    const audio = new Audio();
    audio.preload = "auto";
    audio.src = path;
    
    // Handle load errors gracefully
    audio.addEventListener('error', (e) => {
      console.debug(`[Audio] Could not load ${path} - will use fallback synthesized sound`);
      audioCache[key] = null;
    });
    
    // Successfully loaded
    audio.addEventListener('canplaythrough', () => {
      console.debug(`[Audio] Successfully loaded ${path}`);
    }, { once: true });
    
    return audio;
  } catch (err) {
    console.debug(`[Audio] Error preloading ${path}:`, err);
    return null;
  }
}

// Initialize audio cache
audioCache.correct = preloadAudio('correct', SOUND_FILES.correct);
audioCache.incorrect = preloadAudio('incorrect', SOUND_FILES.incorrect);
audioCache.click = preloadAudio('click', SOUND_FILES.click);

/**
 * Play a cached audio file with fallback to synthesized sound
 */
function playCachedAudio(key, fallbackFn) {
  if (gameState.muted) return;
  
  const audio = audioCache[key];
  if (audio && audio.readyState >= 2) {
    // Audio file is loaded and ready
    try {
      audio.currentTime = 0;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.debug(`[Audio] Play failed for ${key}, using fallback:`, err);
          if (fallbackFn) fallbackFn();
        });
      }
      return;
    } catch (err) {
      console.debug(`[Audio] Error playing ${key}, using fallback:`, err);
    }
  }
  
  // Fallback to synthesized sound
  if (fallbackFn) {
    fallbackFn();
  }
}

/**
 * Play a synthesized tone using Web Audio API
 */
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

/**
 * Synthesized reward sound (fallback)
 */
function playRewardSoundSynthesized() {
  playNote(523.25, 0.00, 0.20, "sine", 0.20);  // C5
  playNote(659.25, 0.15, 0.22, "sine", 0.20);  // E5
  playNote(783.99, 0.33, 0.24, "sine", 0.20);  // G5
}

/**
 * Synthesized fail sound (fallback)
 */
function playFailSoundSynthesized() {
  playNote(246.94, 0.00, 0.22, "triangle", 0.18); // B3
  playNote(207.65, 0.14, 0.22, "triangle", 0.16); // G#3
}

/**
 * Synthesized level-up sound (fallback)
 */
function playLevelUpSoundSynthesized() {
  playNote(523.25, 0.00, 0.28, "sine", 0.22);    // C5
  playNote(783.99, 0.15, 0.30, "sine", 0.22);    // G5
  playNote(1046.50, 0.35, 0.40, "sine", 0.22);   // C6
}

// Public API - maintains same signatures as before
export function playRewardSound() {
  playCachedAudio('correct', playRewardSoundSynthesized);
}

export function playFailSound() {
  playCachedAudio('incorrect', playFailSoundSynthesized);
}

export function playLevelUpSound() {
  // Level-up always uses synthesized sound (no file-based version yet)
  playLevelUpSoundSynthesized();
}

export function toggleMute(buttonElement) {
  gameState.muted = !gameState.muted;
  if (buttonElement) {
    buttonElement.textContent = gameState.muted ? "🔇 Ton an" : "🔊 Ton aus";
  }
}
