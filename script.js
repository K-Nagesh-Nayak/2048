console.log("hello world");


  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-analytics.js";
  const firebaseConfig = {
    apiKey: "AIzaSyA3oj8c4jDv6CNJW9BFUPKqv_k0_22dqrI",
    authDomain: "leaderboard-74809.firebaseapp.com",
    databaseURL: "https://leaderboard-74809-default-rtdb.firebaseio.com",
    projectId: "leaderboard-74809",
    storageBucket: "leaderboard-74809.firebasestorage.app",
    messagingSenderId: "125184607307",
    appId: "1:125184607307:web:3544febd8418113f2939ce",
    measurementId: "G-9FK1CFM4NS"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
//   const analytics = getAnalytics(app);

import { getDatabase, ref, set, get,child, update, remove } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";

const db = getDatabase();






































var board;
var score = 0;
var rows = 4;
var columns = 4;
let bestScore = 0 ;
let gameOver = false;
const boardDiv = document.getElementById("board");

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

boardDiv.addEventListener("touchstart", function (e) {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}, false);

boardDiv.addEventListener("touchend", function (e) {
  touchEndX = e.changedTouches[0].screenX;
  touchEndY = e.changedTouches[0].screenY;
  handleSwipe();
}, false);

function handleSwipe() {
  const dx = touchEndX - touchStartX;
  const dy = touchEndY - touchStartY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 50) {
      console.log("Swiped Right");
      slideRight(); setTwo(); checkForgameOver(); updateScore();
    } else if (dx < -50) {
      console.log("Swiped Left");
      
      slideLeft(); setTwo(); checkForgameOver();updateScore();
    }
  } else {
    if (dy > 50) {
      console.log("Swiped Down");
      slideDown(); setTwo(); checkForgameOver(); updateScore();

    } else if (dy < -50) {
      console.log("Swiped Up");
      slideUp(); setTwo(); checkForgameOver();updateScore();
    }
  }
}


let bestPlayer = localStorage.getItem("username");
let logout = document.getElementById("logout");

logout.addEventListener("click", function () {
    let confirm = window.confirm("Are you sure you want to logout?");
    if (confirm == false) {
        return;
    }else{
    localStorage.removeItem("username");
    localStorage.removeItem("bestScore");
    window.location.reload();
    }
})

window.onload = function () {

   if(bestPlayer == null || bestPlayer == undefined || bestPlayer == ""){
    let plyer = prompt("Enter username", "Guest");
    document.getElementById("bestPlayer").innerText = plyer;
    localStorage.setItem("username", plyer);

    }

    set(ref(db, 'users/' + localStorage.getItem("username")), {username: localStorage.getItem("username"), score: localStorage.getItem("bestScore")});
    

    setGame();
showLeaderboard() 
    
}

bestPlayer = localStorage.getItem("username");
 bestScore = localStorage.getItem("bestScore");
document.getElementById("bestPlayer").innerText = bestPlayer;
document.getElementById("bestScore").innerText = bestScore;

function setGame() {
    // board = [
    //     [2, 2, 2, 2],
    //     [2, 2, 2, 2],
    //     [4, 4, 8, 8],
    //     [4, 4, 8, 8]
    // ];

    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }
    //create 2 to begin the game
    setTwo();
    setTwo();

}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = ""; //clear the classList
    tile.classList.add("tile");
    if (num > 0) {
         
        tile.innerText = num.toString();
        if (num <= 4096) {
            tile.classList.add("x"+num.toString());
        } else {
            tile.classList.add("x8192");
        }                
    }
}

let left=document.getElementById("left");
let right=document.getElementById("right");
let up=document.getElementById("up");
let down=document.getElementById("down");

left.addEventListener("click", () => {slideLeft(); setTwo(); checkForgameOver(); updateScore();});
right.addEventListener("click", () => {slideRight(); setTwo(); checkForgameOver();updateScore();});
up.addEventListener("click", () => {slideUp(); setTwo(); checkForgameOver();updateScore();});
down.addEventListener("click", () => {slideDown(); setTwo(); checkForgameOver();updateScore();});


