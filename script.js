const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

const loginScreen = document.getElementById("loginScreen");
const mainScreen = document.getElementById("mainScreen");
const loginForm = document.getElementById("loginForm");
const nameInput = document.getElementById("nameInput");
const passwordInput = document.getElementById("passwordInput");
const loginMessage = document.getElementById("loginMessage");

const topContent = document.getElementById("topContent");
const typedText = document.getElementById("typedText");
const accessBtn = document.getElementById("accessBtn");
const popup = document.getElementById("popup");
const panel = document.getElementById("panel");
const progressFill = document.getElementById("progressFill");
const progressValue = document.getElementById("progressValue");
const logs = document.getElementById("logs");
const container = document.getElementById("container");
const flash = document.getElementById("flash");
const secretMessage = document.getElementById("secretMessage");
const glitch = document.querySelector(".glitch");
const restartBtn = document.getElementById("restartBtn");

const message = "SISTEMA BLOQUEADO";
const correctPassword = "parceira";

const firstAttemptLogs = [
  "[ok] terminal conectado",
  "[ok] verificação inicial executada",
  "[scan] analisando protocolo",
  "[scan] validando credenciais",
  "[alerta] tentativa não autorizada detectada",
  "[info] bloqueio de acesso mantido",
  "[ok] sistema preservado"
];

const secondAttemptLogs = [
  "[ok] terminal reconectado",
  "[scan] verificando nova tentativa",
  "[scan] padrão especial identificado",
  "[info] proteção emocional enfraquecida",
  "[falha] bloqueio principal comprometido",
  "[liberação] acesso afetivo autorizado"
];

const letters =
  "01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&@<>/\\{}[]アイウエオカキクケコサシスセソタチツテト";
const chars = letters.split("");

let fontSize = 16;
let columns = 0;
let drops = [];
let typingStarted = false;
let typingIndex = 0;
let running = false;
let attemptCount = 0;

function setupCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  fontSize = window.innerWidth < 500 ? 14 : 16;
  columns = Math.floor(canvas.width / fontSize);
  drops = [];

  for (let i = 0; i < columns; i++) {
    drops[i] = Math.floor(Math.random() * (canvas.height / fontSize));
  }
}

function drawMatrix() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#00ff41";
  ctx.font = `${fontSize}px monospace`;

  for (let i = 0; i < drops.length; i++) {
    const text = chars[Math.floor(Math.random() * chars.length)];
    const x = i * fontSize;
    const y = drops[i] * fontSize;

    ctx.fillText(text, x, y);

    if (y > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }

    drops[i]++;
  }
}

function typeWriter() {
  if (typingIndex < message.length) {
    typedText.textContent += message.charAt(typingIndex);
    typingIndex++;
    setTimeout(typeWriter, 85);
  }
}

function startMainScreen() {
  loginScreen.classList.add("hidden");
  mainScreen.classList.remove("hidden");

  if (!typingStarted) {
    typingStarted = true;
    typedText.textContent = "";
    typingIndex = 0;
    typeWriter();
  }
}

function triggerShake() {
  container.classList.remove("shake");
  void container.offsetWidth;
  container.classList.add("shake");
}

function triggerFlash() {
  flash.classList.remove("active");
  void flash.offsetWidth;
  flash.classList.add("active");
}

function addLog(text) {
  const li = document.createElement("li");
  li.textContent = text;
  logs.appendChild(li);
  logs.scrollTop = logs.scrollHeight;
}

function beep(duration = 120, frequency = 740, volume = 0.03) {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "square";
    oscillator.frequency.value = frequency;
    gainNode.gain.value = volume;

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();

    setTimeout(() => {
      oscillator.stop();
      audioContext.close();
    }, duration);
  } catch (error) {
    console.log("Áudio não suportado.");
  }
}

