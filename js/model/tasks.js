// === model/tasks.js ===
// Task generation: addition, subtraction, multiplication with carry/borrow tuning.

import { LEVELS, TYPE_WEIGHTS } from "./balancing.js";

function randInt(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

// Same weighted type pick as in your original game.js
function pickType() {
  const x = Math.random();
  if (x < TYPE_WEIGHTS.mul) return "mul";
  if (x < TYPE_WEIGHTS.mul + TYPE_WEIGHTS.sub) return "sub";
  return "add";
}

function genAddition(cfg) {
  const max = cfg.addMax;
  const wantCarry = Math.random() < cfg.addCarryP;

  for (let t = 0; t < 200; t++) {
    let a = randInt(0, max);
    let b = randInt(0, max - a);
    const carry = ((a % 10) + (b % 10)) >= 10;

    if (wantCarry && carry) return { text: `${a} + ${b}`, result: a + b };
    if (!wantCarry && !carry) return { text: `${a} + ${b}`, result: a + b };
  }

  // Fallback, same behavior as original
  let a = randInt(0, Math.floor(max / 2));
  let b = randInt(0, Math.min(max - a, Math.floor(max / 2)));
  return { text: `${a} + ${b}`, result: a + b };
}

function genSubtraction(cfg) {
  const max = cfg.subMax;
  const wantBorrow = Math.random() < cfg.subBorrowP;

  for (let t = 0; t < 200; t++) {
    let a = randInt(0, max);
    let b = randInt(0, a);
    const borrow = (a % 10) < (b % 10);

    if (wantBorrow && borrow) return { text: `${a} − ${b}`, result: a - b };
    if (!wantBorrow && !borrow) return { text: `${a} − ${b}`, result: a - b };
  }

  // Fallback
  let a = randInt(0, max);
  let b = randInt(0, a);
  return { text: `${a} − ${b}`, result: a - b };
}

function genMultiplication(cfg) {
  const m = cfg.mulMax;
  const a = randInt(1, m);
  const b = randInt(1, m);
  return { text: `${a} × ${b}`, result: a * b };
}

// Main entry: generate a task for the current level index
export function generateTask(levelIndex) {
  const cfg = LEVELS[Math.min(levelIndex, LEVELS.length - 1)];
  let t = pickType();

  // If multiplication is not allowed at this level, fall back to add/sub
  if (cfg.mulMax < 1 && t === "mul") {
    t = Math.random() < 0.5 ? "add" : "sub";
  }

  if (t === "add") return genAddition(cfg);
  if (t === "sub") return genSubtraction(cfg);
  return genMultiplication(cfg);
}
