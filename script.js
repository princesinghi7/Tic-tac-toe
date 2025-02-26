const board = document.getElementById("board");
let gameBoard = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameMode = "player";
let gameOver = false;

function startGame(mode) {
    gameMode = mode;
    resetGame();
}

function resetGame() {
    gameBoard.fill("");
    currentPlayer = "X";
    gameOver = false;
    document.getElementById("status").textContent = "Player X's Turn";
    board.innerHTML = "";

    for (let i = 0; i < 9; i++) {
        let cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = i;
        cell.addEventListener("click", handleMove);
        board.appendChild(cell);
    }
}

function handleMove(event) {
    if (gameOver) return;

    let index = event.target.dataset.index;
    if (gameBoard[index] !== "") return;

    gameBoard[index] = currentPlayer;
    event.target.textContent = currentPlayer;
    event.target.classList.add("taken");

    if (checkWinner(currentPlayer)) {
        document.getElementById("status").textContent = `Player ${currentPlayer} Wins!`;
        gameOver = true;
        return;
    }

    if (!gameBoard.includes("")) {
        document.getElementById("status").textContent = "It's a Draw!";
        gameOver = true;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    document.getElementById("status").textContent = `Player ${currentPlayer}'s Turn`;

    if (gameMode === "ai" && currentPlayer === "O") {
        setTimeout(aiMove, 500);
    }
}

function aiMove() {
    let bestMove = minimax(gameBoard, "O").index;
    gameBoard[bestMove] = "O";
    let cell = document.querySelector(`[data-index='${bestMove}']`);
    cell.textContent = "O";
    cell.classList.add("taken");

    if (checkWinner("O")) {
        document.getElementById("status").textContent = "Player O Wins!";
        gameOver = true;
        return;
    }

    if (!gameBoard.includes("")) {
        document.getElementById("status").textContent = "It's a Draw!";
        gameOver = true;
        return;
    }

    currentPlayer = "X";
    document.getElementById("status").textContent = `Player ${currentPlayer}'s Turn`;
}

function checkWinner(player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    return winPatterns.some(pattern => pattern.every(index => gameBoard[index] === player));
}

function minimax(boardState, player) {
    let emptyIndexes = boardState.map((v, i) => v === "" ? i : null).filter(v => v !== null);

    if (checkWinner("X")) return { score: -10 };
    if (checkWinner("O")) return { score: 10 };
    if (emptyIndexes.length === 0) return { score: 0 };

    let moves = [];

    for (let i of emptyIndexes) {
        let move = { index: i };
        boardState[i] = player;

        let result = minimax(boardState, player === "O" ? "X" : "O");
        move.score = result.score;

        boardState[i] = "";
        moves.push(move);
    }

    return moves.reduce((best, move) => 
        (player === "O" ? move.score > best.score : move.score < best.score) ? move : best
    );
}

resetGame();
