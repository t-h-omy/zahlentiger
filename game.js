
/* === game.js – Teil 3a: State, Config & Levelsystem === */

/* Global State */
let richtigeLoesung = 0;
let streak = 0;
let chainCount = 0;
let rescueMode = false;
let rescueIndex = null;
let muted = false;
const maxStreak = 10;
let blockFocus = false;

let levelIndex = 0;
const levelNames = ["Mathe-Welpe", "Zahlen-Fuchs", "Rechen-Tiger", "Operations-Löwe", "Mathe-Drache", "Rechen-Zauberer"];
const levelIcons = ["🐶", "🦊", "🐯", "🦁", "🐉", "🧙‍♂️"];

let streakColors = [];
let superBadgeBlinked = false;
let megaBadgeBlinked = false;

/* Difficulty per Level */
const LEVELS = [
  { addMax:20,  subMax:15,  mulMax:3, addCarryP:0.00, subBorrowP:0.00 },
  { addMax:50,  subMax:40,  mulMax:4, addCarryP:0.25, subBorrowP:0.05 },
  { addMax:80,  subMax:65,  mulMax:5, addCarryP:0.45, subBorrowP:0.15 },
  { addMax:120, subMax:100, mulMax:7, addCarryP:0.65, subBorrowP:0.25 },
  { addMax:150, subMax:120, mulMax:9, addCarryP:0.75, subBorrowP:0.35 },
  { addMax:200, subMax:160, mulMax:10,addCarryP:0.85, subBorrowP:0.45 }
];

/* Type distribution */
const TYPE_WEIGHTS = { add:0.35, sub:0.35, mul:0.30 };


/* === game.js – Teil 3b: Aufgaben-Generator (Add/Sub/Mul) === */

/* Helpers */
function randInt(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

/* Weighted type picker with fixed distribution across all levels */
function pickType() {
  const x = Math.random();
  if (x < TYPE_WEIGHTS.mul) return "mul";
  if (x < TYPE_WEIGHTS.mul + TYPE_WEIGHTS.sub) return "sub";
  return "add";
}

/* Addition generator with optional carry preference */
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

  // Fallback (balanced)
  let a = randInt(0, Math.floor(max / 2));
  let b = randInt(0, Math.min(max - a, Math.floor(max / 2)));
  return { text: `${a} + ${b}`, result: a + b };
}

/* Subtraction generator with lower difficulty (borrow less frequent) */
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

/* Multiplication generator, range grows with level */
function genMultiplication(cfg) {
  const m = cfg.mulMax;
  const a = randInt(1, m);
  const b = randInt(1, m);
  return { text: `${a} × ${b}`, result: a * b };
}


/* === game.js – Teil 3c: Streak-Engine, Rescue-Mode, Badges, Level-Up, neueAufgabe() === */

/* Badge updating */
function updateBadge() {
  const b = document.getElementById("statusBadge");
  b.innerHTML = "";

  if (rescueMode) {
    b.innerHTML = `<span class="badge badge-rescue rescuePulse">⚠️ Rette deinen Streak!</span>`;
    return;
  }

  if (chainCount >= 8) {
    b.innerHTML = `<span class="badge badge-mega">MEGA-STREAK! 🚀</span>`;
  } else if (chainCount >= 4) {
    b.innerHTML = `<span class="badge badge-super">SUPER-STREAK! 🔥</span>`;
  }
}

/* Blink for first super/mega streak in a level */
function triggerBadgeBlink(kind) {
  const b = document.querySelector("#statusBadge .badge");
  if (!b) return;

  if (kind === "mega" && !megaBadgeBlinked) {
    b.classList.add("blink");
    megaBadgeBlinked = true;
    setTimeout(() => b.classList.remove("blink"), 1100);
  }
  else if (kind === "super" && !superBadgeBlinked) {
    b.classList.add("blink");
    superBadgeBlinked = true;
    setTimeout(() => b.classList.remove("blink"), 1100);
  }
}

/* Update the streak segments */
function updateSegments() {
  for (let i = 0; i < 10; i++) {
    const seg = document.getElementById("seg" + i);
    if (!seg) continue;
    seg.style.background = "#ccc";
  }

  for (let i = 0; i < streak; i++) {
    const c = streakColors[i] || "green";
    const seg = document.getElementById("seg" + i);
    if (!seg) continue;
    seg.style.background =
      c === "purple" ? "#a200ff" :
      c === "blue"   ? "#006cff" :
      c === "orange" ? "#ff8800" :
      "#00c400";
  }

  document.getElementById("levelName").textContent = levelNames[levelIndex];
  document.getElementById("levelIcon").textContent = levelIcons[levelIndex];
}

/* Generate a new task */
function neueAufgabe() {
  const cfg = LEVELS[Math.min(levelIndex, LEVELS.length - 1)];
  let t = pickType();
  if (cfg.mulMax < 1 && t === "mul") t = Math.random() < 0.5 ? "add" : "sub";

  let task;
  if (t === "add")      task = genAddition(cfg);
  else if (t === "sub") task = genSubtraction(cfg);
  else                  task = genMultiplication(cfg);

  richtigeLoesung = task.result;
  document.getElementById("aufgabe").textContent = `${task.text} = ?`;

  const inp = document.getElementById("eingabe");
  inp.value = "";
  if (!blockFocus) {
    inp.focus();
    inp.select();
  }

  const fb = document.getElementById("feedback");
  fb.textContent = "";
  fb.className = "";

  updateSegments();
  updateBadge();
}


