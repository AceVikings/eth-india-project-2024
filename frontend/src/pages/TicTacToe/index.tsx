import { useState } from "react";

type Player = "X" | "O" | null;
type Board = Player[][];

const TicTacToe = () => {
  const [board, setBoard] = useState<Board>(Array(3).fill(Array(3).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [winner, setWinner] = useState<Player | null>(null);
  const [gameOver, setGameOver] = useState(false);

  const checkWin = (board: Board): Player | null => {
    const lines = [
      // Rows
      [board[0][0], board[0][1], board[0][2]],
      [board[1][0], board[1][1], board[1][2]],
      [board[2][0], board[2][1], board[2][2]],
      // Columns
      [board[0][0], board[1][0], board[2][0]],
      [board[0][1], board[1][1], board[2][1]],
      [board[0][2], board[1][2], board[2][2]],
      // Diagonals
      [board[0][0], board[1][1], board[2][2]],
      [board[0][2], board[1][1], board[2][0]],
    ];

    for (const line of lines) {
      if (line[0] && line[0] === line[1] && line[0] === line[2]) {
        return line[0];
      }
    }

    return null;
  };

  const handleClick = (row: number, col: number) => {
    if (gameOver || board[row][col]) return;

    const newBoard = board.map((r, rowIndex) =>
      r.map((cell, colIndex) =>
        rowIndex === row && colIndex === col ? currentPlayer : cell
      )
    );

    setBoard(newBoard);

    const winner = checkWin(newBoard);
    if (winner) {
      setWinner(winner);
      setGameOver(true);
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  };

  const resetGame = () => {
    setBoard(Array(3).fill(Array(3).fill(null)));
    setCurrentPlayer("X");
    setWinner(null);
    setGameOver(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex flex-col items-center justify-center p-4">
      <div className="mb-4">
        {!gameOver ? (
          <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Player {currentPlayer}'s Turn
          </h2>
        ) : (
          <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            {winner ? `Player ${winner} Wins!` : "Game Over!"}
          </h2>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleClick(rowIndex, colIndex)}
              className="w-24 h-24 bg-white/10 m-1 rounded-lg flex items-center justify-center cursor-pointer text-4xl font-bold text-white"
            >
              {cell}
            </div>
          ))
        )}
      </div>

      <button
        onClick={resetGame}
        className="mt-4 px-8 py-3 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-semibold hover:scale-105 transition-transform"
      >
        Reset Game
      </button>
    </div>
  );
};

export default TicTacToe;
