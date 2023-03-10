const gameBoard = (function () {
  let boardSquares = [null, null, null, null, null, null, null, null, null];
  const renderMovement = () => {
    const nodesTableCell = document.querySelectorAll("td");
    for (let index = 0; index < nodesTableCell.length; index++) {
      nodesTableCell[index].textContent = boardSquares[index];
    }
    nodesTableCell.forEach((element) => {
      element.addEventListener("click", () => {
        occupyBoard(element.id, player1.symbol);
      });
    });
  };
  const resetGameBoard = () => {
    boardSquares = [null, null, null, null, null, null, null, null, null];
    renderMovement();
    return { boardSquares };
  };
  const occupyBoard = (index, symbol) => {
    if (symbol.toUpperCase() === "X" || symbol.toUpperCase() === "O") {
      boardSquares[index] = symbol.toUpperCase();
      renderMovement();
      return boardSquares;
    }
    return "Please select correct symbol!";
  };

  return { resetGameBoard, occupyBoard };
})();
const playerFactory = (name, symbol) => {
  let wins = 0;
  let losses = 0;
  const win = () => wins++;
  const lose = () => losses--;
  const getWins = () => wins;
  const getLosses = () => losses;
  return { name, symbol, win, lose, getWins, getLosses };
};

gameBoard.resetGameBoard();
const enemyAI = playerFactory("computer", "O");
const player1 = playerFactory("randomDude", "X");

// Symbol selection
(function () {
  const symbolButton = document.querySelector(".symbol");
  if (
    !(
      gameBoard.boardSquares.includes("X") ||
      gameBoard.boardSquares.includes("O")
    )
  ) {
  }
  symbolButton.innerHTML = player1.symbol;
  symbolButton.addEventListener("click", () => {
    console.log(player1.symbol);
    if (player1.symbol === "X") {
      player1.symbol = "O";
      enemyAI.symbol = "X";
    } else {
      player1.symbol = "X";
      enemyAI.symbol = "O";
    }
    symbolButton.innerHTML = player1.symbol;
  });

  return {};
})();

// Game Logic
(function () {
  // if ate least 1 cell is occupied player can no longer change symbol!
})();

/*
gameboard is represented as array with 9 indexes.

Table wraps every 3 indexes: 
0, 1, 2, wrap>
3, 4, 5, wrap>
6, 7, 8, END

Index occupied with null means that position is empty.
If all spaces are occupied null that means start of the game.
X = square is occupied with X
O = square is occupied with O
when no null places exists game is finished.

*/
/* GAME LOGIC
Objectiv of the game is to set 3 of your symbols in single row horizontal, vertical or diagonal.
If no one succeds and board is full there it results in draw.

single cell cannot be occupied twice. once its occupied it remains so till end of the round.



 PVE MODE
there are 2 player
one ofe them is computer and second one a human player.
human always plays with X's

first move  on first round always makes player with X's
every second round other player makes first move like so: 1 round X, 2 round O, 3 round X
human and computer always play in tours.


*/
