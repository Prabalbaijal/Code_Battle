// UserStatsSection.js
import React from 'react';
import './UserStats.css';

const UserStats = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-r from-blue-900 via-purple-800 to-indigo-700 text-white overflow-hidden">
      {/* Background animation for subtle effect */}
      <div className="absolute inset-0 bg-graph-background bg-cover bg-center opacity-10 animate-backgroundScroll"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8 space-y-10 text-center">
        <h2 className="text-4xl font-semibold">Your Progress</h2>
        
        {/* User Rating & Stats Display */}
        <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-5xl space-y-6 md:space-y-0">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg animate-fadeIn">
            <h3 className="text-xl font-medium">Current Rating</h3>
            <p className="text-3xl font-bold mt-2">1200</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg animate-fadeIn delay-100">
            <h3 className="text-xl font-medium">Contests Attempted</h3>
            <p className="text-3xl font-bold mt-2">25</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg animate-fadeIn delay-200">
            <h3 className="text-xl font-medium">Challenges Completed</h3>
            <p className="text-3xl font-bold mt-2">78</p>
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full max-w-4xl bg-gray-700 rounded-full h-4 mt-6 animate-progressBar">
          <div className="bg-purple-500 h-4 rounded-full" style={{ width: '60%' }}></div>
        </div>
        <p className="text-sm mt-2">Keep pushing! Only 40% left to level up!</p>
        
        {/* Recent Activity Feed */}
        <div className="w-full max-w-4xl space-y-4 mt-8 animate-fadeIn">
          <h3 className="text-2xl font-semibold">Recent Activity</h3>
          <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <p>You completed the challenge “Data Structures Mastery” - 100 points!</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow-md">
            <p>You achieved a new high score in “Algorithm Sprint” - 150 points!</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserStats;
