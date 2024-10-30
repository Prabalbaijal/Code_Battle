// MainSections.js
import React from 'react';
import './MainSection.css';

const MainSections = () => {
  return (
    <section className="relative min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-white overflow-hidden">
      {/* Background coding animation */}
      <div className="absolute inset-0 bg-coding-background bg-cover bg-center opacity-20 animate-backgroundScroll"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center space-y-8 p-6">
        <h1 className="text-5xl font-bold">Welcome back, [Username]! Ready for a new coding challenge?</h1>
        <p className="text-lg">Unleash your potential and climb the leaderboard!</p>
        <button className="btn btn-primary btn-lg">Go for Battle</button>
        
        {/* Animated Announcement Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 w-full max-w-4xl">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg animate-pulse">New: Code Challenge starts in 2 hours!</div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg animate-pulse">Top Scorers updated! Check the leaderboard.</div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg animate-pulse">Daily Challenge: Complete for extra points!</div>
        </div>
      </div>
    </section>
  );
};

export default MainSections;
