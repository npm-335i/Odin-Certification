const Gameboard = (() => {
  let board = Array(9).fill("");

  const getBoard = () => board;

  const resetBoard = () => {
    board = Array(9).fill("");
  };

  const setMark = (index, marker) => {
    if (index < 0 || index > 8 || board[index] !== "") {
      return false;
    }

    board[index] = marker;

    return true;
  };

  const getMark = (index) => board[index];

  const isBoardFull = () => board.every((cell) => cell !== "");

  const checkWinner = () => {
    const patterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    return (
      patterns.find(
        ([a, b, c]) =>
          board[a] && board[a] === board[b] && board[a] === board[c],
      ) || null
    );
  };

  return {
    getBoard,
    resetBoard,
    setMark,
    getMark,
    isBoardFull,
    checkWinner,
  };
})();

function createPlayer(name, marker) {
  return {
    name,
    marker,
  };
}

const GameController = (() => {
  let playerX;
  let playerO;

  let currentPlayer;

  let gameActive = false;

  let winner = null;

  let winCells = null;

  const boardEl = document.getElementById("boardContainer");

  const statusEl = document.getElementById("statusDisplay");

  const startBtn = document.getElementById("startBtn");

  const resetBtn = document.getElementById("resetBtn");

  const playerXInput = document.getElementById("playerXName");

  const playerOInput = document.getElementById("playerOName");

  function renderBoard() {
    boardEl.innerHTML = Gameboard.getBoard()
      .map((mark, index) => {
        let classes = "cell";

        if (mark) {
          classes += " taken";

          classes += mark === "X" ? " x-move" : " o-move";
        }

        if (winCells && winCells.includes(index)) {
          classes += " win-highlight";
        }

        return `
          <div
            class="${classes}"
            data-index="${index}">
            ${mark}
          </div>
        `;
      })
      .join("");
  }

  function updateStatus() {
    if (!gameActive) {
      if (winner === "tie") {
        statusEl.innerHTML = `
          <span class="winner-msg">
            Game ended in a draw
          </span>
        `;

        return;
      }

      if (winner) {
        const player = winner === "X" ? playerX : playerO;

        statusEl.innerHTML = `
          <span class="winner-msg">
            ${player.name}
            <span>wins</span>
          </span>
        `;

        return;
      }

      statusEl.innerHTML = `
        <span>
          Start the game to begin
        </span>
      `;

      return;
    }

    statusEl.innerHTML = `
      <span class="turn-indicator">
        ${currentPlayer.marker}
      </span>

      <span>
        ${currentPlayer.name}'s turn
      </span>
    `;
  }

  function switchPlayer() {
    currentPlayer = currentPlayer === playerX ? playerO : playerX;
  }

  function checkGameOver() {
    const winningPattern = Gameboard.checkWinner();

    if (winningPattern) {
      winner = Gameboard.getMark(winningPattern[0]);

      winCells = winningPattern;

      gameActive = false;

      return true;
    }

    if (Gameboard.isBoardFull()) {
      winner = "tie";

      gameActive = false;

      return true;
    }

    return false;
  }

  function handleCellClick(event) {
    if (!gameActive) return;

    const index = Number(event.target.dataset.index);

    if (!Gameboard.setMark(index, currentPlayer.marker)) {
      return;
    }

    if (checkGameOver()) {
      renderBoard();
      updateStatus();

      return;
    }

    switchPlayer();

    renderBoard();

    updateStatus();
  }

  function startGame() {
    playerX = createPlayer(playerXInput.value.trim() || "Player X", "X");

    playerO = createPlayer(playerOInput.value.trim() || "Player O", "O");

    Gameboard.resetBoard();

    currentPlayer = playerX;

    winner = null;

    winCells = null;

    gameActive = true;

    renderBoard();

    updateStatus();
  }

  function resetGame() {
    Gameboard.resetBoard();

    winner = null;

    winCells = null;

    gameActive = false;

    renderBoard();

    updateStatus();
  }

  function init() {
    resetGame();

    boardEl.addEventListener("click", handleCellClick);

    startBtn.addEventListener("click", startGame);

    resetBtn.addEventListener("click", resetGame);
  }

  return {
    init,

    startGame,

    resetGame,

    getState() {
      return {
        playerX,
        playerO,
        currentPlayer,
        gameActive,
        winner,
        winCells,
      };
    },
  };
})();

document.addEventListener("DOMContentLoaded", () => {
  GameController.init();

  window.GameController = GameController;

  window.Gameboard = Gameboard;
});
