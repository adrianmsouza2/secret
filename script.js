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

const message = "SISTEMA BLOQUEADO";
const correctPassword = "parceira";

const logMessages = [
  "[ok] terminal conectado",
  "[ok] verificação inicial executada",
  "[scan] analisando protocolo",
  "[scan] validando credenciais",
  "[alerta] tentativa não autorizada detectada",
  "[info] bloqueio de acesso mantido",
  "[ok] sistema preservado"
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

function runFakeSequence() {
  if (running) return;
  running = true;

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

  let progress = 0;
  let logIndex = 0;

  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 8) + 3;

    if (progress > 100) progress = 100;

    progressFill.style.width = `${progress}%`;
    progressValue.textContent = `${progress}%`;

    if (logIndex < logMessages.length && Math.random() > 0.35) {
      addLog(logMessages[logIndex]);
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
      addLog("[concluído] acesso negado");
      addLog("[concluído] retorne em outro momento");

      setTimeout(() => {
        panel.classList.add("hidden");
        secretMessage.classList.remove("hidden");
        triggerFlash();
        beep(180, 440, 0.03);
        running = false;
      }, 900);
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