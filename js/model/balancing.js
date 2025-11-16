// === model/balancing.js ===
// Central tuning values for difficulty, probabilities, streaks and effects.
// This is where you tweak the "feel" of the game without touching logic.

export const MAX_STREAK = 10;

// Level-up display duration (ms)
export const LEVEL_UP_DISPLAY_DURATION = 7000; // Increased from 5200ms for better visibility

export const LEVEL_NAMES = [
  "Mathe-Welpe",
  "Zahlen-Fuchs",
  "Rechen-Tiger",
  "Operations-Löwe",
  "Mathe-Drache",
  "Rechen-Zauberer"
];

export const LEVEL_ICONS = ["🐶", "🦊", "🐯", "🦁", "🐉", "🧙‍♂️"];

// Difficulty per level (taken 1:1 from your original game.js)
export const LEVELS = [
  { addMax: 20,  subMax: 15,  mulMax: 3,  addCarryP: 0.00, subBorrowP: 0.00 },
  { addMax: 50,  subMax: 40,  mulMax: 4,  addCarryP: 0.25, subBorrowP: 0.05 },
  { addMax: 80,  subMax: 65,  mulMax: 5,  addCarryP: 0.45, subBorrowP: 0.15 },
  { addMax: 120, subMax: 100, mulMax: 7,  addCarryP: 0.65, subBorrowP: 0.25 },
  { addMax: 150, subMax: 120, mulMax: 9,  addCarryP: 0.75, subBorrowP: 0.35 },
  { addMax: 200, subMax: 160, mulMax: 10, addCarryP: 0.85, subBorrowP: 0.45 }
];

// Global type weights – used by the generator for all levels
export const TYPE_WEIGHTS = { add: 0.35, sub: 0.35, mul: 0.30 };

// Streak badge thresholds and colors
export const BADGE_THRESHOLDS = {
  SUPER: 4,
  MEGA: 8
};

export const STREAK_COLORS = {
  normal: "#F7A11B",    // Tiger-Orange - normal active
  green: "#F7A11B",     // Tiger-Orange - normal active (alias)
  purple: "#C47CFF",    // Purple - Mega-Streak (chainCount >= 8)
  blue:   "#4CAF50",    // Green - Super-Streak (chainCount >= 4)
  orange: "#4FA8FF"     // Blue - frozen/rescue mode (will transition in CSS)
};

export const BADGE_COLORS = {
  rescue: "#ff8800"
};

// Confetti colors – same as original
export const CONFETTI_COLORS = [
  "#ff3838","#ff9f1a","#ffd32a",
  "#32ff7e","#7efff5","#18dcff",
  "#7d5fff","#ea2027","#ffffff"
];

// Vibration intensities (ms)
export const VIBRATION = {
  CONFETTI: 300,
  WRONG: 60
};

// New paw pulse animation config
export const PAW_PULSE_INTENSITY = 12.5; // Scale multiplier for pulse animation (1.0 = no pulse, 1.15 = 15% larger)