/* === game.js – Teil 3d: Audio-System (WebAudio) === */

const AudioCtx = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioCtx();

/* Utility to play a short note */
function playNote(freq, tOffset, dur, type="sine", vol=0.18) {
  if (muted) return;
  const now = audioCtx.currentTime + (tOffset || 0);
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = type;
  osc.frequency.value = freq;

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(vol, now + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + (dur || 0.2));

  osc.start(now);
  osc.stop(now + (dur || 0.2) + 0.03);
}

/* Reward melody: freundlich, aufsteigend */
function rewardSound() {
  playNote(523.25, 0.00, 0.20, "sine", 0.20);   // C5
  playNote(659.25, 0.15, 0.22, "sine", 0.20);   // E5
  playNote(783.99, 0.33, 0.24, "sine", 0.20);   // G5
}

/* Fail melody: kurzes, freundliches 'oops' */
function failSound() {
  playNote(246.94, 0.00, 0.22, "triangle", 0.18); // B3
  playNote(207.65, 0.14, 0.22, "triangle", 0.16); // G#3
}

/* Level-Up fanfare: deutlicher, ohne Reward zu überlagern */
function levelUpSound() {
  playNote(523.25, 0.00, 0.28, "sine", 0.22);    // C5
  playNote(783.99, 0.15, 0.30, "sine", 0.22);    // G5
  playNote(1046.50,0.35, 0.40, "sine", 0.22);    // C6
}

/* UI: Mute toggle helper */
function toggleMute(btn) {
  muted = !muted;
  if (btn) btn.textContent = muted ? "🔇 Ton an" : "🔊 Ton aus";
}


/* === game.js – Teil 3e: Konfetti-Engine & Maskottchen-Engine === */

/* Canvas and context */
const confettiCanvas = document.getElementById('confetti-canvas');
const ctx = confettiCanvas.getContext('2d');

let confettiParticles = [];
let confettiAnimating = false;

/* Resize canvas to full screen */
function resizeCanvas() {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

/* Vibration helper */
function vibrateConfetti() {
  if (navigator.vibrate) navigator.vibrate(300);
}

/* Create fountain with variable particle count */
function spawnFountain(count, heightScale=1) {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight;

  for (let i=0; i<count; i++) {
    const angle = -Math.PI/2 + (Math.random()*0.6 - 0.3);
    const speed = 9 + Math.random()*5;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed * heightScale;

    confettiParticles.push({
      x: cx + (Math.random()*90 - 45),
      y: cy - 2,
      vx, vy,
      g: 0.38 + Math.random()*0.28,
      rot: Math.random()*Math.PI*2,
      rv: (Math.random()*0.25 - 0.125),
      w: 5 + Math.random()*6,
      h: (5 + Math.random()*6)*(0.7+Math.random()*0.6),
      life: 0,
      max: 90 + Math.random()*30,
      col: CONFETTI_COLS[Math.floor(Math.random()*CONFETTI_COLS.length)]
    });
  }

  vibrateConfetti();
  if (!confettiAnimating) {
    confettiAnimating = true;
    requestAnimationFrame(confettiLoop);
  }
}

/* Rain effect for Level-Up (long, steady) */
function spawnRain(durationMs, density=12) {
  const tEnd = performance.now() + durationMs;
  vibrateConfetti();

  (function tick() {
    if (performance.now() > tEnd) return;

    for (let i=0; i<density; i++) {
      confettiParticles.push({
        x: Math.random()*window.innerWidth,
        y: -10,
        vx: Math.random()*1 - 0.5,
        vy: 3 + Math.random()*2,
        g: 0,
        rot: Math.random()*Math.PI*2,
        rv: Math.random()*0.2,
        w: 5 + Math.random()*6,
        h: (5 + Math.random()*6)*(0.7+Math.random()*0.6),
        life: 0,
        max: window.innerHeight/3,
        col: CONFETTI_COLS[Math.floor(Math.random()*CONFETTI_COLS.length)]
      });
    }

    setTimeout(tick, 40);
    if (!confettiAnimating) {
      confettiAnimating = true;
      requestAnimationFrame(confettiLoop);
    }
  })();
}

/* Confetti render loop */
function confettiLoop() {
  ctx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height);

  const alive=[];
  for (const p of confettiParticles) {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += p.g * 0.2;
    p.rot += p.rv;
    p.life++;

    ctx.save();
    ctx.translate(p.x,p.y);
    ctx.rotate(p.rot);
    ctx.globalAlpha = Math.max(0, 1 - p.life/p.max);
    ctx.fillStyle = p.col;
    ctx.fillRect(-p.w*0.5, -p.h*0.5, p.w, p.h);
    ctx.restore();

    if (p.life < p.max && p.y < confettiCanvas.height+60) alive.push(p);
  }

  confettiParticles = alive;
  if (confettiParticles.length > 0) {
    requestAnimationFrame(confettiLoop);
  } else {
    confettiAnimating = false;
  }
}

