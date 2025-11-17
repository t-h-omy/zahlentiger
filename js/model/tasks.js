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
    let a = randInt(1, max - 1); // Start from 1, leave room for b
    let b = randInt(1, max - a); // Start from 1 to avoid zero
    const carry = ((a % 10) + (b % 10)) >= 10;

    if (wantCarry && carry) return { text: `${a} + ${b}`, result: a + b };
    if (!wantCarry && !carry) return { text: `${a} + ${b}`, result: a + b };
  }

  // Fallback, avoid zero
  let a = randInt(1, Math.floor(max / 2));
  let b = randInt(1, Math.floor(max / 2));
  return { text: `${a} + ${b}`, result: a + b };
}

function genSubtraction(cfg) {
  const max = cfg.subMax;
  const wantBorrow = Math.random() < cfg.subBorrowP;

  for (let t = 0; t < 200; t++) {
    let a = randInt(2, max); // Start from 2 to ensure b can be at least 1
    let b = randInt(1, a - 1); // Ensure result is at least 1 (a - b >= 1)
    const result = a - b;
    const borrow = (a % 10) < (b % 10);

    if (wantBorrow && borrow) return { text: `${a} − ${b}`, result: result };
    if (!wantBorrow && !borrow) return { text: `${a} − ${b}`, result: result };
  }

  // Fallback, avoid zero - ensure a >= 2 and b <= a-1
  let a = randInt(2, max);
  let b = randInt(1, a - 1);
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
