// === model/tasks.js ===
// Task generation: addition, subtraction, multiplication, division with carry/borrow tuning.

import { LEVELS, TYPE_WEIGHTS, MULTIPLICATION_LEVELS, DIVISION_LEVELS } from "./balancing.js";
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
  if (selectedOperations.division) activeOps.push({ type: "div", weight: TYPE_WEIGHTS.div });
  
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

function genMultiplication(cfg, levelIndex) {
  const mulCfg = MULTIPLICATION_LEVELS[Math.min(levelIndex, MULTIPLICATION_LEVELS.length - 1)];
  
  for (let attempt = 0; attempt < 200; attempt++) {
    // Generate Factor 1
    let factor1 = randInt(mulCfg.factor1Min, mulCfg.factor1Max);
    
    // Check if Factor 1 is excluded
    if (mulCfg.factor1Exclude.includes(factor1)) {
      continue;
    }
    
    // Generate Factor 2
    let factor2;
    // Decide if we should use an extra value (if available)
    if (mulCfg.factor2Extra.length > 0 && Math.random() < 0.2) {
      // 20% chance to use an extra value
      factor2 = mulCfg.factor2Extra[Math.floor(Math.random() * mulCfg.factor2Extra.length)];
    } else {
      factor2 = randInt(mulCfg.factor2Min, mulCfg.factor2Max);
    }
    
    return { text: `${factor1} × ${factor2}`, result: factor1 * factor2 };
  }
  
  // Fallback (should rarely happen)
  const factor1 = randInt(mulCfg.factor1Min, mulCfg.factor1Max);
  const factor2 = randInt(mulCfg.factor2Min, mulCfg.factor2Max);
  return { text: `${factor1} × ${factor2}`, result: factor1 * factor2 };
}

