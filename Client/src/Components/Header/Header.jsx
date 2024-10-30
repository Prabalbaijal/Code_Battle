import React, { useState } from 'react';

const Header = () => {
  const [isChallengesOpen, setIsChallengesOpen] = useState(false);

  const toggleChallenges = () => {
    setIsChallengesOpen(!isChallengesOpen);
  };

  return (
    <header className="navbar sticky top-0 bg-gradient-to-r from-purple-700 via-blue-700 to-indigo-700 text-white shadow-lg z-50">
      <div className="navbar-start">
        <a href="/" className="btn btn-ghost text-2xl font-bold">Code Battle</a>
      </div>
      <div className="navbar-end flex items-center gap-4">
        <ul className="menu menu-horizontal hidden lg:flex">
          <li><a href="/">Home</a></li>
          <li><a href="/leaderboard">Leaderboard</a></li>
          <li><a href="/practice-mode">Practice Mode</a></li>
          <li className="relative">
            <button 
              onClick={toggleChallenges} 
              className="flex items-center gap-1 focus:outline-none"
            >
              Challenges
              <svg className={`ml-1 w-4 h-4 transform ${isChallengesOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isChallengesOpen && (
              <ul className="absolute top-full left-0 mt-1 bg-gray-800 text-white p-2 rounded shadow-lg w-48">
                <li><a href="/quick-match" className="hover:bg-gray-700 p-2 rounded">Quick Match</a></li>
                <li><a href="/challenge-friend" className="hover:bg-gray-700 p-2 rounded">Challenge a Friend</a></li>
                <li><a href="/daily-challenge" className="hover:bg-gray-700 p-2 rounded">Daily Challenge</a></li>
              </ul>
            )}
          </li>
          <li><a href="/friends">Friends</a></li>
        </ul>

        {/* Profile Icon with Dropdown */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img alt="User Avatar" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
            </div>
          </div>
          <ul tabIndex={0} className="dropdown-content bg-gray-800 rounded-box mt-3 w-52 p-2 shadow">
            <li><a href="/profile">Profile</a></li>
            <li><a href="/settings">Settings</a></li>
            <li><a href="/logout">Logout</a></li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
