import { useState, useEffect } from "react";

type Player = 1 | 2;
type Cell = Player | null;
type Board = Cell[][];

const Index = () => {
  const ROWS = 6;
  const COLS = 7;

  const [board, setBoard] = useState<Board>(() =>
    Array(ROWS)
      .fill(null)
      .map(() => Array(COLS).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState<Player>(1);
  const [winner, setWinner] = useState<Player | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [hoverColumn, setHoverColumn] = useState<number | null>(null);
  const [previewRow, setPreviewRow] = useState<number | null>(null);
  const [currentCell, setCurrentCell] = useState<{
    row: number;
    col: number;
  } | null>();
  const checkWin = (row: number, col: number, player: Player): boolean => {
    console.log("Checking win for player", player);
    console.log(board);
    // Horizontal check
    for (let c = 0; c <= COLS - 4; c++) {
      if (
        board[row][c] === player &&
        board[row][c + 1] === player &&
        board[row][c + 2] === player &&
        board[row][c + 3] === player
      ) {
        return true;
      }
    }

    // Vertical check
    for (let r = 0; r <= ROWS - 4; r++) {
      if (
        board[r][col] === player &&
        board[r + 1][col] === player &&
        board[r + 2][col] === player &&
        board[r + 3][col] === player
      ) {
        console.log("Vertical win");
        return true;
      }
    }

    // Diagonal checks
    // Check for diagonals from top-left to bottom-right
    for (let r = 0; r <= ROWS - 4; r++) {
      for (let c = 0; c <= COLS - 4; c++) {
        if (
          board[r][c] === player &&
          board[r + 1][c + 1] === player &&
          board[r + 2][c + 2] === player &&
          board[r + 3][c + 3] === player
        ) {
          return true;
        }
      }
    }

    // Check for diagonals from bottom-left to top-right
    for (let r = 3; r < ROWS; r++) {
      for (let c = 0; c <= COLS - 4; c++) {
        if (
          board[r][c] === player &&
          board[r - 1][c + 1] === player &&
          board[r - 2][c + 2] === player &&
          board[r - 3][c + 3] === player
        ) {
          return true;
        }
      }
    }

    return false;
  };

  const dropPiece = (col: number) => {
    if (gameOver) return;

    // Find the lowest empty cell in the column
    for (let row = ROWS - 1; row >= 0; row--) {
      if (!board[row][col]) {
        const newBoard = board.map((row) => [...row]);
        newBoard[row][col] = currentPlayer;
        setCurrentCell({ row, col });
        setBoard(newBoard);

        break;
      }
    }
  };

  useEffect(() => {
    if (!currentCell) return;
    if (checkWin(currentCell?.row, currentCell?.col, currentPlayer)) {
      console.log("Player", currentPlayer, "wins!");
      setWinner(currentPlayer);
      setGameOver(true);
    } else {
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    }
  }, [board]);

  const handleColumnHover = (colIndex: number) => {
    if (gameOver) return;

    setHoverColumn(colIndex);
    // Find the lowest empty cell in the column
    for (let row = ROWS - 1; row >= 0; row--) {
      if (!board[row][colIndex]) {
        setPreviewRow(row);
        break;
      }
    }
  };

  const resetGame = () => {
    setBoard(
      Array(ROWS)
        .fill(null)
        .map(() => Array(COLS).fill(null))
    );
    setCurrentPlayer(1);
    setWinner(null);
    setGameOver(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex flex-col items-center justify-center p-4">
      <div className="mb-4">
        {!gameOver ? (
          // Update text colors to use gradient like Home page
          <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Player {currentPlayer}'s Turn
          </h2>
        ) : (
          <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            {winner ? `Player ${winner} Wins!` : "Game Over!"}
          </h2>
        )}
      </div>

      {/* Update game board colors */}
      <div className="bg-black/20 p-4 rounded-lg">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => dropPiece(colIndex)}
                onMouseEnter={() => handleColumnHover(colIndex)}
                onMouseLeave={() => {
                  setHoverColumn(null);
                  setPreviewRow(null);
                }}
                className="w-16 h-16 bg-white/10 m-1 rounded-full flex items-center justify-center cursor-pointer"
              >
                {cell ? (
                  <div
                    className={`w-14 h-14 rounded-full ${
                      cell === 1
                        ? "bg-gradient-to-r from-emerald-400 to-cyan-400"
                        : "bg-gradient-to-r from-yellow-400 to-orange-400"
                    }`}
                  />
                ) : (
                  // Preview token
                  hoverColumn === colIndex &&
                  previewRow === rowIndex && (
                    <div
                      className={`w-14 h-14 rounded-full opacity-30 ${
                        currentPlayer === 1
                          ? "bg-gradient-to-r from-emerald-400 to-cyan-400"
                          : "bg-gradient-to-r from-yellow-400 to-orange-400"
                      }`}
                    />
                  )
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Update reset button to match Home page style */}
      <button
        onClick={resetGame}
        className="mt-4 px-8 py-3 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-semibold hover:scale-105 transition-transform"
      >
        Reset Game
      </button>
    </div>
  );
};

export default Index;
