// === model/operations.js ===
// Manages selected operations for task generation

export const selectedOperations = {
  addition: true,
  subtraktion: true,
  multiplikation: true,
  division: false
};

export function toggleOperation(operation) {
  if (operation in selectedOperations) {
    selectedOperations[operation] = !selectedOperations[operation];
  }
}

export function getActiveOperations() {
  return Object.keys(selectedOperations).filter(op => selectedOperations[op]);
}

export function hasActiveOperation() {
  return getActiveOperations().length > 0;
}
