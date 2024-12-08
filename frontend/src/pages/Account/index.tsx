import { useEffect, useState } from "react";
import { useUserData } from "../../contexts/userDataContext";
import { toast } from "react-toastify";
import { FaCopy } from "react-icons/fa";
import {
  polygonPublicClient,
  basePublicClient,
  polygonAmoyPublicClient,
} from "../../utils/publicClients";
import { formatEther } from "viem";
interface Wallet {
  address: string;
  network_name: string;
}
const Account = () => {
  const userData = useUserData();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [walletBalances, setWalletBalances] = useState<any[]>([]);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    if (!userData.userData.idToken) return;
    // Fetch user's wallets and friends from the backend
    const fetchUserData = async () => {
      const walletResponse = await fetch(
        `https://sandbox-api.okto.tech/api/v1/wallet`,
        {
          headers: {
            Authorization: `Bearer ${userData.userData.idToken}`,
          },
        }
      );
      const wallets = await walletResponse.json();

      setWallets(wallets.data.wallets);
      const walletBalances = await Promise.all(
        wallets.data.wallets.map((wallet: Wallet) =>
          getWalletBalance(wallet.address, wallet.network_name)
        )
      );
      setWalletBalances(walletBalances);
      const friendsResponse = await fetch(
        `${import.meta.env.VITE_PUBLIC_BACKEND_URL}/user/friends`,
        {
          headers: {
            Authorization: `Bearer ${userData.userData.idToken}`,
          },
        }
      );
      const friends = await friendsResponse.json();
      setFriends(friends);
    };

    fetchUserData();
  }, [userData.userData.idToken]);

  const getWalletBalance = async (address: string, network_name: string) => {
    console.log(network_name);
    if (network_name === "POLYGON") {
      const balance = await polygonPublicClient.getBalance({
        address: address as `0x${string}`,
      });
      return parseFloat(formatEther(balance)).toPrecision(4) + " POL";
    }
    if (network_name === "BASE") {
      const balance = await basePublicClient.getBalance({
        address: address as `0x${string}`,
      });
      return parseFloat(formatEther(balance)).toPrecision(4) + " ETH";
    }
    if (network_name === "POLYGON_TESTNET_AMOY") {
      const balance = await polygonAmoyPublicClient.getBalance({
        address: address as `0x${string}`,
      });
      return parseFloat(formatEther(balance)).toPrecision(4) + " POL";
    }
  };

  const handleDepositUSDC = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_PUBLIC_BACKEND_URL}/user/depositUSDC`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.userData.idToken}`,
        },
        body: JSON.stringify({ amount: 100, address: wallets[0].address }),
      }
    );
    if (response.ok) {
      toast.success("USDC deposited successfully");
    } else {
      toast.error("Error depositing USDC");
    }
  };
  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex flex-col items-center justify-center p-4">
      <div className="bg-white/10 p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-white mb-4">My Account</h2>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-2">
            Crypto Accounts
          </h3>
          <div className="space-y-4">
            {wallets?.map((wallet, _index) => (
              <div
                key={wallet.network_name}
                className="bg-gray-800 p-4 rounded-lg flex flex-col space-y-2"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white">Address: {wallet.address}</p>
                    <p className="text-gray-400 text-sm">
                      {wallet.network_name}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy(wallet.address)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <FaCopy />
                  </button>
                </div>
                <p className="text-white">Balance: {walletBalances[_index]}</p>
                <button
                  onClick={() => handleDepositUSDC()}
                  className="bg-gradient-to-r from-emerald-400 w-1/3 mx-auto to-cyan-400 text-gray-900 font-semibold rounded-full py-1 hover:scale-105 transition-transform"
                >
                  Stake to be trusted player
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Friends List
          </h3>
          <div className="space-y-4">
            {friends.map((friend) => (
              <div
                key={friend.id}
                className="bg-gray-800 p-4 rounded-lg flex items-center"
              >
                <img
                  src={friend.profilePicture}
                  alt={friend.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <p className="text-white">{friend.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
