console.log("hello world");


import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getDatabase, ref, set, get, child, update, remove } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-database.js";

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
const auth = getAuth(app);
const db = getDatabase();



onAuthStateChanged(auth, (user) => {
    if (user) {
        const uid = user.uid;
        localStorage.setItem("uid", uid);

        if (uid !== "2fIJHo7Cisdpj5pwS2M7w7vAAJa2") {
            // Freeze functions to prevent tampering
            document.addEventListener('contextmenu', (e) => e.preventDefault());

            // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
            document.addEventListener('keydown', (e) => {
                if (
                    e.key === 'F12' ||
                    (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
                    (e.ctrlKey && e.key === 'U')
                ) {
                    e.preventDefault();
                    alert("Dev tools access is restricted.");
                }
            });

            console.log("Function protection active for non-admin user.");
        } else {
            console.log("Admin UID detected — function freezing skipped.");
        }
    } else {
        console.warn("User not logged in — function protection not applied.");
    }
});

















var board;
var score = 0;
var rows = 4;
var columns = 4;
let bestScore = 0;
let gameOver = false;
const boardDiv = document.getElementById("board");
let bestPlayer = localStorage.getItem("username");

const uid = localStorage.getItem("uid");
const username = localStorage.getItem("username");

const signupBtn = document.getElementById("signupBtn");
const modal = document.getElementById("loginModal");
const closeModal = document.getElementById("closeModal");
const loginForm = document.getElementById("loginForm");



signupBtn.addEventListener("click", () => {
    if (modal.style.display === "none") {
        modal.style.display = "block";
    } else {
        modal.style.display = "none";
    }
});

closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

const isSignup = document.getElementById("isSignup");
const usernameContainer = document.getElementById("usernameContainer");

isSignup.addEventListener("change", () => {
    usernameContainer.style.display = isSignup.checked ? "block" : "none";
});



const submit = document.getElementById("submit");
submit.addEventListener("click", (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const isSignup = document.getElementById("isSignup").checked;

    if (isSignup) {
        // SIGN UP
        const username = document.getElementById("username").value.trim();

        if (!username) {
            alert("Please enter a username.");
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                const uid = user.uid;

                set(ref(db, "users/" + uid), {
                    username: username,
                    email: email,
                    topScores: [0, 0, 0, 0, 0]
                });

                alert("User created successfully!");
                localStorage.setItem("uid", uid);
                localStorage.setItem("username", username);
                modal.style.display = "none";
            })
            .catch((error) => {
                alert(error.message);
            });

    } else {
        // LOGIN
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                const uid = user.uid;
                localStorage.setItem("uid", uid);

                get(ref(db, "users/" + uid)).then((snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        localStorage.setItem("username", data.username);

                        // Get the highest score from topScores array
                        if (Array.isArray(data.topScores) && data.topScores.length > 0) {
                            const best = Math.max(...data.topScores);
                            localStorage.setItem("bestScore", best);
                        } else {
                            localStorage.setItem("bestScore", 0);
                        }
                    }
                });

                alert("Logged in successfully!");
                modal.style.display = "none";
            })
            .catch((error) => {
                alert(error.message);
            });
    }
});




// logout.addEventListener("click", function () {
//     let confirm = window.confirm("Are you sure you want to logout?");
//     if (confirm == false) {
//         return;
//     }else{
//     localStorage.removeItem("username");
//     localStorage.removeItem("bestScore");
//     window.location.reload();
//     }
// })

window.onload = function () {

    // if (bestPlayer == null || bestPlayer == undefined || bestPlayer == "") {
    //     let plyer = prompt("Enter username", "Guest");
    //     document.getElementById("bestPlayer").innerText = plyer;
    //     localStorage.setItem("username", plyer);

    // }

    // set(ref(db, 'users/' + localStorage.getItem("username")), { username: localStorage.getItem("username"), score: localStorage.getItem("bestScore") });


    setGame();

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

    setTwo();
    setTwo();
    showLeaderboard()
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = ""; //clear the classList
    tile.classList.add("tile");
    if (num > 0) {

        tile.innerText = num.toString();
        if (num <= 4096) {
            tile.classList.add("x" + num.toString());
        } else {
            tile.classList.add("x8192");
        }
    }
}

let left = document.getElementById("left");
let right = document.getElementById("right");
let up = document.getElementById("up");
let down = document.getElementById("down");

left.addEventListener("click", () => { slideLeft(); setTwo(); checkForgameOver(); updateScore(); });
right.addEventListener("click", () => { slideRight(); setTwo(); checkForgameOver(); updateScore(); });
up.addEventListener("click", () => { slideUp(); setTwo(); checkForgameOver(); updateScore(); });
down.addEventListener("click", () => { slideDown(); setTwo(); checkForgameOver(); updateScore(); });


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
            alert("Game Over! Your score: " + score);
            onGameOver(score);  // ⬅️ Save to top 5 in Firebase
        }, 100);
    }
}

function filterZero(row) {
    return row.filter(num => num != 0); //create new array of all nums != 0
}

function slide(row) {
    //[0, 2, 2, 2] 
    row = filterZero(row); //[2, 2, 2]
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] == row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            console.log(board)
            score += row[i];
            showLeaderboard()
            let cachedBest = Number(localStorage.getItem("bestScore") || 0);
            if (score > cachedBest) {

                bestScore = score;

                localStorage.setItem("bestScore", score);
                document.getElementById("bestScore").innerText = score;
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
        for (let c = 0; c < columns; c++) {
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
        for (let c = 0; c < columns; c++) {
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
        for (let r = 0; r < rows; r++) {
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
        for (let r = 0; r < rows; r++) {
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
    console.log("deref", deref);
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

function onGameOver(finalScore) {
    updateScoreIfTop5(finalScore); // Only push if top 5-worthy
    document.getElementById("bestScore").innerText = finalScore; // Optional UI update
}

function updateScoreIfTop5(score) {
    const uid = localStorage.getItem("uid");
    if (!uid) return;

    const userRef = ref(db, `users/${uid}`);

    get(userRef).then(snapshot => {
        if (!snapshot.exists()) return;

        const userData = snapshot.val();
        let topScores = userData.topScores || [];

        // Ensure exactly 5 elements
        while (topScores.length < 5) topScores.push(0);

        const minTopScore = Math.min(...topScores);

        // Only update if new score is higher than the lowest
        if (score > minTopScore) {
            topScores.push(score);
            topScores.sort((a, b) => b - a);  // Descending
            topScores = topScores.slice(0, 5); // Keep only top 5

            update(userRef, { topScores })
                .then(() => console.log("Top 5 updated:", topScores))
                .catch(err => console.error("Update failed:", err));
        } else {
            console.log("Score not high enough to enter top 5.");
        }
    });
}



let logoutBtn = document.getElementById("logoutBtn").addEventListener("click", logout);

function logout() {
    const confirmLogout = confirm("Are you sure you want to log out?");

    if (confirmLogout) {
        localStorage.removeItem("uid");
        localStorage.removeItem("username");
        localStorage.removeItem("bestScore");

        location.reload(); // or redirect if you prefer
        alert("You have been logged out.");
    }
}