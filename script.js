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
    if (count.null === 9 || count.null % 2 === 1) {
      return playerWithXsymbol;
    }
    return playerWithOsymbol;
  }

  // 3 same symbols in a row equals win
  function checkRow() {
    for (let index = 0; index < 9; index += 1) {
      const cell = gameBoard.readCell;
      if (!cell(index).isEmpty()) {
        return cell(index) === cell(index + 1);
      }
    }
  }
  // 3 same symbols in a colum equals win
  // 3 same symbols diagonaly equals win
  return { nextMoveBelongsTo, checkRow };
})();
gameBoard.occupy(0, "x");
gameBoard.occupy(1, "x");
gameBoard.occupy(2, "x");
