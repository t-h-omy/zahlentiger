// === model/appState.js ===
// Application-level state: menu vs game mode

export const APP_MODE = {
  MENU: "menu",
  GAME: "game"
};

export const appState = {
  currentMode: APP_MODE.MENU
};

export function setAppMode(mode) {
  appState.currentMode = mode;
  
  const body = document.body;
  const mainMenu = document.getElementById("mainMenu");
  
  if (mode === APP_MODE.MENU) {
    body.classList.add("menu-mode");
    if (mainMenu) mainMenu.classList.remove("hidden");
  } else if (mode === APP_MODE.GAME) {
    body.classList.remove("menu-mode");
    if (mainMenu) mainMenu.classList.add("hidden");
  }
}
