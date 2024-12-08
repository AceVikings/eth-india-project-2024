import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useAccount,
  useConnect,
  useSendTransaction,
  useContract,
  Abi,
  useReadContract,
} from "@starknet-react/core";
import { CairoUint256 } from "starknet";
import { connect4abi } from "../../data/abi";
import { connect4Contract } from "../../data/contracts";
const GameLobby = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const [friendAddress, setFriendAddress] = useState("");
  const { connect, connectors } = useConnect({});
  const [players, setPlayers] = useState<{
    player1: string;
    player2: string;
  }>({ player1: "", player2: "" });
  const { account, address } = useAccount();
  const { contract } = useContract({
    abi: connect4abi as Abi,
    address: connect4Contract,
  });
  const { send } = useSendTransaction({
    calls:
      contract && friendAddress
        ? [contract.populate("create_game", [friendAddress])]
        : undefined,
    onSuccess(data, variables, context) {
      console.log(data);
      toast.success(
        "Game created successfully!" + " Tx Hash:" + data.transaction_hash
      );
    },
    onError(error, variables, context) {
      toast.error("Error creating game");
    },
  });

  const { data: isPlayerInGame } = useReadContract({
    abi: connect4abi as Abi,
    address: connect4Contract,
    functionName: "is_player_in_game",
    args: [address],
    enabled: !!address,
    // watch: true,
    refetchInterval(query) {
      return 2000;
    },
  });

  const { data: playerGameId } = useReadContract({
    abi: connect4abi as Abi,
    address: connect4Contract,
    functionName: "get_player_gameId",
    args: [address],
    enabled: !!address && !!isPlayerInGame,
    watch: true,
    refetchInterval(query) {
      return 2000;
    },
  });

  const { data: player1 } = useReadContract({
    abi: connect4abi as Abi,
    address: connect4Contract,
    functionName: "get_player1",
    args: [playerGameId],
    enabled: address && !!playerGameId,
    watch: true,
    refetchInterval(query) {
      return 2000;
    },
  });

  const { data: player2 } = useReadContract({
    abi: connect4abi as Abi,
    address: connect4Contract,
    functionName: "get_player2",
    args: [playerGameId],
    enabled: address && !!playerGameId,
    watch: true,
    refetchInterval(query) {
      return 2000;
    },
  });
  const gameIdToGameName = {
    "connect-four": "Connect Four",
    "tic-tac-toe": "Tic Tac Toe",
    dotsandboxes: "Dots and Boxes",
  };
  const convertToAddress = (CairoNumber: { high: string; low: string }) => {
    // Convert high and low parts to hexadecimal strings
    const highHex = CairoNumber.high.slice(2).padStart(32, "0");
    const lowHex = CairoNumber.low.slice(2).padStart(32, "0");
    // Concatenate high and low parts
    let address = highHex + lowHex;
    address = address.padStart(64, "0");
    return "0x" + address;
  };
  useEffect(() => {
    if (!playerGameId || !player1 || !player2) return;
    setPlayers({
      player1: convertToAddress(new CairoUint256(player1).toUint256HexString()),
      player2: convertToAddress(new CairoUint256(player2).toUint256HexString()),
    });
  }, [playerGameId, player1, player2]);

  useEffect(() => {
    if (!players.player1 || !address) return;
    if (players.player1.toLowerCase() === address.toLowerCase()) {
      navigate("/connect-four/" + playerGameId);
      toast.success("You are player 1");
    }
    if (players.player2.toLowerCase() === address.toLowerCase()) {
      toast.success("You are player 2");
    }
  }, [players]);

  const handlePlayWithFriend = () => {
    send();
    // Logic to invite a friend to play
    toast.success("Invitation sent to your friend!");
  };

  const handleRandomMatch = () => {
    // Logic to join a random match
    toast.success("Searching for a random match...");
    navigate("/random-match");
  };

  const handleConnectStarknet = () => {
    // Logic to connect to Starknet
    connect?.({
      connector: connectors[0],
    });
    // toast.success("Connecting to Starknet...");
  };

  const isValidGameId = (id: string): id is keyof typeof gameIdToGameName => {
    return id in gameIdToGameName;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex flex-col items-center justify-center p-4">
      {gameId && isValidGameId(gameId) && (
        <h2 className="text-4xl text-white mb-12">
          {gameIdToGameName[gameId]}
        </h2>
      )}
      {!account && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Connect to Starknet to Play
          </h3>
          <button
            onClick={handleConnectStarknet}
            className="w-full px-4 py-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-semibold hover:scale-105 transition-transform"
          >
            Connect Starknet
          </button>
        </div>
      )}
      {players.player1.toLowerCase() !== address?.toLowerCase() && (
        <div className="bg-white/10 p-8 rounded-lg shadow-lg mt-12 w-full max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">Game Lobby</h2>
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-white mb-2">
              Play with a Friend
            </h3>
            <input
              type="email"
              value={friendAddress}
              onChange={(e) => setFriendAddress(e.target.value)}
              className="w-full p-2 mb-4 rounded bg-gray-800 text-white"
              placeholder="Friend's Starknet Address"
            />
            <button
              onClick={handlePlayWithFriend}
              className="w-full px-4 py-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-semibold hover:scale-105 transition-transform"
            >
              Invite Friend
            </button>
          </div>
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-white mb-2">
              Random Match
            </h3>
            <button
              onClick={handleRandomMatch}
              className="w-full px-4 py-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-semibold hover:scale-105 transition-transform"
            >
              Find Random Match
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 w-full mx-auto">
        <h2 className="text-white text-2xl">Pending Invites</h2>
        <div className="bg-white/10 p-8 rounded-lg shadow-lg mt-4 w-full">
          {players?.player2?.toLowerCase() === address?.toLowerCase() && (
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">
                Player 1: {players.player1}
              </h3>
              <button
                onClick={() => navigate("/connect-four")}
                className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-semibold hover:scale-105 transition-transform"
              >
                Accept
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameLobby;
