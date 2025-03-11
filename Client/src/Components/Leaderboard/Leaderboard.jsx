import React, { useEffect, useState } from 'react';

const Leaderboard = () => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('http://localhost:9000/api/leaderboard'); // API URL
        const data = await response.json();
        setPlayers(data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <div className="bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-2xl border border-gray-700">
        <h3 className="text-3xl font-bold text-center mb-6 text-blue-400">⚔️ Coding Battle Leaderboard ⚔️</h3>

        {loading ? (
          <p className="text-center text-gray-400 animate-pulse">Loading...</p>
        ) : (
          <ul className="space-y-3">
            {players.map((player, index) => (
              <li
                key={player.id}
                className={`flex justify-between items-center p-3 rounded-lg shadow-md transition ${index === 0 ? "bg-yellow-500 text-black font-bold" : "bg-gray-700 hover:bg-gray-600"
                  }`}
              >
                <span>{index + 1}. {player.name}</span>
                <span className="text-gray-300 text-sm">Lvl {player.level} | 🪙 {player.coins}</span>
              </li>
            ))}
          </ul>
        )}

        <button className="mt-5 w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg shadow-md transition">
          View Full Leaderboard
        </button>
      </div>
    </div>
  );
};

export default Leaderboard;
