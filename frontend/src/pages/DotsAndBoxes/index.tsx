import { useState } from "react";

type Player = 1 | 2;
type Line = Player | null;
type Box = Player | null;

const DotsAndBoxes = () => {
  const GRID_SIZE = 4; // This creates a 4x4 grid of dots (3x3 boxes)

  const [horizontalLines, setHorizontalLines] = useState<Line[][]>(
    Array(GRID_SIZE + 1)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(null))
  );

  const [verticalLines, setVerticalLines] = useState<Line[][]>(
    Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE + 1).fill(null))
  );

  const [boxes, setBoxes] = useState<Box[][]>(
    Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(null))
  );

  const [currentPlayer, setCurrentPlayer] = useState<Player>(1);
  const [scores, setScores] = useState({ 1: 0, 2: 0 });
  const [gameOver, setGameOver] = useState(false);

  const checkBox = (
    row: number,
    col: number,
    newHorizontalLines: Line[][],
    newVerticalLines: Line[][]
  ) => {
    let boxCompleted = false;

    // Check if box can be completed
    if (
      newHorizontalLines[row][col] !== null &&
      newHorizontalLines[row + 1][col] !== null &&
      newVerticalLines[row][col] !== null &&
      newVerticalLines[row][col + 1] !== null
    ) {
      boxCompleted = true;
    }

    return boxCompleted;
  };

  const handleLineClick = (row: number, col: number, isHorizontal: boolean) => {
    if (gameOver) return;

    // Copy current line states
    const newHorizontalLines = horizontalLines.map((row) => [...row]);
    const newVerticalLines = verticalLines.map((row) => [...row]);
    const newBoxes = boxes.map((row) => [...row]);

    // If line already exists, return
    if (isHorizontal) {
      if (newHorizontalLines[row][col] !== null) return;
      newHorizontalLines[row][col] = currentPlayer;
    } else {
      if (newVerticalLines[row][col] !== null) return;
      newVerticalLines[row][col] = currentPlayer;
    }

    let boxesCompleted = false;

    // Check for completed boxes
    if (isHorizontal) {
      // Check box above if exists
      if (row > 0) {
        if (checkBox(row - 1, col, newHorizontalLines, newVerticalLines)) {
          newBoxes[row - 1][col] = currentPlayer;
          boxesCompleted = true;
        }
      }
      // Check box below if exists
      if (row < GRID_SIZE) {
        if (checkBox(row, col, newHorizontalLines, newVerticalLines)) {
          newBoxes[row][col] = currentPlayer;
          boxesCompleted = true;
        }
      }
    } else {
      // Check box to the left if exists
      if (col > 0) {
        if (checkBox(row, col - 1, newHorizontalLines, newVerticalLines)) {
          newBoxes[row][col - 1] = currentPlayer;
          boxesCompleted = true;
        }
      }
      // Check box to the right if exists
      if (col < GRID_SIZE) {
        if (checkBox(row, col, newHorizontalLines, newVerticalLines)) {
          newBoxes[row][col] = currentPlayer;
          boxesCompleted = true;
        }
      }
    }

    // Update scores if boxes were completed
    if (boxesCompleted) {
      setScores((prev) => ({
        ...prev,
        [currentPlayer]: prev[currentPlayer] + 1,
      }));
    }

    // Update game state
    setHorizontalLines(newHorizontalLines);
    setVerticalLines(newVerticalLines);
    setBoxes(newBoxes);

    // Change player if no boxes were completed
    if (!boxesCompleted) {
      setCurrentPlayer(currentPlayer === 1 ? 2 : 1);
    }

    // Check if game is over
    const totalBoxes = GRID_SIZE * GRID_SIZE;
    if (scores[1] + scores[2] + 1 >= totalBoxes) {
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setHorizontalLines(
      Array(GRID_SIZE + 1)
        .fill(null)
        .map(() => Array(GRID_SIZE).fill(null))
    );
    setVerticalLines(
      Array(GRID_SIZE)
        .fill(null)
        .map(() => Array(GRID_SIZE + 1).fill(null))
    );
    setBoxes(
      Array(GRID_SIZE)
        .fill(null)
        .map(() => Array(GRID_SIZE).fill(null))
    );
    setCurrentPlayer(1);
    setScores({ 1: 0, 2: 0 });
    setGameOver(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex flex-col items-center justify-center p-4">
      <div className="mb-8 space-y-4 text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          {gameOver
            ? `Game Over! ${
                scores[1] > scores[2] ? "Player 1" : "Player 2"
              } Wins!`
            : `Player ${currentPlayer}'s Turn`}
        </h2>
        <div className="text-white">
          Player 1: {scores[1]} | Player 2: {scores[2]}
        </div>
      </div>

      <div className="relative bg-gray-800/50 p-12 rounded-lg">
        <div
          className="relative grid"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE + 1}, 20px)`,
            gap: "64px",
          }}
        >
          {Array(GRID_SIZE + 1)
            .fill(null)
            .map((_, row) =>
              Array(GRID_SIZE + 1)
                .fill(null)
                .map((_, col) => (
                  <div key={`${row}-${col}`} className="relative w-4 h-4">
                    {/* Dot */}
                    <div className="absolute w-4 z-10 h-4 bg-white rounded-full" />

                    {/* Horizontal Line */}
                    {col < GRID_SIZE && (
                      <div
                        onClick={() => handleLineClick(row, col, true)}
                        className={`absolute top-1/2 left-2 w-[80px] h-2 -translate-y-1/2 cursor-pointer transition-colors ${
                          horizontalLines[row][col]
                            ? horizontalLines[row][col] === 1
                              ? "bg-gradient-to-r from-emerald-400 to-cyan-400"
                              : "bg-gradient-to-r from-yellow-400 to-orange-400"
                            : "bg-white/10 hover:bg-white/30"
                        }`}
                      />
                    )}

                    {/* Vertical Line */}
                    {row < GRID_SIZE && (
                      <div
                        onClick={() => handleLineClick(row, col, false)}
                        className={`absolute top-2 left-1/2 h-[80px] w-2 -translate-x-1/2 cursor-pointer transition-colors ${
                          verticalLines[row][col]
                            ? verticalLines[row][col] === 1
                              ? "bg-gradient-to-r from-emerald-400 to-cyan-400"
                              : "bg-gradient-to-r from-yellow-400 to-orange-400"
                            : "bg-white/10 hover:bg-white/30"
                        }`}
                      />
                    )}

                    {/* Box */}
                    {row < GRID_SIZE && col < GRID_SIZE && (
                      <div
                        className={`absolute top-3 left-3 w-[80px] h-[80px] transition-colors ${
                          boxes[row][col]
                            ? boxes[row][col] === 1
                              ? "bg-gradient-to-r from-emerald-400/50 to-cyan-400/50"
                              : "bg-gradient-to-r from-yellow-400/50 to-orange-400/50"
                            : ""
                        }`}
                      />
                    )}
                  </div>
                ))
            )}
        </div>
      </div>

      <button
        onClick={resetGame}
        className="mt-8 px-8 py-3 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-semibold hover:scale-105 transition-transform"
      >
        Reset Game
      </button>
    </div>
  );
};

export default DotsAndBoxes;
