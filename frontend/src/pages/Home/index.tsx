import { Link } from "react-router-dom";

const index = () => {
  const games = [
    {
      id: "connect-four",
      title: "Connect 4",
      players: "1.2k",
      image: "/connect-4.webp",
    },
    {
      id: "tic-tac-toe",
      title: "TicTacToe",
      players: "3.5k",
      image: "/tictactoe.webp",
    },
    {
      id: "dotsandboxes",
      title: "Dots and Boxes",
      players: "892",
      image: "/dotsandboxes.png",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900">
      {/* Hero Section */}
      <section className="text-center py-24 px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          Play, Earn & Connect
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Experience the future of gaming with blockchain technology
        </p>
        <button className="px-8 py-3 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-semibold text-lg hover:scale-105 transition-transform">
          Start Playing
        </button>
      </section>

      {/* Games Grid */}
      <section className="px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-white mb-12">
          Featured Games
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {games.map((game) => (
            <Link
              to={`/${game.id}`}
              key={game.id}
              className="bg-white/10 rounded-xl overflow-hidden hover:-translate-y-2 transition-transform cursor-pointer"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  {game.title}
                </h3>
                <p className="text-gray-400">{game.players} players online</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center py-24 px-4 bg-black/20">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Join?</h2>
        <p className="text-gray-300 mb-8">
          Connect your wallet and start playing instantly
        </p>
        <button className="px-8 py-3 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-gray-900 font-semibold text-lg hover:scale-105 transition-transform">
          Connect Wallet
        </button>
      </section>
    </div>
  );
};

export default index;
