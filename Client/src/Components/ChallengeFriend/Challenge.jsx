import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Challenge() {
  useEffect(() => {
    console.log("✅ Challenge Page Loaded!");
  }, []);

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center text-white p-6">
      <h1 className="text-3xl font-bold mb-4">Challenge a Friend</h1>
      <p className="text-lg text-gray-300 mb-6">Invite your friends to a coding challenge and compete in real time!</p>

      <div className="flex gap-4">
        <Link to="/home" className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600 transition">
          🏠 Go Home
        </Link>
        <Link to="/match" className="bg-green-500 px-4 py-2 rounded-lg hover:bg-green-600 transition">
          ⚡ Quick Match
        </Link>
      </div>
    </div>
  );
}
