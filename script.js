const gameBoard = (function () {
  const cells = Array(9).fill("");
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
      if (cells[index] === "") {
        cells[index] = symbol.toLowerCase();
      }
    }
  }
  return { reset, print, readCell, occupy };
})();

const playerFactory = (name, symbol) => {
  let wins = 0;
  let losses = 0;
  function win() {
    wins += 1;
  }
  function lose() {
    losses += 1;
  }
  function printRecord() {
    return `${name} has won ${wins} and lost ${losses} games`;
  }
  return { win, lose, printRecord, name, symbol };
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
      for (let index = 0; index < 9; index += 1) {
        if (index === 0 || index === 3 || index === 6) {
          if (!cell(index).isEmpty) {
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
        if (!cell(index).isEmpty) {
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
          if (!cell(index).isEmpty) {
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
          if (!cell(index).isEmpty) {
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
  return {
    nextMoveBelongsTo,
    checkForWinner,
  };
})();
gameBoard.occupy(0, "o");
gameBoard.occupy(3, "o");
gameBoard.occupy(4, "x");

gameBoard.occupy(6, "x");
gameBoard.occupy(7, "o");
gameBoard.occupy(8, "o");
