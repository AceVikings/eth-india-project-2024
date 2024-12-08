import { Link } from "react-router-dom";
import { useUserData } from "../../contexts/userDataContext";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { IoPersonCircleOutline } from "react-icons/io5";
import { useAccount } from "@starknet-react/core";

const index = () => {
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const { address } = useAccount();
  const userData = useUserData();
  useEffect(() => {
    console.log(userData.userData);
  }, []);

  const handleSignOut = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_PUBLIC_BACKEND_URL}/auth/logout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.userData.idToken}`,
        },
      }
    );
    if (response.ok) {
      toast.success("Logged out successfully");
      localStorage.removeItem("idToken");
      userData.setUserData({ idToken: null });
    } else {
      toast.error("Error logging out");
      localStorage.removeItem("idToken");
      userData.setUserData({ idToken: null });
    }
    setIsSidePanelOpen(false);
  };
  return (
    <nav className="flex items-center fixed top-0 left-0 w-screen px-6 py-4 bg-black/20">
      <Link
        to={"/"}
        className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"
      >
        Web3Games
      </Link>

      <Link
        to={"/games"}
        className="px-6 py-2 mr-4 ml-auto rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-semibold hover:scale-105 transition-transform"
      >
        Play
      </Link>
      {address && (
        <p className="mr-4 ml-4 text-white">
          {address.slice(0, 6) + "..." + address.slice(-4)}
        </p>
      )}

      {!userData?.userData.idToken && (
        <Link
          to={"/auth"}
          className="px-6 py-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-semibold hover:scale-105 transition-transform"
        >
          Connect Wallet
        </Link>
      )}
      {userData?.userData.idToken && (
        <div className="relative">
          <button onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}>
            <IoPersonCircleOutline className="text-2xl h-12 w-12 text-white" />
          </button>
          {isSidePanelOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
              <Link
                to={"/account"}
                className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                onClick={() => setIsSidePanelOpen(false)}
              >
                My Account
              </Link>
              <button
                onClick={handleSignOut}
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default index;
