import React from 'react';

const Leaderboard = () => {
  return (
    <section>
      <h3>Top Players</h3>
      <ul>
        <li>Player1 - Level: 10, Coins: 500</li>
        <li>Player2 - Level: 9, Coins: 450</li>
        {/* Add more players as needed */}
      </ul>
      <button>View Full Leaderboard</button>
    </section>
  );
};

export default Leaderboard;