function resetForSecondAttempt() {
  secretMessage.classList.add("hidden");
  topContent.classList.remove("hidden");
  popup.classList.remove("show");
  panel.classList.add("hidden");

  logs.innerHTML = '<li>[aguardando nova tentativa]</li>';
  progressFill.style.width = "0%";
  progressValue.textContent = "0%";

  accessBtn.textContent = "VERIFICAR O ACESSO";
  triggerFlash();
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const nameValue = nameInput.value.trim();
  const passwordValue = passwordInput.value.trim().toLowerCase();

  if (!nameValue) {
    loginMessage.textContent = "digite o nome para continuar.";
    loginMessage.style.color = "#ff7a95";
    return;
  }

  if (passwordValue !== correctPassword) {
    loginMessage.textContent = "senha incorreta. tente novamente.";
    loginMessage.style.color = "#ff7a95";
    triggerShake();
    beep(100, 320, 0.03);
    return;
  }

  loginMessage.style.color = "#9cffb6";
  loginMessage.textContent = `acesso autorizado, ${nameValue}...`;
  triggerFlash();
  beep(120, 640, 0.03);

  setTimeout(() => {
    startMainScreen();
  }, 900);
});

function finishFirstAttempt() {
  panel.classList.add("hidden");
  secretMessage.classList.remove("hidden");

  secretMessage.innerHTML = `
    <p>⚠ acesso bloqueado na primeira verificação...</p>
    <h2>mas você pode tentar novamente ❤️</h2>
    <button id="restartBtn" class="btn secondary-btn">TENTAR NOVAMENTE</button>
  `;

  const newRestartBtn = document.getElementById("restartBtn");
  newRestartBtn.addEventListener("click", resetForSecondAttempt);

  triggerFlash();
  beep(180, 440, 0.03);
  running = false;
}

function finishSecondAttempt() {
  panel.classList.add("hidden");
  secretMessage.classList.remove("hidden");

  secretMessage.innerHTML = `
    <p>❤️ você insistiu e quebrou a proteção do sistema...</p>
    <h2>acesso liberado ao meu coração ❤️</h2>
    <button id="restartBtn" class="btn secondary-btn">RECOMEÇAR</button>
  `;

  const newRestartBtn = document.getElementById("restartBtn");
  newRestartBtn.addEventListener("click", () => {
    attemptCount = 0;
    secretMessage.classList.add("hidden");
    topContent.classList.remove("hidden");
    popup.classList.remove("show");
    panel.classList.add("hidden");
    logs.innerHTML = '<li>[aguardando ação]</li>';
    progressFill.style.width = "0%";
    progressValue.textContent = "0%";
    accessBtn.textContent = "TENTAR ACESSO";
    triggerFlash();
  });

  triggerFlash();
  beep(220, 520, 0.03);
  running = false;
}

function runFakeSequence() {
  if (running) return;
  running = true;
  attemptCount++;

  topContent.classList.add("hidden");
  popup.classList.add("show");
  panel.classList.remove("hidden");
  secretMessage.classList.add("hidden");

  logs.innerHTML = "";
  progressFill.style.width = "0%";
  progressValue.textContent = "0%";

  triggerShake();
  triggerFlash();
  beep(140, 680);
  beep(120, 520);

  const currentLogs = attemptCount === 1 ? firstAttemptLogs : secondAttemptLogs;

  let progress = 0;
  let logIndex = 0;

  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 8) + 3;

    if (progress > 100) progress = 100;

    progressFill.style.width = `${progress}%`;
    progressValue.textContent = `${progress}%`;

    if (logIndex < currentLogs.length && Math.random() > 0.3) {
      addLog(currentLogs[logIndex]);
      logIndex++;
      beep(70, 880, 0.02);
    }

    if (Math.random() > 0.72) {
      triggerShake();
    }

    if (Math.random() > 0.8) {
      triggerFlash();
    }

    if (progress >= 100) {
      clearInterval(interval);

      if (attemptCount === 1) {
        addLog("[concluído] acesso bloqueado");
        addLog("[aviso] nova tentativa disponível");

        setTimeout(() => {
          finishFirstAttempt();
        }, 900);
      } else {
        addLog("[falha] proteção emocional comprometida");
        addLog("[acesso] coração desbloqueado");

        setTimeout(() => {
          finishSecondAttempt();
        }, 900);
      }
    }
  }, 180);

  setTimeout(() => {
    popup.classList.remove("show");
  }, 1600);
}

accessBtn.addEventListener("click", runFakeSequence);
window.addEventListener("resize", setupCanvas);

setInterval(() => {
  if (!mainScreen.classList.contains("hidden") && !topContent.classList.contains("hidden")) {
    glitch.classList.add("active");

    setTimeout(() => {
      glitch.classList.remove("active");
    }, 150);
  }
}, 2000);

setupCanvas();
setInterval(drawMatrix, 35);