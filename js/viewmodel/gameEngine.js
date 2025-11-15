// === viewmodel/gameEngine.js ===
// Core game flow: checking answers, managing streaks, rescue mode, level ups.

import { gameState, resetLevelProgress } from "../model/state.js";
import { LEVEL_NAMES, LEVEL_ICONS, MAX_STREAK, LEVEL_UP_DISPLAY_DURATION } from "../model/balancing.js";
import { generateTask } from "../model/tasks.js";
import {
  updateSegments,
  updateBadge,
  triggerBadgeBlink,
  setTaskText,
  resetInputAndFeedback,
  setFeedback,
  showLevelUpFlash
} from "../view/ui.js";
import {
  confettiSuper,
  confettiMega,
  confettiLevelUp,
  showMascotJump
} from "../view/effects.js";
import {
  playRewardSound,
  playFailSound,
  playLevelUpSound
} from "../view/audio.js";

function createNewTask() {
  const task = generateTask(gameState.levelIndex);
  gameState.correctAnswer = task.result;

  setTaskText(`${task.text} = ?`);
  resetInputAndFeedback(gameState.blockFocus);
  updateSegments();
  updateBadge();
}

function handleCorrect() {
  const fb = document.getElementById("feedback");
  const willLevelUp = (gameState.streak + 1) >= MAX_STREAK;

  if (willLevelUp) {
    playLevelUpSound();
    gameState.blockFocus = true;
    const input = document.getElementById("eingabe");
    if (input) input.blur();
    confettiLevelUp();
    showMascotJump(Math.min(gameState.levelIndex + 1, LEVEL_ICONS.length - 1));
  } else {
    playRewardSound();
  }

  let thresholdText = "";
  let crossed = null;

  if (!gameState.rescueMode) {
    const prev = gameState.chainCount;
    gameState.chainCount++;
    if (prev < 8 && gameState.chainCount >= 8) {
      thresholdText = "8 in Folge! 🚀";
      crossed = "mega";
    } else if (prev < 4 && gameState.chainCount >= 4) {
      thresholdText = "4 in Folge! 🔥";
      crossed = "super";
    }
  } else {
    fb.textContent = "Streak gerettet! 🎉";
    fb.className = "ok";
    gameState.rescueMode = false;
    gameState.chainCount = 0;
  }

  if (thresholdText) {
    fb.textContent = thresholdText;
    fb.className = "ok";
  } else if (!gameState.rescueMode) {
    fb.textContent = "Super! 🌟";
    fb.className = "ok";
  }

  // Color for current streak segment
  let newColor = "green";
  if (gameState.chainCount >= 8) newColor = "purple";
  else if (gameState.chainCount >= 4) newColor = "blue";

  gameState.streakColors[gameState.streak] = newColor;
  gameState.streak++;

  updateSegments();
  updateBadge();

  if (crossed === "mega") {
    confettiMega();
    triggerBadgeBlink("mega");
  } else if (crossed === "super") {
    confettiSuper();
    triggerBadgeBlink("super");
  }

  if (willLevelUp) {
    const newLevelName =
      LEVEL_NAMES[Math.min(gameState.levelIndex + 1, LEVEL_NAMES.length - 1)];

    showLevelUpFlash(newLevelName);

    setTimeout(() => {
      // Reset state for new level – same as original logic
      gameState.streak = 0;
      gameState.chainCount = 0;
      gameState.rescueIndex = null;
      gameState.rescueMode = false;
      gameState.streakColors = [];
      gameState.levelIndex =
        Math.min(gameState.levelIndex + 1, LEVEL_NAMES.length - 1);
      gameState.superBadgeBlinked = false;
      gameState.megaBadgeBlinked = false;
      gameState.blockFocus = false;

      createNewTask();
    }, LEVEL_UP_DISPLAY_DURATION);
    return;
  }

  setTimeout(() => {
    fb.textContent = "";
    fb.className = "";
    createNewTask();
  }, 1500);
}

function handleWrong() {
  const fb = document.getElementById("feedback");
  fb.textContent = "Gleich nochmal 🙂";
  fb.className = "enc";
  playFailSound();
  if (navigator.vibrate) navigator.vibrate(60);

  if (gameState.rescueMode) {
    fb.textContent = "Streak verloren 😢";
    fb.className = "no";
    gameState.streak = 0;
    gameState.chainCount = 0;
    gameState.rescueMode = false;
    gameState.rescueIndex = null;
    gameState.streakColors = [];
    updateSegments();
    updateBadge();
    setTimeout(() => {
      fb.textContent = "";
      fb.className = "";
      createNewTask();
    }, 1200);
    return;
  }

  if (gameState.streak > 0) {
    gameState.rescueMode = true;
    gameState.rescueIndex = gameState.streak - 1;
    gameState.streakColors[gameState.rescueIndex] = "orange";
    gameState.chainCount = 0;
    updateSegments();
    updateBadge();
    return;
  }

  updateSegments();
  updateBadge();
}

export function checkAnswer() {
  const input = document.getElementById("eingabe");
  if (!input) return;

  const v = input.value.trim();
  // Show encouragement message for empty input
  if (v === "") {
    const fb = document.getElementById("feedback");
    if (fb) {
      fb.textContent = "Trage eine Antwort ein ☀️";
      fb.className = "enc";
    }
    input.focus();
    return;
  }
  
  if (!Number.isFinite(Number(v))) {
    handleWrong();
    return;
  }

  Number(v) === gameState.correctAnswer ? handleCorrect() : handleWrong();
}

export function initGame() {
  createNewTask();
  updateSegments();
  updateBadge();
}
