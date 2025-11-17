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
// Addition and subtraction settings remain unchanged
export const LEVELS = [
  { addMax: 20,  subMax: 15,  addCarryP: 0.00, subBorrowP: 0.00 },
  { addMax: 50,  subMax: 40,  addCarryP: 0.25, subBorrowP: 0.05 },
  { addMax: 80,  subMax: 65,  addCarryP: 0.45, subBorrowP: 0.15 },
  { addMax: 120, subMax: 100, addCarryP: 0.65, subBorrowP: 0.25 },
  { addMax: 150, subMax: 120, addCarryP: 0.75, subBorrowP: 0.35 },
  { addMax: 200, subMax: 160, addCarryP: 0.85, subBorrowP: 0.45 }
];

// Multiplication difficulty per level (new level-based rules)
export const MULTIPLICATION_LEVELS = [
  // Level 1: Factor1: 1-3, Factor2: 1-5 or 10 (5 and 10 not allowed as Factor1)
  { factor1Min: 1, factor1Max: 3, factor2Min: 1, factor2Max: 5, factor2Extra: [10], factor1Exclude: [5, 10] },
  // Level 2: Factor1: 1-4, Factor2: 1-6 or 10 (5 and 10 not allowed as Factor1)
  { factor1Min: 1, factor1Max: 4, factor2Min: 1, factor2Max: 6, factor2Extra: [10], factor1Exclude: [5, 10] },
  // Level 3: Factor1: 1-5, Factor2: 1-7 or 10 (10 not allowed as Factor1)
  { factor1Min: 1, factor1Max: 5, factor2Min: 1, factor2Max: 7, factor2Extra: [10], factor1Exclude: [10] },
  // Level 4: Factor1: 1-7, Factor2: 1-8
  { factor1Min: 1, factor1Max: 7, factor2Min: 1, factor2Max: 8, factor2Extra: [], factor1Exclude: [] },
  // Level 5: Factor1: 1-10, Factor2: 1-10
  { factor1Min: 1, factor1Max: 10, factor2Min: 1, factor2Max: 10, factor2Extra: [], factor1Exclude: [] },
  // Level 6: Factor1: 1-11, Factor2: 1-11
  { factor1Min: 1, factor1Max: 11, factor2Min: 1, factor2Max: 11, factor2Extra: [], factor1Exclude: [] }
];

// Division difficulty per level (new level-based rules)
// Each level is cumulative (includes all previous level tasks)
// Quotient must be 1-10 for levels 1-5, 1-12 for level 6
export const DIVISION_LEVELS = [
  // Level 1: Simple divisions within 1-10
  { divisorMin: 1, divisorMax: 10, dividendMin: 1, dividendMax: 10, quotientMin: 1, quotientMax: 10 },
  // Level 2: Level 1 + divisions by 10 (dividend 10-100)
  { divisorMin: 1, divisorMax: 10, dividendMin: 1, dividendMax: 100, quotientMin: 1, quotientMax: 10 },
  // Level 3: Level 1-2 + divisor 1-4, dividend up to 50
  { divisorMin: 1, divisorMax: 10, dividendMin: 1, dividendMax: 50, quotientMin: 1, quotientMax: 10 },
  // Level 4: Level 1-3 + divisor 1-6, dividend up to 80
  { divisorMin: 1, divisorMax: 10, dividendMin: 1, dividendMax: 80, quotientMin: 1, quotientMax: 10 },
  // Level 5: Level 1-4 + divisor 1-10, dividend up to 100
  { divisorMin: 1, divisorMax: 10, dividendMin: 1, dividendMax: 100, quotientMin: 1, quotientMax: 10 },
  // Level 6: Level 1-5 + harder tasks (divisor 1-144, quotient 1-12)
  { divisorMin: 1, divisorMax: 144, dividendMin: 1, dividendMax: 1728, quotientMin: 1, quotientMax: 12 }
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
export const PAW_PULSE_INTENSITY = 2.0; // Scale multiplier for pulse animation (1.0 = no pulse, 2.0 = 100% larger)
