import React from "react";

export default function DailyChallenge() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-4">🔥 Daily Challenge</h2>
        <p className="text-gray-300 text-center">Solve a unique problem every day and test your skills!</p>

        <div className="mt-6 space-y-4">
          <div className="bg-gray-700 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">Today's Challenge</h3>
            <p className="text-gray-300">Reverse a linked list in O(n) time.</p>
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition">
            Start Challenge 🚀
          </button>
        </div>
      </div>
    </div>
  );
}
