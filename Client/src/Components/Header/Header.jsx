import React, { useState } from 'react';
import { useSelector } from 'react-redux';

const Header = () => {
  const { loggedinUser } = useSelector(store => store.user);
  
  const [isChallengesOpen, setIsChallengesOpen] = useState(false);

  const toggleChallenges = () => {
    setIsChallengesOpen(!isChallengesOpen);
  };

  return (
    <header className="sticky top-0 z-50 text-white shadow-lg navbar bg-gradient-to-r from-purple-700 via-blue-700 to-indigo-700">
      <div className="navbar-start">
        <a href="/" className="text-2xl font-bold btn btn-ghost">Code Battle</a>
      </div>
      <div className="flex items-center gap-4 navbar-end">
        <ul className="hidden menu menu-horizontal lg:flex">
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
              <ul className="absolute left-0 w-48 p-2 mt-1 text-white bg-gray-800 rounded shadow-lg top-full">
                <li><a href="/quick-match" className="p-2 rounded hover:bg-gray-700">Quick Match</a></li>
                <li><a href="/challenge-friend" className="p-2 rounded hover:bg-gray-700">Challenge a Friend</a></li>
                <li><a href="/daily-challenge" className="p-2 rounded hover:bg-gray-700">Daily Challenge</a></li>
              </ul>
            )}
          </li>
          <li><a href="/friends">Friends</a></li>
        </ul>

        {/* Profile Icon with Dropdown */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img alt="User Avatar" src={loggedinUser?.avatar} />
            </div>
          </div>
          <ul tabIndex={0} className="p-2 mt-3 bg-gray-800 shadow dropdown-content rounded-box w-52">
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
