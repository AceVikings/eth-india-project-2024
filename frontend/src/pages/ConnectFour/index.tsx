import {
  Abi,
  useAccount,
  useConnect,
  useContract,
  useReadContract,
  useSendTransaction,
} from "@starknet-react/core";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { connect4abi } from "../../data/abi";
import { CairoUint256 } from "starknet";
import { toast } from "react-toastify";
import { connect4Contract } from "../../data/contracts";
type Player = 1 | 2;
type Cell = Player | null;
type Board = Cell[][];

const Index = () => {
  const { gameId } = useParams();
  const { address } = useAccount();
  const { connect, connectors } = useConnect();
  const [myTurn, setMyTurn] = useState<boolean>(false);
  const [players, setPlayers] = useState<{
    player1: string;
    player2: string;
  }>({ player1: "", player2: "" });
  const ROWS = 6;
  const COLS = 7;

  const [board, setBoard] = useState<Board>(() =>
    Array(ROWS)
      .fill(null)
      .map(() => Array(COLS).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState<Player>(1);
  const [winner, setWinner] = useState<Player | null>(null);
  const selectedCol = useRef<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [hoverColumn, setHoverColumn] = useState<number | null>(null);
  const [previewRow, setPreviewRow] = useState<number | null>(null);
  const [currentCell, setCurrentCell] = useState<{
    row: number;
    col: number;
  } | null>();

  const convertToAddress = (CairoNumber: { high: string; low: string }) => {
    // Convert high and low parts to hexadecimal strings
    const highHex = CairoNumber.high.slice(2).padStart(32, "0");
    const lowHex = CairoNumber.low.slice(2).padStart(32, "0");
    // Concatenate high and low parts
    let address = highHex + lowHex;
    address = address.padStart(64, "0");
    return "0x" + address;
  };

  const { contract } = useContract({
    abi: connect4abi as Abi,
    address: connect4Contract,
  });
  const { send } = useSendTransaction({
    calls:
      contract && gameId && selectedCol.current !== null
        ? [contract.populate("make_move", [gameId, selectedCol.current])]
        : undefined,
    onSuccess(data, _, _) {
      console.log(data);
      toast.success(
        "Game created successfully!" + " Tx Hash:" + data.transaction_hash
      );
    },
    onError(error, _, _) {
      toast.error("Error making the move game");
      console.log(error);
    },
  });

  const { data: currentTurn } = useReadContract({
    abi: connect4abi as Abi,
    address: connect4Contract,
    functionName: "get_current_turn",
    args: [gameId],
    // enabled: !!address,
    watch: true,
    refetchInterval() {
      return 2000;
    },
  });

  const { data: player1 } = useReadContract({
    abi: connect4abi as Abi,
    address: connect4Contract,
    functionName: "get_player1",
    args: [gameId],
    enabled: address && !!gameId,
    watch: true,
    refetchInterval() {
      return 2000;
    },
  });

  const { data: player2 } = useReadContract({
    abi: connect4abi as Abi,
    address: connect4Contract,
    functionName: "get_player2",
    args: [gameId],
    enabled: address && !!gameId,
    watch: true,
    refetchInterval() {
      return 2000;
    },
  });

  const { data: boardData } = useReadContract({
    abi: connect4abi as Abi,
    address: connect4Contract,
    functionName: "get_board",
    args: [gameId],
    enabled: !!gameId,
    watch: true,
    refetchInterval() {
      return 2000;
    },
  });

  useEffect(() => {
    if (!boardData) return;
    const newBoard = Array.from({ length: 6 }, (_, rowIndex) =>
      boardData.slice(rowIndex * 7, rowIndex * 7 + 7)
    );
    setBoard(newBoard);
  }, [boardData]);

  useEffect(() => {
    if (!address) {
      connect({
        connector: connectors[0],
      });
    }
  }, [currentTurn]);

  useEffect(() => {
    if (!currentTurn) return;
    console.log(
      "HERE",
      convertToAddress(
        new CairoUint256(currentTurn).toUint256HexString()
      ).toLowerCase() === address?.toLowerCase(),
      address
    );
    if (
      convertToAddress(
        new CairoUint256(currentTurn).toUint256HexString()
      ).toLowerCase() === address?.toLowerCase()
    ) {
      console.log(
        "HERE",
        convertToAddress(
          new CairoUint256(currentTurn).toUint256HexString()
        ).toLowerCase() === address
      );
      setMyTurn(true);
    } else {
      setMyTurn(false);
    }
  }, [currentTurn, address]);

  useEffect(() => {
    if (!gameId || !player1 || !player2) return;
    setPlayers({
      player1: convertToAddress(new CairoUint256(player1).toUint256HexString()),
      player2: convertToAddress(new CairoUint256(player2).toUint256HexString()),
    });
  }, [gameId, player1, player2]);

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
    if (!myTurn) return;

    // Find the lowest empty cell in the column
    for (let row = ROWS - 1; row >= 0; row--) {
      if (!board[row][col]) {
        const newBoard = board.map((row) => [...row]);
        newBoard[row][col] = currentPlayer;
        setCurrentCell({ row, col });
        // setBoard(newBoard);

        break;
      }
    }
    selectedCol.current = col;
    send();
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
    if (!myTurn) return;
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
            {myTurn ? "Your Turn" : "Opponent's Turn"}
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
            {row.map((cell: any, colIndex) => (
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
                      parseInt(cell) === 1
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
                        convertToAddress(
                          new CairoUint256(currentTurn).toUint256HexString()
                        ).toLowerCase() === players.player1?.toLowerCase()
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
      <button
        onClick={() => {
          toast.success("Player reported successfully!");
        }}
        className="mt-4 px-8 py-3 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-semibold hover:scale-105 transition-transform"
      >
        Report Player
      </button>
      {/* Update reset button to match Home page style */}
      {/* <button
        onClick={resetGame}
        className="mt-4 px-8 py-3 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-semibold hover:scale-105 transition-transform"
      >
        Reset Game
      </button> */}
    </div>
  );
};

export default Index;
