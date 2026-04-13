/* ===============================
   QUOTES (FRONT PAGE)
================================ */
const quotes = [
  ["Strategy requires thought, tactics require observation.", "Max Euwe"],
  ["Play is the highest form of research.", "Albert Einstein"],
  ["Games give you a chance to excel.", "Gary Gygax"],
  ["In every game, the best move is not obvious.", "Magnus Carlsen"],
  ["A game is a puzzle that plays back.", "Sid Meier"],
  ["Every move counts.", "Classic Proverb"],
  ["Simple rules create complex strategy.", "Game Design Quote"],
  ["You learn more from losing than winning.", "Unknown"]
];

const quote = quotes[Math.floor(Math.random() * quotes.length)];
document.getElementById("quoteText").textContent = `"${quote[0]}"`;
document.getElementById("quoteAuthor").textContent = `— ${quote[1]}`;

/* ===============================
   ELEMENT REFERENCES
================================ */
const startScreen  = document.getElementById("startScreen");
const gameScreen   = document.getElementById("gameScreen");
const boardEl      = document.getElementById("board");

const turnBanner   = document.getElementById("turnBanner");
const playerXCard  = document.getElementById("playerX");
const playerOCard  = document.getElementById("playerO");

const withdrawBtn  = document.getElementById("withdrawBtn");
const restartBtn   = document.getElementById("restartBtn");

const rulesModal   = document.getElementById("rulesModal");
const settingsModal= document.getElementById("settingsModal");
const summaryModal = document.getElementById("summaryModal");

const summaryTitle   = document.getElementById("summaryTitle");
const summaryDetails = document.getElementById("summaryDetails");

/* ===============================
   GAME STATE
================================ */
let size = 0;
let board = [];
let currentPlayer = "X";
let gameActive = false;
let moveCount = 0;

/* ===============================
   SOUND SETUP
================================ */
const tapSound  = new Audio("sounds/tap.mp3");
const winSound  = new Audio("sounds/win.mp3");
const music     = new Audio("sounds/music.mp3");

music.loop = true;
music.volume = 0.4;

/* ===============================
   START GAME
================================ */
function startGame(selectedSize) {
  size = selectedSize;
  board = Array(size * size).fill("");
  currentPlayer = "X";
  gameActive = true;
  moveCount = 0;

  withdrawBtn.classList.add("hidden");
  restartBtn.classList.add("hidden");

  buildBoard();
  updateTurnUI();

  startScreen.classList.remove("active");
  gameScreen.classList.add("active");
}

/* ===============================
   BUILD BOARD
================================ */
function buildBoard() {
  boardEl.innerHTML = "";
  boardEl.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = i;

    cell.addEventListener("mouseenter", () => showPreview(cell, i));
    cell.addEventListener("mouseleave", () => clearPreview(cell, i));
    cell.addEventListener("click", () => handleMove(cell, i));

    boardEl.appendChild(cell);
  }
}

/* ===============================
   PREVIEW (HOVER / TOUCH)
================================ */
function showPreview(cell, index) {
  if (!gameActive || board[index] !== "") return;
  cell.textContent = currentPlayer;
  cell.classList.add("preview");
}

function clearPreview(cell, index) {
  if (cell.classList.contains("preview")) {
    cell.textContent = "";
    cell.classList.remove("preview");
  }
}

/* ===============================
   HANDLE MOVE
================================ */
function handleMove(cell, index) {
  if (!gameActive || board[index] !== "") return;

  board[index] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.remove("preview");

  tapSound.currentTime = 0;
  tapSound.play();

  moveCount++;
  withdrawBtn.classList.remove("hidden");

  if (checkWin()) {
    endGame(`Player ${currentPlayer} Wins!`);
    return;
  }

  if (moveCount === size * size) {
    endGame("It's a Draw!");
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateTurnUI();
}

/* ===============================
   TURN UI
================================ */
function updateTurnUI() {
  turnBanner.textContent = `Player ${currentPlayer}'s Turn`;

  playerXCard.classList.toggle("active", currentPlayer === "X");
  playerOCard.classList.toggle("active", currentPlayer === "O");

  playerXCard.querySelector(".status").textContent =
    currentPlayer === "X" ? "Playing" : "Waiting";
  playerOCard.querySelector(".status").textContent =
    currentPlayer === "O" ? "Playing" : "Waiting";
}

/* ===============================
   WIN CHECK
================================ */
function checkWin() {
  const lines = [];

  // rows
  for (let r = 0; r < size; r++) {
    lines.push([...Array(size)].map((_, i) => r * size + i));
  }

  // columns
  for (let c = 0; c < size; c++) {
    lines.push([...Array(size)].map((_, i) => i * size + c));
  }

  // diagonals
  lines.push([...Array(size)].map((_, i) => i * (size + 1)));
  lines.push([...Array(size)].map((_, i) => (i + 1) * (size - 1)));

  return lines.some(line =>
    line.every(index => board[index] === currentPlayer)
  );
}

/* ===============================
   END GAME
================================ */
function endGame(message) {
  gameActive = false;

  winSound.currentTime = 0;
  winSound.play();

  summaryTitle.textContent = message;
  summaryDetails.textContent =
    `Board: ${size} × ${size} | Moves: ${moveCount}`;

  summaryModal.classList.remove("hidden");
  restartBtn.classList.remove("hidden");
}

/* ===============================
   CONTROLS
================================ */
function withdrawGame() {
  endGame("Game Withdrawn");
}

function restartGame() {
  location.reload();
}

/* ===============================
   MODALS
================================ */
function openRules() {
  rulesModal.classList.remove("hidden");
  gameActive = false;
}

function closeRules() {
  rulesModal.classList.add("hidden");
  gameActive = true;
}

function openSettings() {
  settingsModal.classList.remove("hidden");
  gameActive = false;
}

function closeSettings() {
  settingsModal.classList.add("hidden");
  gameActive = true;
}

/* ===============================
   SETTINGS CONTROLS
================================ */
function toggleTapSound(el) {
  tapSound.muted = !el.checked;
}

function toggleWinSound(el) {
  winSound.muted = !el.checked;
}

function toggleMusic(el) {
  if (el.checked) {
    music.play();
  } else {
    music.pause();
  }
}

function setMusicVolume(el) {
  music.volume = el.value;
}