/* Wrappers used by game logic */
const CONFETTI_COLS = ["#ff3838","#ff9f1a","#ffd32a","#32ff7e","#7efff5","#18dcff","#7d5fff","#ea2027","#ffffff"];

function confettiSuper() { spawnFountain(35,1.0); }
function confettiMega()  { spawnFountain(55,1.0); }
function confettiLevelUp() { spawnRain(5000,12); }

/* Mascot animation */
function showMascotJump(icon) {
  const overlay = document.getElementById("mascotOverlay");
  const m = document.getElementById("mascot");
  m.textContent = icon;

  overlay.style.display = "flex";
  m.classList.remove("mascotJump");
  void m.offsetWidth; // restart animation
  m.classList.add("mascotJump");

  setTimeout(() => {
    overlay.style.display = "none";
  }, 1550);
}


/* === game.js – Teil 3f: Input, Prüfen, Right/Wrong, Level-Up, Startup === */

/* Prüfen der Eingabe */
function pruefen() {
  const inp = document.getElementById("eingabe");
  const v = inp.value.trim();
  if (v === "" || !Number.isFinite(Number(v))) return handleWrong();
  Number(v) === richtigeLoesung ? handleRight() : handleWrong();
}

function handleRight() {
  const fb = document.getElementById("feedback");
  const willLevelUp = (streak + 1) >= maxStreak;

  if (willLevelUp) {
    levelUpSound();
    blockFocus = true;
    document.getElementById("eingabe").blur();
    confettiLevelUp();
    showMascotJump(levelIcons[Math.min(levelIndex+1, levelIcons.length-1)]);
  } else {
    rewardSound();
  }

  let thresholdText = "";
  let crossed = null;

  if (!rescueMode) {
    const prev = chainCount;
    chainCount++;
    if (prev < 8 && chainCount >= 8) { thresholdText = "8 in Folge! 🚀"; crossed = "mega"; }
    else if (prev < 4 && chainCount >= 4) { thresholdText = "4 in Folge! 🔥"; crossed = "super"; }
  } else {
    fb.textContent = "Streak gerettet! 🎉";
    fb.className = "ok";
    rescueMode = false;
    chainCount = 0;
  }

  if (thresholdText) { fb.textContent = thresholdText; fb.className = "ok"; }
  else if (!rescueMode) { fb.textContent = "Super! 🌟"; fb.className = "ok"; }

  let newColor = "green";
  if (chainCount >= 8) newColor = "purple";
  else if (chainCount >= 4) newColor = "blue";

  streakColors[streak] = newColor;
  streak++;

  updateSegments();
  updateBadge();

  if (crossed === "mega") { confettiMega(); triggerBadgeBlink("mega"); }
  else if (crossed === "super") { confettiSuper(); triggerBadgeBlink("super"); }

  if (willLevelUp) {
    const newLevel = levelNames[Math.min(levelIndex+1, levelNames.length-1)];
    const f = document.getElementById("levelUpFlash");
    f.textContent = "Neues Level: " + newLevel;
    f.style.display = "block";
    setTimeout(() => f.style.display = "none", 4000);

    setTimeout(() => {
      streak = 0; chainCount = 0; rescueIndex = null; rescueMode = false; streakColors = [];
      levelIndex = Math.min(levelIndex+1, levelNames.length-1);
      superBadgeBlinked = false; megaBadgeBlinked = false;
      blockFocus = false;
      neueAufgabe();
    }, 5200);
    return;
  }

  setTimeout(() => {
    fb.textContent = "";
    fb.className = "";
    neueAufgabe();
  }, 1500);
}

function handleWrong() {
  const fb = document.getElementById("feedback");
  fb.textContent = "Gleich nochmal 🙂";
  fb.className = "enc";
  failSound();
  if (navigator.vibrate) navigator.vibrate(60);

  if (rescueMode) {
    fb.textContent = "Streak verloren 😢";
    fb.className = "no";
    streak = 0; chainCount = 0; rescueMode = false; rescueIndex = null; streakColors = [];
    updateSegments(); updateBadge();
    setTimeout(() => { fb.textContent = ""; fb.className = ""; neueAufgabe(); }, 1200);
    return;
  }

  if (streak > 0) {
    rescueMode = true;
    rescueIndex = streak - 1;
    streakColors[rescueIndex] = "orange";
    chainCount = 0;
    updateSegments(); updateBadge();
    return;
  }

  updateSegments(); updateBadge();
}

/* Events */
document.getElementById("checkBtn").onclick = pruefen;
document.getElementById("eingabe").addEventListener("keydown", e => {
  if (e.key === "Enter") pruefen();
});
document.getElementById("muteBtn").onclick = () => {
  toggleMute(document.getElementById("muteBtn"));
};

/* Startup */
neueAufgabe();
updateSegments();
updateBadge();

