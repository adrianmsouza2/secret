const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

const typedText = document.getElementById("typedText");
const accessBtn = document.getElementById("accessBtn");
const popup = document.getElementById("popup");
const panel = document.getElementById("panel");
const progressFill = document.getElementById("progressFill");
const progressValue = document.getElementById("progressValue");
const logs = document.getElementById("logs");
const container = document.getElementById("container");
const flash = document.getElementById("flash");

const message = "SISTEMA BLOQUEADO";
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

function runFakeSequence() {
  if (running) return;
  running = true;

  popup.classList.add("show");
  panel.classList.remove("hidden");
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
      beep(180, 440, 0.03);
      running = false;
    }
  }, 180);

  setTimeout(() => {
    popup.classList.remove("show");
  }, 1600);
}

accessBtn.addEventListener("click", runFakeSequence);
window.addEventListener("resize", setupCanvas);

setupCanvas();
typeWriter();
setInterval(drawMatrix, 35);