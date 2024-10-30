import React from 'react';
import './MainSection.css';
import { useSelector } from 'react-redux';

const MainSections = () => {
  const { loggedinUser } = useSelector(store => store.user);
  return (
    <section className="relative min-h-screen overflow-hidden text-white bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700">
      {/* Background coding animation */}
      <div className="absolute inset-0 bg-center bg-cover bg-coding-background opacity-20 animate-backgroundScroll"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6 space-y-8 text-center">
        <h1 className="text-5xl font-bold">Welcome back, {loggedinUser?.fullname}! Ready for a new coding challenge?</h1>
        <p className="text-lg">Unleash your potential and climb the leaderboard!</p>
        <button className="btn btn-primary btn-lg">Go for Battle</button>
        
        {/* Animated Announcement Blocks */}
        <div className="grid w-full max-w-4xl grid-cols-1 gap-6 mt-10 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg animate-pulse">New: Code Challenge starts in 2 hours!</div>
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg animate-pulse">Top Scorers updated! Check the leaderboard.</div>
          <div className="p-6 bg-gray-800 rounded-lg shadow-lg animate-pulse">Daily Challenge: Complete for extra points!</div>
        </div>
      </div>
    </section>
  );
};

export default MainSections;
