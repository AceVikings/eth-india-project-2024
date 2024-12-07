import { Link } from "react-router-dom";

const index = () => {
  return (
    <nav className="flex justify-between items-center fixed top-0 left-0 w-screen px-6 py-4 bg-black/20">
      <Link
        to={"/"}
        className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"
      >
        Web3Games
      </Link>
      <button className="px-6 py-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-semibold hover:scale-105 transition-transform">
        Connect Wallet
      </button>
    </nav>
  );
};

export default index;
