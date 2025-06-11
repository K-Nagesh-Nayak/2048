// Firebase setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getDatabase, ref, set, get, update } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyA3oj8c4jDv6CNJW9BFUPKqv_k0_22dqrI",
  authDomain: "leaderboard-74809.firebaseapp.com",
  databaseURL: "https://leaderboard-74809-default-rtdb.firebaseio.com",
  projectId: "leaderboard-74809",
  storageBucket: "leaderboard-74809.appspot.com",
  messagingSenderId: "125184607307",
  appId: "1:125184607307:web:3544febd8418113f2939ce",
  measurementId: "G-9FK1CFM4NS"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

let currentUser = null;
let score = 0;
let bestScore = 0;

const boardSize = 4;
let board = [];

// DOM Elements
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const loginModal = document.getElementById("loginModal");
const closeModal = document.getElementById("closeModal");
const loginForm = document.getElementById("loginForm");
const leaderboardList = document.getElementById("leaderboard");

loginBtn.addEventListener("click", () => loginModal.style.display = "block");
// closeModal.addEventListener("click", () => loginModal.style.display = "none");
// logoutBtn.addEventListener("click", () => {
//   signOut(auth);
//   location.reload();
// });

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const username = document.getElementById("username").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      currentUser = userCredential.user;
      fetchUserData();
    })
    .catch(() => {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          currentUser = userCredential.user;
          set(ref(db, 'users/' + currentUser.uid), {
            username: username,
            email: email,
            score: 0
          });
          fetchUserData();
        });
    });
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    fetchUserData();
  }
});

function fetchUserData() {
  get(ref(db, 'users/' + currentUser.uid)).then((snapshot) => {
    const data = snapshot.val();
    document.getElementById("bestPlayer").textContent = data.username;
    bestScore = Number(data.score);
    document.getElementById("bestScore").textContent = bestScore;
  });
}

function updateScoreIfHigher(newScore) {
  if (currentUser && newScore > bestScore) {
    bestScore = newScore;
    update(ref(db, 'users/' + currentUser.uid), { score: bestScore });
    document.getElementById("bestScore").textContent = bestScore;
  }
}

function showLeaderboard() {
  get(ref(db, 'users')).then((snapshot) => {
    const users = snapshot.val();
    const scores = Object.values(users).sort((a, b) => b.score - a.score);

    leaderboardList.innerHTML = "";
    scores.forEach((user, i) => {
      const li = document.createElement("li");
      li.textContent = `${i + 1}. ${user.username}: ${user.score}`;
      leaderboardList.appendChild(li);
    });
  });
}

// ------------------ GAME LOGIC ------------------
function initBoard() {
  board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));
  score = 0;
  placeRandom();
  placeRandom();
  renderBoard();
}

function renderBoard() {
  const boardDiv = document.getElementById("board");
  boardDiv.innerHTML = "";
  board.forEach((row, r) => {
    row.forEach((val, c) => {
      const tile = document.createElement("div");
      tile.className = `tile ${val ? 'x' + val : ''}`;
      tile.textContent = val || "";
      tile.id = `${r}-${c}`;
      boardDiv.appendChild(tile);
    });
  });
  document.getElementById("score").textContent = score;
  updateScoreIfHigher(score);
  showLeaderboard();
}

function placeRandom() {
  const empty = [];
  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      if (board[r][c] === 0) empty.push([r, c]);
    }
  }
  if (empty.length === 0) return;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  board[r][c] = 2;
}

function slide(row) {
  row = row.filter(v => v);
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      score += row[i];
      row[i + 1] = 0;
    }
  }
  return row.filter(v => v).concat(Array(boardSize - row.filter(v => v).length).fill(0));
}

function rotateBoard(clockwise = true) {
  const newBoard = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));
  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      newBoard[c][clockwise ? boardSize - 1 - r : r] = board[r][c];
    }
  }
  board = newBoard;
}

function moveLeft() {
  board = board.map(row => slide(row));
  placeRandom();
  renderBoard();
}

function moveRight() {
  board = board.map(row => slide(row.reverse()).reverse());
  placeRandom();
  renderBoard();
}

function moveUp() {
  rotateBoard(false);
  moveLeft();
  rotateBoard();
}

function moveDown() {
  rotateBoard(false);
  moveRight();
  rotateBoard();
}

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowLeft": moveLeft(); break;
    case "ArrowRight": moveRight(); break;
    case "ArrowUp": moveUp(); break;
    case "ArrowDown": moveDown(); break;
  }
});

window.onload = () => initBoard();
