// === model/tasks.js ===
// Task generation: addition, subtraction, multiplication, division with carry/borrow tuning.

import { LEVELS, TYPE_WEIGHTS } from "./balancing.js";
import { selectedOperations } from "./operations.js";

function randInt(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

// Weighted type pick based on active operations
function pickType() {
  const activeOps = [];
  
  if (selectedOperations.addition) activeOps.push({ type: "add", weight: TYPE_WEIGHTS.add });
  if (selectedOperations.subtraktion) activeOps.push({ type: "sub", weight: TYPE_WEIGHTS.sub });
  if (selectedOperations.multiplikation) activeOps.push({ type: "mul", weight: TYPE_WEIGHTS.mul });
  if (selectedOperations.division) activeOps.push({ type: "div", weight: TYPE_WEIGHTS.mul }); // Use same weight as mul
  
  if (activeOps.length === 0) {
    // Fallback: should not happen, but default to addition
    return "add";
  }
  
  const totalWeight = activeOps.reduce((sum, op) => sum + op.weight, 0);
  const rand = Math.random() * totalWeight;
  
  let cumulative = 0;
  for (const op of activeOps) {
    cumulative += op.weight;
    if (rand < cumulative) return op.type;
  }
  
  return activeOps[0].type;
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

function genDivision(cfg) {
  const m = cfg.mulMax;
  // Generate division as reverse of multiplication to ensure whole numbers
  const b = randInt(1, m); // divisor
  const quotient = randInt(1, m); // result
  const a = b * quotient; // dividend
  return { text: `${a} ÷ ${b}`, result: quotient };
}

// Main entry: generate a task for the current level index
export function generateTask(levelIndex) {
  const cfg = LEVELS[Math.min(levelIndex, LEVELS.length - 1)];
  let t = pickType();

  // If multiplication/division is not allowed at this level, fall back to add/sub
  if (cfg.mulMax < 1 && (t === "mul" || t === "div")) {
    const fallbacks = [];
    if (selectedOperations.addition) fallbacks.push("add");
    if (selectedOperations.subtraktion) fallbacks.push("sub");
    t = fallbacks.length > 0 ? fallbacks[Math.floor(Math.random() * fallbacks.length)] : "add";
  }

  if (t === "add") return genAddition(cfg);
  if (t === "sub") return genSubtraction(cfg);
  if (t === "div") return genDivision(cfg);
  return genMultiplication(cfg);
}
