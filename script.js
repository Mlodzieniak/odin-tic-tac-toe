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
    if (
      symbol.toLowerCase() === "x" ||
      symbol.toLowerCase() === "o" ||
      symbol === ""
    ) {
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
// this factory is only for minimax algorithm
const gameBoardFactory = (board) => {
  const cells = [...board];
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
};

const playerFactory = (name, symbol) => {
  let wins = 0;
  function win() {
    wins += 1;
  }
  function getWins() {
    return `${wins}`;
  }
  function resetWins() {
    wins = 0;
  }
  return { win, getWins, resetWins, name, symbol };
};
const players = [playerFactory("player", "x"), playerFactory("enemy", "o")];

const logic = (function () {
  // players cannot make 2 moves one after another. they need to take turns
  const playerWithXsymbol = players.find((element) => element.symbol === "x");
  const playerWithOsymbol = players.find((element) => element.symbol === "o");

  function nextMoveBelongsTo(boardToCheck) {
    const count = {};
    boardToCheck.forEach((element) => {
      count[element] = (count[element] || 0) + 1;
    });
    if (count[""] === 9 || count[""] % 2 === 1) {
      return playerWithXsymbol;
    }
    return playerWithOsymbol;
  }

  function checkForWinner(boardToCheck) {
    // 3 same symbols in a row equals win
    const cell = boardToCheck.readCell;
    function checkRow() {
      for (let index = 0; index < 7; index += 1) {
        if (index === 0 || index === 3 || index === 6) {
          if (cell(index) !== "") {
            if (
              cell(index) === cell(index + 1) &&
              cell(index) === cell(index + 2)
            ) {
              return {
                symbol: boardToCheck.readCell(index),
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
              symbol: boardToCheck.readCell(index),
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
                symbol: boardToCheck.readCell(index),
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
                symbol: boardToCheck.readCell(index),
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
    if (checkForWinner(gameBoard)) {
      if (checkForWinner(gameBoard).symbol === "x") {
        playerWithXsymbol.win();
      }
      if (checkForWinner(gameBoard).symbol === "o") {
        playerWithOsymbol.win();
      }
    }
  }
  function checkForTie(boardToCheck) {
    if (!boardToCheck.print().includes("") && !checkForWinner(boardToCheck)) {
      console.log("tie");
      return true;
    }
  }

  function colorWinningCells() {
    const cells = document.querySelectorAll("td");
    if (logic.checkForWinner(gameBoard)) {
      logic.checkForWinner(gameBoard).indexes.forEach((square) => {
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

// DOM
const dom = (function () {
  const cells = document.querySelectorAll("td");
  const nextGameBTN = document.querySelector(".finishBTN");
  const player1 = document.querySelector("#player1");
  const player2 = document.querySelector("#player2");
  const player = document.querySelectorAll(".player");
  const openPopupBTN = document.querySelectorAll("[data-popup-target]");
  const closePopupBTN = document.querySelectorAll("[data-startgame-button]");
  const overlay = document.getElementById("overlay");
  const gameModeRadioBTN = document.querySelectorAll("input[name='gamemode']");
  const dumbAIRadioBTN = document.getElementById("randomai");
  const dominatorRadioBTN = document.getElementById("dominator");
  const player1SetName = document.getElementById("player1-setname");
  const player2SetName = document.getElementById("player2-setname");

  // Functions
  function updatePlayersScore() {
    player1.querySelector(".player-score").textContent = players[0].getWins();
    player2.querySelector(".player-score").textContent = players[1].getWins();
    player.forEach((selectedPlayer) => {
      if (selectedPlayer.querySelector(".player-score").textContent === "1") {
        selectedPlayer.querySelector(".point-or-points").textContent = "point";
      } else {
        selectedPlayer.querySelector(".point-or-points").textContent = "points";
      }
    });
  }
  function startNewGame() {
    nextGameBTN.setAttribute("disabled", "");
    gameBoard.unFreeze();
    cells.forEach((element) => {
      element.textContent = "";
      element.classList.remove("winner");
    });
  }
  function openPopup(popup) {
    if (popup == null) return;
    popup.classList.add("active");
    overlay.classList.add("active");
  }
  function closePopup(popup) {
    if (popup == null) return;
    popup.classList.remove("active");
    overlay.classList.remove("active");
    player1.querySelector(".player-name").textContent = player1SetName.value;
    player2.querySelector(".player-name").textContent = player2SetName.value;
  }
  function resetScoreBoard() {
    players.forEach((playerToReset) => {
      playerToReset.resetWins();
    });
  }
  function selectGameMode(button) {
    if (button.value === "pvp") {
      player2SetName.removeAttribute("disabled");
      player2SetName.value = "Player 2";
    } else if (button.value === "randomai") {
      player2SetName.setAttribute("disabled", "");
      player2SetName.value = "Dumb AI";
    } else if (button.value === "dominator") {
      player2SetName.setAttribute("disabled", "");
      player2SetName.value = "Dominator AI";
    }
    resetScoreBoard();
    updatePlayersScore();
  }
  function occupyCell(cell) {
    const nextSymbol = logic.nextMoveBelongsTo(gameBoard.print()).symbol;
    if (gameBoard.occupy(cell.id, nextSymbol)) {
      cell.textContent = nextSymbol;
    }
  }
  function roundChecker() {
    if (logic.checkForWinner(gameBoard) || logic.checkForTie(gameBoard)) {
      logic.colorWinningCells();
      logic.addPointForWinningPlayer();
      gameBoard.freeze();
      nextGameBTN.removeAttribute("disabled");
      updatePlayersScore();
    }
  }
  function dumbAI() {
    function randomCell(array) {
      const randomEmptyCell = array
        .map((element, index) => (element === "" ? index : null))
        .filter((element) => element !== null);
      const cellID =
        randomEmptyCell[Math.floor(Math.random() * randomEmptyCell.length)];
      return document.getElementById(cellID);
    }
    if (dumbAIRadioBTN.checked) {
      occupyCell(randomCell(gameBoard.print()));
      roundChecker();
    }
  }
  function dominator(board) {
    const rootBoard = gameBoardFactory(board.print());
    // for any empty cell store cell's index inside it
    function emptyCellsWithIndexes(initialBoard) {
      return initialBoard
        .print()
        .map((element, index) => (element === "" ? index : element))
        .filter((cell) => typeof cell === "number");
    }

    function minimax(initialBoard) {
      const currentMark = logic.nextMoveBelongsTo(initialBoard.print()).symbol;
      const availCellsIndexes = emptyCellsWithIndexes(initialBoard);
      if (logic.checkForWinner(initialBoard) && currentMark === "o") {
        return { score: -1 };
      }
      if (logic.checkForWinner(initialBoard) && currentMark === "x") {
        return { score: 1 };
      }
      if (logic.checkForTie(initialBoard)) {
        return { score: 0 };
      }
      const allTestPlayInfos = [];
      let bestTestPlay = null;
      for (let i = 0; i < availCellsIndexes.length; i += 1) {
        const currentTestPlayInfo = {};
        // zapisujemy obceny stan przed symulacja
        currentTestPlayInfo.index = initialBoard.print()[availCellsIndexes[i]];
        // initialBoard[availCellsIndexes[i]] = currentMark;
        // podstawiamy symbol
        console.log("state before");
        console.log(initialBoard.print());
        initialBoard.occupy(availCellsIndexes[i], currentMark);
        // przywołujemy rekursywnie minimax
        console.log("state after first occupy");
        console.log(initialBoard.print());
        const result = minimax(initialBoard);
        console.log(result);
        // zapisujemy wynik z symulowanego ruchu w obiekcie
        currentTestPlayInfo.score = result.score;
        // przywaracamy board sprzed symulacji
        console.log(currentTestPlayInfo);
        initialBoard.occupy(availCellsIndexes[i], currentTestPlayInfo.index);
        console.log("state after second occupy");
        console.log(initialBoard.print());
        allTestPlayInfos.push(currentTestPlayInfo);
      }
      if (currentMark === "o") {
        let bestScore = -1000;
        for (let i = 0; i < allTestPlayInfos.length; i += 1) {
          if (allTestPlayInfos[i].score > bestScore) {
            bestScore = allTestPlayInfos[i].score;
            bestTestPlay = i;
          }
        }
      } else {
        let bestScore = 1000;
        for (let i = 0; i < allTestPlayInfos.length; i += 1) {
          if (allTestPlayInfos[i].score < bestScore) {
            bestScore = allTestPlayInfos[i].score;
            bestTestPlay = i;
          }
        }
      }
      return allTestPlayInfos[bestTestPlay];
    }
    // emptyCellsWithIndexes.forEach((cell) => {
    //   minimax(rootBoard, cell);
    // });
    minimax(rootBoard);
  }
  gameBoard.occupy(0, "x");
  gameBoard.occupy(2, "o");
  gameBoard.occupy(3, "x");
  gameBoard.occupy(6, "o");
  gameBoard.occupy(5, "x");
  gameBoard.occupy(7, "o");
  dominator(gameBoard);

  // Eventlisteners
  nextGameBTN.addEventListener("click", () => startNewGame());
  cells.forEach((element) => {
    element.addEventListener("click", () => {
      occupyCell(element);
      roundChecker();
      if (logic.nextMoveBelongsTo(gameBoard.print()).symbol === "o") {
        dumbAI();
      }
    });
  });
  openPopupBTN.forEach((button) => {
    button.addEventListener("click", () => {
      const popup = document.querySelector(button.dataset.popupTarget);
      openPopup(popup);
    });
  });
  closePopupBTN.forEach((button) => {
    button.addEventListener("click", () => {
      const popup = button.closest(".popup");
      closePopup(popup);
    });
  });
  gameModeRadioBTN.forEach((button) => {
    button.addEventListener("click", () => selectGameMode(button));
  });
  openPopupBTN[0].click();
  return { dominator };
})();

/*
We need to provide current state of board to dominator function.
This function return best possible move i.e. index of empty cell that 
is supposed to be occupied by computer. 

^HOW TO DO IT?^

*/