function genDivision(cfg, levelIndex) {
  const divCfg = DIVISION_LEVELS[Math.min(levelIndex, DIVISION_LEVELS.length - 1)];
  
  // Level-specific task generation strategies
  if (levelIndex === 0) {
    // Level 1: Simple divisions within 1-10
    for (let attempt = 0; attempt < 200; attempt++) {
      const divisor = randInt(1, 10);
      const quotient = randInt(1, 10);
      const dividend = divisor * quotient;
      
      if (dividend >= 1 && dividend <= 10) {
        return { text: `${dividend} ÷ ${divisor}`, result: quotient };
      }
    }
  } else if (levelIndex === 1) {
    // Level 2: Level 1 + divisions by 10 (10÷10, 20÷10, ..., 100÷10)
    if (Math.random() < 0.3) {
      // 30% chance for new Level 2 tasks (divisions by 10)
      const quotient = randInt(1, 10);
      const dividend = 10 * quotient; // 10, 20, 30, ..., 100
      return { text: `${dividend} ÷ 10`, result: quotient };
    } else {
      // 70% chance for Level 1 tasks
      const divisor = randInt(1, 10);
      const quotient = randInt(1, 10);
      const dividend = divisor * quotient;
      
      if (dividend >= 1 && dividend <= 10) {
        return { text: `${dividend} ÷ ${divisor}`, result: quotient };
      }
    }
  } else if (levelIndex === 2) {
    // Level 3: Level 1-2 + new tasks with divisor 1-4, dividend up to 50, quotient 1-10
    const taskType = Math.random();
    
    if (taskType < 0.4) {
      // 40% Level 1 tasks (simple within 1-10)
      const divisor = randInt(1, 10);
      const quotient = randInt(1, 10);
      const dividend = divisor * quotient;
      
      if (dividend >= 1 && dividend <= 10) {
        return { text: `${dividend} ÷ ${divisor}`, result: quotient };
      }
    } else if (taskType < 0.6) {
      // 20% Level 2 tasks (divisions by 10)
      const quotient = randInt(1, 10);
      const dividend = 10 * quotient;
      return { text: `${dividend} ÷ 10`, result: quotient };
    } else {
      // 40% New Level 3 tasks
      const divisor = randInt(1, 4);
      const quotient = randInt(1, 10);
      const dividend = divisor * quotient;
      
      if (dividend >= 1 && dividend <= 50) {
        return { text: `${dividend} ÷ ${divisor}`, result: quotient };
      }
    }
  } else if (levelIndex === 3) {
    // Level 4: Level 1-3 + new tasks with divisor 1-6, dividend up to 80, quotient 1-10
    const taskType = Math.random();
    
    if (taskType < 0.25) {
      // 25% Level 1 tasks
      const divisor = randInt(1, 10);
      const quotient = randInt(1, 10);
      const dividend = divisor * quotient;
      
      if (dividend >= 1 && dividend <= 10) {
        return { text: `${dividend} ÷ ${divisor}`, result: quotient };
      }
    } else if (taskType < 0.4) {
      // 15% Level 2 tasks (divisions by 10)
      const quotient = randInt(1, 10);
      const dividend = 10 * quotient;
      return { text: `${dividend} ÷ 10`, result: quotient };
    } else if (taskType < 0.6) {
      // 20% Level 3 tasks
      const divisor = randInt(1, 4);
      const quotient = randInt(1, 10);
      const dividend = divisor * quotient;
      
      if (dividend >= 1 && dividend <= 50) {
        return { text: `${dividend} ÷ ${divisor}`, result: quotient };
      }
    } else {
      // 40% New Level 4 tasks
      const divisor = randInt(1, 6);
      const quotient = randInt(1, 10);
      const dividend = divisor * quotient;
      
      if (dividend >= 1 && dividend <= 80) {
        return { text: `${dividend} ÷ ${divisor}`, result: quotient };
      }
    }
  } else if (levelIndex === 4) {
    // Level 5: Mix of simple, tens, and medium exact tasks (divisor 1-10, dividend 1-100, quotient 1-10)
    const taskType = Math.random();
    
    if (taskType < 0.2) {
      // 20% Simple small tasks (e.g., 6÷3, 9÷3)
      const divisor = randInt(1, 5);
      const quotient = randInt(1, 5);
      const dividend = divisor * quotient;
      
      if (dividend >= 1 && dividend <= 25) {
        return { text: `${dividend} ÷ ${divisor}`, result: quotient };
      }
    } else if (taskType < 0.4) {
      // 20% Tens tasks (e.g., 40÷5, 90÷9, 100÷10)
      const divisor = randInt(1, 10);
      const quotient = randInt(4, 10);
      const dividend = divisor * quotient;
      
      if (dividend >= 40 && dividend <= 100) {
        return { text: `${dividend} ÷ ${divisor}`, result: quotient };
      }
    } else {
      // 60% Medium exact tasks (e.g., 36÷4, 54÷6, 72÷8)
      const divisor = randInt(1, 10);
      const quotient = randInt(1, 10);
      const dividend = divisor * quotient;
      
      if (dividend >= 1 && dividend <= 100) {
        return { text: `${dividend} ÷ ${divisor}`, result: quotient };
      }
    }
  } else if (levelIndex === 5) {
    // Level 6: Harder tasks - divisor up to 144, quotient 1-12
    const taskType = Math.random();
    
    if (taskType < 0.3) {
      // 30% Include some easier tasks from previous levels
      const divisor = randInt(1, 10);
      const quotient = randInt(1, 10);
      const dividend = divisor * quotient;
      
      if (dividend >= 1 && dividend <= 100) {
        return { text: `${dividend} ÷ ${divisor}`, result: quotient };
      }
    } else {
      // 70% New harder Level 6 tasks
      const divisor = randInt(1, 144);
      const quotient = randInt(1, 12);
      const dividend = divisor * quotient;
      
      if (dividend >= 1 && dividend <= 1728) {
        return { text: `${dividend} ÷ ${divisor}`, result: quotient };
      }
    }
  }
  
  // Fallback: generate a safe division task
  const divisor = randInt(1, Math.min(10, divCfg.divisorMax));
  const quotient = randInt(1, divCfg.quotientMax);
  const dividend = divisor * quotient;
  return { text: `${dividend} ÷ ${divisor}`, result: quotient };
}

// Main entry: generate a task for the current level index
export function generateTask(levelIndex) {
  const cfg = LEVELS[Math.min(levelIndex, LEVELS.length - 1)];
  let t = pickType();

  // Multiplication and division are always allowed (no mulMax check anymore)
  
  if (t === "add") return genAddition(cfg);
  if (t === "sub") return genSubtraction(cfg);
  if (t === "div") return genDivision(cfg, levelIndex);
  return genMultiplication(cfg, levelIndex);
}
