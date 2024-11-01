// ContestHistory.jsx
import React from 'react';

const ContestHistory = () => {
  // Placeholder data for contest history
  const contests = [
    { name: 'Contest 1', date: '2024-10-25', rank: 10 },
    { name: 'Contest 2', date: '2024-10-18', rank: 15 },
    { name: 'Contest 3', date: '2024-10-11', rank: 8 },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recent Contest History</h2>
      <ul className="space-y-2">
        {contests.map((contest, index) => (
          <li key={index} className="flex justify-between p-2 bg-gray-100 rounded">
            <span>{contest.name}</span>
            <span>{contest.date}</span>
            <span>Rank: {contest.rank}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContestHistory;