document.addEventListener('keyup', (e) => {
    if (e.code == "ArrowLeft") {
        slideLeft();
        setTwo();
    }
    else if (e.code == "ArrowRight") {
        slideRight();
        setTwo();
    }
    else if (e.code == "ArrowUp") {
        slideUp();
        setTwo();

    }
    else if (e.code == "ArrowDown") {
        slideDown();
        setTwo();
    }
    updateScore();

    checkForgameOver();
})

function updateScore() {
    document.getElementById("score").innerText = score;
}

function checkForgameOver() {
    if (!hasEmptyTile() && noMovesAvailable()) {
        setTimeout(() => {
            alert("Game Over!");
        }, 100);
    }
}

function filterZero(row){
    return row.filter(num => num != 0); //create new array of all nums != 0
}

function slide(row) {
    //[0, 2, 2, 2] 
    row = filterZero(row); //[2, 2, 2]
    for (let i = 0; i < row.length-1; i++){
        if (row[i] == row[i+1]) {
            row[i] *= 2;
            row[i+1] = 0;
            score += row[i];
            showLeaderboard() 
            if(score > bestScore){
                
                bestScore = score;
                localStorage.setItem("bestScore", bestScore);
                update(ref(db, 'users/' + localStorage.getItem("username")), {score: localStorage.getItem("bestScore")});
                document.getElementById("bestScore").innerText = bestScore;
            }
        }
    } //[4, 0, 2]
    row = filterZero(row); //[4, 2]
    //add zeroes
    while (row.length < columns) {
        row.push(0);
    } //[4, 2, 0, 0]
    return row;
}

function slideLeft() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row = slide(row);
        board[r] = row;
        for (let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            
            updateTile(tile, num);
        }
    }
}

function slideRight() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];         //[0, 2, 2, 2]
        row.reverse();              //[2, 2, 2, 0]
        row = slide(row)            //[4, 2, 0, 0]
        board[r] = row.reverse();   //[0, 0, 2, 4];
        for (let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideUp() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);
        // board[0][c] = row[0];
        // board[1][c] = row[1];
        // board[2][c] = row[2];
        // board[3][c] = row[3];
        for (let r = 0; r < rows; r++){
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideDown() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();
        // board[0][c] = row[0];
        // board[1][c] = row[1];
        // board[2][c] = row[2];
        // board[3][c] = row[3];
        for (let r = 0; r < rows; r++){
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function setTwo() {
    if (!hasEmptyTile()) {
        // alert("no empty tiles");
        return;
    }
    let found = false;
    while (!found) {
        //find random row and column to place a 2 in
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] == 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}

function hasEmptyTile() {
    let count = 0;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] == 0) { //at least one zero in the board
                return true;
            }
        }
    }
    return false;
}


function showLeaderboard() {
    const deref = ref(db);

    get(deref).then((snapshot) => {
        if (snapshot.exists()) {
            let data = snapshot.val();
            let players = Object.values(data);
            displayLeaderboard(players); 
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error("Error fetching data:", error);
    });
}


function displayLeaderboard(players) {


    let playersArray = [];
    players.forEach(entry => {
        for (let key in entry) {
            if (entry[key] && typeof entry[key] === "object" && entry[key].score != null) {
                playersArray.push({
                    username: entry[key].username || key,
                    score: Number(entry[key].score)
                });
            }
        }
    });

    playersArray.sort((a, b) => b.score - a.score);
    console.log("Sorted leaderboard:", playersArray);

    const list = document.getElementById("leaderboard");
    list.innerHTML = "";

    playersArray.forEach((player, index) => {
        const li = document.createElement("li");
        li.textContent = `${index + 1}. ${player.username}: ${player.score}`;
        list.appendChild(li);
    });
}


function noMovesAvailable() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let current = board[r][c];
            if (r < rows - 1 && board[r + 1][c] === current) return false; // vertical
            if (c < columns - 1 && board[r][c + 1] === current) return false; // horizontal
        }
    }
    return true; // no adjacent matches
}


document.getElementById("toggleLeaderboardBtn").addEventListener("click", () => {
    const leaderboard = document.getElementById("leaderboardContainer");
    leaderboard.classList.toggle("show");
  });
  
