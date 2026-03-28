const itens = [
  { titulo: "Seu sorriso", texto: "Amanda, tem algo no seu sorriso que deixa tudo mais leve." },
  { titulo: "Seu jeito", texto: "Eu gosto do seu jeito porque você consegue ser leve e marcante." },
  { titulo: "Sua voz", texto: "Sua voz tem algo que passa uma calma boa." },
  { titulo: "Sua energia", texto: "Você tem uma energia boa que aparece nos detalhes." },
  { titulo: "Seu olhar", texto: "Seu olhar chama atenção sem esforço." },
  { titulo: "Seu humor", texto: "Seu jeito de rir deixa tudo melhor." },
  { titulo: "Jogar com você", texto: "Uma das coisas que eu mais gosto é jogar com você." },
  { titulo: "Nossas partidas", texto: "Nem importa ganhar ou perder, só jogar com você já vale." },
  { titulo: "Sua companhia", texto: "No fim, é a sua companhia que faz tudo ser diferente." },
  { titulo: "Você", texto: "Amanda, você é especial de um jeito único." }
];

const openButton = document.getElementById("openButton");
const contentSection = document.getElementById("contentSection");
const cardsContainer = document.getElementById("cardsContainer");
const finalBox = document.getElementById("finalBox");
const hearts = document.getElementById("hearts");

function criarCoracao() {
  const heart = document.createElement("span");
  heart.className = "heart-float";
  heart.innerHTML = ["❤", "♡", "♥"][Math.floor(Math.random() * 3)];

  heart.style.left = Math.random() * 100 + "vw";
  heart.style.fontSize = 14 + Math.random() * 20 + "px";
  heart.style.animationDuration = 4 + Math.random() * 4 + "s";

  hearts.appendChild(heart);

  setTimeout(() => heart.remove(), 8000);
}

setInterval(criarCoracao, 600);

function criarCards() {
  itens.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-top">
        <span class="number">${String(index + 1).padStart(2, "0")}</span>
        <span class="heart">♡</span>
      </div>
      <h2>${item.titulo}</h2>
      <p>${item.texto}</p>
    `;
    cardsContainer.appendChild(card);

    setTimeout(() => {
      card.classList.add("show");
      card.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 1200 * index);
  });

  setTimeout(() => {
    finalBox.classList.add("show");
  }, 1200 * itens.length);
}

openButton.addEventListener("click", () => {
  contentSection.classList.remove("hidden");
  criarCards();
  contentSection.scrollIntoView({ behavior: "smooth" });
});