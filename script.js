// Récupération des éléments
const board = document.getElementById('game-board');
const resetBtn = document.getElementById('reset');
const timerDisplay = document.getElementById('timer');
const movesDisplay = document.getElementById('moves');
const victoryMessage = document.getElementById('victory-message');

// Thèmes disponibles
const themes = {
  animaux: ['🐶', '🐱', '🐰', '🦊', '🐼', '🐸', '🐵', '🦁'],
  fruits: ['🍎', '🍌', '🍓', '🍉', '🍇', '🍍', '🥝', '🍒'],
  emotions: ['😀', '😢', '😡', '😍', '😱', '😴', '🤪', '🤔'],
  vehicules: ['🚗', '🚕', '🚙', '🚓', '🚑', '🚒', '🚜', '✈️'],
  chiffres: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣']
};

// Variables de jeu
let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let moves = 0;
let seconds = 0;
let timer;

// Mélange d'un tableau
 function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Création du plateau
function createBoard() {
  const theme = document.getElementById('theme').value;
  const emojis = themes[theme];
  const pairs = shuffle([...emojis, ...emojis]);

  board.innerHTML = '';
  cards = [];
  moves = 0;
  seconds = 0;
  clearInterval(timer);
  timerDisplay.textContent = `Temps : 0s`;
  movesDisplay.textContent = `Coups : 0`;
  victoryMessage.innerText = '';

  pairs.forEach((emoji, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.emoji = emoji;
    card.dataset.index = index;
    card.innerText = '';
    card.addEventListener('click', handleCardClick);
    board.appendChild(card);
    cards.push(card);
  });

  startTimer();
}

// Chronomètre
function startTimer() {
  timer = setInterval(() => {
    seconds++;
    timerDisplay.textContent = `Temps : ${seconds}s`;
  }, 1000);
}

// Gestion des clics
function handleCardClick(e) {
  if (lockBoard) return;

  const clicked = e.target;
  if (clicked.classList.contains('revealed') || clicked === firstCard) return;

  clicked.innerText = clicked.dataset.emoji;
  clicked.classList.add('revealed');

  if (!firstCard) {
    firstCard = clicked;
    return;
  }

  secondCard = clicked;
  lockBoard = true;

  moves++;
  movesDisplay.textContent = `Coups : ${moves}`;

  if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    resetTurn();
  } else {
    setTimeout(() => {
      firstCard.innerText = '';
      secondCard.innerText = '';
      firstCard.classList.remove('revealed');
      secondCard.classList.remove('revealed');
      resetTurn();
    }, 1000);
  }

  // Vérification de la victoire
  if (cards.every(card => card.classList.contains('matched'))) {
    clearInterval(timer);
    victoryMessage.innerText = `🎉 Vous avez gagné ! 🎉 Temps : ${seconds}s | Coups : ${moves}`;
  }
}

// Réinitialisation du tour
function resetTurn() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

// Événements
resetBtn.addEventListener('click', createBoard);
document.getElementById('theme').addEventListener('change', createBoard);

// Lancer la première partie
createBoard();