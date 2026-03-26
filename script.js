const harryWrapper = document.getElementById("harryWrapper");
const messageBox = document.getElementById("messageBox");
const restartBtn = document.getElementById("restartBtn");
const sparkles = document.getElementById("sparkles");
const musicBtn = document.getElementById("musicBtn");
const bgMusic = document.getElementById("bgMusic");

let hasFlown = false;
let sparkleInterval = null;
let musicPlaying = false;
let musicFading = null;

if (bgMusic) {
  bgMusic.volume = 0;
}

function createSparkleBurst(x, y, amount = 18, spread = 220) {
  if (!sparkles) return;

  for (let i = 0; i < amount; i++) {
    const spark = document.createElement("span");
    spark.classList.add("spark");

    const offsetX = (Math.random() - 0.5) * spread + "px";
    const offsetY = (Math.random() - 0.5) * spread + "px";

    spark.style.left = x + "px";
    spark.style.top = y + "px";
    spark.style.setProperty("--x", offsetX);
    spark.style.setProperty("--y", offsetY);

    const size = Math.random() * 7 + 3;
    spark.style.width = size + "px";
    spark.style.height = size + "px";
    spark.style.animationDuration = Math.random() * 1.2 + 1.1 + "s";

    sparkles.appendChild(spark);

    setTimeout(() => {
      spark.remove();
    }, 2400);
  }
}

function createAmbientSparkles(amount = 12) {
  for (let i = 0; i < amount; i++) {
    setTimeout(() => {
      createSparkleBurst(
        Math.random() * window.innerWidth,
        Math.random() * (window.innerHeight * 0.7),
        2,
        60
      );
    }, i * 180);
  }
}

function startTrail() {
  stopTrail();

  sparkleInterval = setInterval(() => {
    if (!harryWrapper) return;

    const rect = harryWrapper.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    createSparkleBurst(x, y, 6, 130);
  }, 90);
}

function stopTrail() {
  if (sparkleInterval) {
    clearInterval(sparkleInterval);
    sparkleInterval = null;
  }
}

function fadeInMusic(targetVolume = 0.5, step = 0.02, intervalTime = 160) {
  if (!bgMusic) return;

  if (musicFading) {
    clearInterval(musicFading);
    musicFading = null;
  }

  musicFading = setInterval(() => {
    if (!bgMusic) return;

    if (bgMusic.volume < targetVolume) {
      bgMusic.volume = Math.min(bgMusic.volume + step, targetVolume);
    } else {
      clearInterval(musicFading);
      musicFading = null;
    }
  }, intervalTime);
}

function playMusicFromInteraction() {
  if (!bgMusic) return;

  const source = bgMusic.querySelector("source");
  if (!source || !source.getAttribute("src")) return;

  if (!musicPlaying) {
    bgMusic
      .play()
      .then(() => {
        musicPlaying = true;
        fadeInMusic(0.5);

        if (musicBtn) {
          musicBtn.textContent = "🔇 Pausar";
        }
      })
      .catch(() => {
        // alguns navegadores podem bloquear dependendo da interação
      });
  }
}

function cinematicEntrance() {
  createAmbientSparkles(18);

  setTimeout(() => {
    createSparkleBurst(window.innerWidth * 0.2, window.innerHeight * 0.22, 5, 80);
    createSparkleBurst(window.innerWidth * 0.8, window.innerHeight * 0.18, 5, 80);
  }, 600);
}

function flyHarry() {
  if (hasFlown || !harryWrapper || !messageBox) return;
  hasFlown = true;

  playMusicFromInteraction();

  const rect = harryWrapper.getBoundingClientRect();
  const startX = rect.left + rect.width / 2;
  const startY = rect.top + rect.height / 2;

  createSparkleBurst(startX, startY, 80, 260);
  createSparkleBurst(startX, startY, 30, 120);
  startTrail();

  harryWrapper.classList.add("fly-away");

  setTimeout(() => {
    createSparkleBurst(
      startX + window.innerWidth * 0.08,
      startY - window.innerHeight * 0.14,
      30,
      180
    );
  }, 500);

  setTimeout(() => {
    stopTrail();
  }, 1850);

  setTimeout(() => {
    messageBox.classList.add("show");

    createSparkleBurst(window.innerWidth / 2, window.innerHeight * 0.76, 36, 220);

    setTimeout(() => {
      createSparkleBurst(window.innerWidth / 2, window.innerHeight * 0.7, 18, 140);
    }, 250);
  }, 1700);
}

function restartScene() {
  if (!harryWrapper || !messageBox) return;

  hasFlown = false;
  stopTrail();

  harryWrapper.classList.remove("fly-away");
  messageBox.classList.remove("show");

  void harryWrapper.offsetWidth;

  createSparkleBurst(window.innerWidth / 2, window.innerHeight / 2, 22, 180);
  createAmbientSparkles(10);
}

function toggleMusic() {
  if (!bgMusic) {
    alert("Elemento de áudio não encontrado no HTML.");
    return;
  }

  const source = bgMusic.querySelector("source");
  if (!source || !source.getAttribute("src")) {
    alert("Adicione um arquivo music.mp3 na pasta do projeto para usar a música.");
    return;
  }

  if (musicPlaying) {
    bgMusic.pause();
    musicPlaying = false;

    if (musicBtn) {
      musicBtn.textContent = "🔊 Música";
    }
  } else {
    bgMusic
      .play()
      .then(() => {
        musicPlaying = true;

        if (bgMusic.volume < 0.5) {
          fadeInMusic(0.5);
        }

        if (musicBtn) {
          musicBtn.textContent = "🔇 Pausar";
        }
      })
      .catch(() => {
        alert("O navegador bloqueou o áudio. Clique novamente para tocar a música.");
      });
  }
}

if (harryWrapper) {
  harryWrapper.addEventListener("click", flyHarry);
}

if (restartBtn) {
  restartBtn.addEventListener("click", restartScene);
}

if (musicBtn) {
  musicBtn.addEventListener("click", toggleMusic);
}

window.addEventListener("load", () => {
  cinematicEntrance();
});