const gameBoard = (function () {
  // eslint-disable-next-line prefer-const
  let cells = Array(9).fill("");
  Object.seal(cells);
  function reset() {
    cells.fill("");
  }
  function print() {
    return cells;
  }
  function readCell(index) {
    return cells[index];
  }
  function occupy(index, symbol) {
    if (symbol.toLowerCase() === "x" || symbol.toLowerCase() === "o") {
      if (cells[index] === "" && !Object.isFrozen(cells)) {
        cells[index] = symbol.toLowerCase();
        return true;
      }
    }
  }
  function freeze() {
    cells.fill("");
    Object.freeze(cells);
  }
  function unFreeze() {
    cells = [...cells];
    Object.seal(cells);
  }
  return { reset, print, readCell, occupy, freeze, unFreeze };
})();

const playerFactory = (name, symbol) => {
  let wins = 0;
  function win() {
    wins += 1;
  }
  function getWins() {
    return `${wins}`;
  }
  return { win, getWins, name, symbol };
};
const players = [playerFactory("player", "x"), playerFactory("enemy", "o")];

const logic = (function () {
  // players cannot make 2 moves one after another. they need to take turns
  const playerWithXsymbol = players.find((element) => element.symbol === "x");
  const playerWithOsymbol = players.find((element) => element.symbol === "o");

  function nextMoveBelongsTo() {
    const count = {};
    gameBoard.print().forEach((element) => {
      count[element] = (count[element] || 0) + 1;
    });
    if (count[""] === 9 || count[""] % 2 === 1) {
      return playerWithXsymbol;
    }
    return playerWithOsymbol;
  }

  function checkForWinner() {
    // 3 same symbols in a row equals win
    const cell = gameBoard.readCell;
    function checkRow() {
      for (let index = 0; index < 7; index += 1) {
        if (index === 0 || index === 3 || index === 6) {
          if (cell(index) !== "") {
            if (
              cell(index) === cell(index + 1) &&
              cell(index) === cell(index + 2)
            ) {
              return {
                symbol: gameBoard.readCell(index),
                indexes: [index, index + 1, index + 2],
              };
            }
          }
        }
      }
    }
    // 3 same symbols in a colum equals win
    function checkColumn() {
      for (let index = 0; index < 3; index += 1) {
        if (cell(index) !== "") {
          if (
            cell(index) === cell(index + 3) &&
            cell(index) === cell(index + 6)
          ) {
            return {
              symbol: gameBoard.readCell(index),
              indexes: [index, index + 3, index + 6],
            };
          }
        }
      }
    }
    // 3 same symbols diagonaly equals win
    function checkDiagonal() {
      for (let index = 0; index < 9; index += 1) {
        if (index === 0) {
          if (cell(index) !== "") {
            if (
              cell(index) === cell(index + 4) &&
              cell(index) === cell(index + 8)
            ) {
              return {
                symbol: gameBoard.readCell(index),
                indexes: [index, index + 4, index + 8],
              };
            }
          }
        } else if (index === 2) {
          if (cell(index) !== "") {
            if (
              cell(index) === cell(index + 2) &&
              cell(index) === cell(index + 4)
            ) {
              return {
                symbol: gameBoard.readCell(index),
                indexes: [index, index + 2, index + 4],
              };
            }
          }
        }
      }
    }
    return checkRow() || checkColumn() || checkDiagonal();
  }
  function addPointForWinningPlayer() {
    if (checkForWinner()) {
      if (checkForWinner().symbol === "x") {
        playerWithXsymbol.win();
      }
      if (checkForWinner().symbol === "o") {
        playerWithOsymbol.win();
      }
    }
  }
  function checkForTie() {
    if (!gameBoard.print().includes("") && !checkForWinner()) {
      console.log("tie");
      return true;
    }
  }

  function colorWinningCells() {
    const cells = document.querySelectorAll("td");
    if (logic.checkForWinner()) {
      logic.checkForWinner().indexes.forEach((square) => {
        cells.forEach((element2) => {
          if (parseInt(element2.id, 10) === square) {
            element2.classList.add("winner");
          }
        });
      });
    }
  }

  return {
    nextMoveBelongsTo,
    checkForWinner,
    addPointForWinningPlayer,
    checkForTie,
    colorWinningCells,
  };
})();
// game DOM
(function () {
  const cells = document.querySelectorAll("td");
  const nextGameBTN = document.querySelector(".finish");
  const player1 = document.querySelector("#player1");
  const player2 = document.querySelector("#player2");
  const player = document.querySelector(".player");
  function updatePlayersScore() {
    player1.querySelector(".player-score").textContent = players[0].getWins();
    player2.querySelector(".player-score").textContent = players[1].getWins();
    if (player.querySelector(".player-score").textContent === "1") {
      player.querySelector(".point-or-points").textContent = "point";
    } else {
      player.querySelector(".point-or-points").textContent = "points";
    }
  }
  function startNewGame() {
    nextGameBTN.setAttribute("disabled", "");
    gameBoard.unFreeze();
    cells.forEach((element) => {
      element.textContent = "";
      element.classList.remove("winner");
    });
  }
  nextGameBTN.addEventListener("click", () => startNewGame());
  cells.forEach((element) => {
    element.addEventListener("click", () => {
      const nextSymbol = logic.nextMoveBelongsTo().symbol;
      if (gameBoard.occupy(element.id, nextSymbol)) {
        element.textContent = nextSymbol;
      }
      if (logic.checkForWinner() || logic.checkForTie()) {
        logic.colorWinningCells();
        logic.addPointForWinningPlayer();
        gameBoard.freeze();
        nextGameBTN.removeAttribute("disabled");
        updatePlayersScore();
      }
    });
  });
})();
// gameBoard.occupy(0, "o");
// gameBoard.occupy(3, "o");
// gameBoard.occupy(4, "x");

// gameBoard.occupy(6, "x");
// gameBoard.occupy(7, "o");
// gameBoard.occupy(8, "o");
