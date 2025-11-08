// === model/state.js ===
// Central game state container. No DOM access here.

export const gameState = {
  correctAnswer: 0,
  streak: 0,
  chainCount: 0,
  rescueMode: false,
  rescueIndex: null,
  muted: false,
  blockFocus: false,
  levelIndex: 0,
  streakColors: [],
  superBadgeBlinked: false,
  megaBadgeBlinked: false
};

// Reset fields that belong to a level when a level-up happens
export function resetLevelProgress() {
  gameState.streak = 0;
  gameState.chainCount = 0;
  gameState.rescueMode = false;
  gameState.rescueIndex = null;
  gameState.streakColors = [];
  gameState.superBadgeBlinked = false;
  gameState.megaBadgeBlinked = false;
  gameState.blockFocus = false;
}
