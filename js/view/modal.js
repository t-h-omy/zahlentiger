// === view/modal.js ===
// Settings modal open/close logic

/**
 * Opens the settings modal and disables game interaction
 */
export function openSettingsModal() {
  const modal = document.getElementById("settingsModal");
  const container = document.getElementById("container");
  
  if (modal) {
    modal.style.display = "flex";
    
    // Disable game UI interaction
    if (container) {
      container.style.pointerEvents = "none";
      container.style.opacity = "0.7";
    }
  }
}

/**
 * Closes the settings modal and re-enables game interaction
 */
export function closeSettingsModal() {
  const modal = document.getElementById("settingsModal");
  const container = document.getElementById("container");
  
  if (modal) {
    modal.style.display = "none";
    
    // Re-enable game UI interaction
    if (container) {
      container.style.pointerEvents = "auto";
      container.style.opacity = "1";
    }
  }
}
