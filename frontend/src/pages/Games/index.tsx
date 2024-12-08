import { Link } from "react-router-dom";

const index = () => {
  const trendingGames = [
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
  ];

  const allGames = [
    ...trendingGames,
    {
      id: "dotsandboxes",
      title: "Dots and Boxes",
      players: "892",
      image: "/dotsandboxes.png",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900">
      {/* Trending Games Section */}
      <section className="text-center py-24 px-4">
        <h2 className="text-3xl font-bold text-white mb-4">Trending Games</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {trendingGames.map((game) => (
            <Link
              to={`/game/${game.id}`}
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

      {/* All Games Section */}
      <section className="text-center py-24 px-4 bg-black/20">
        <h2 className="text-3xl font-bold text-white mb-4">All Games</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {allGames.map((game) => (
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
    </div>
  );
};

export default index;
