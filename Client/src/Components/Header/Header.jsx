import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setLoggedinUser } from '../../redux/userSlice.js';
import axios from 'axios';
import toast from 'react-hot-toast';


const Header = () => {
  const { loggedinUser } = useSelector((store) => store.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutFunction = async () => {
    try {
      const res = await axios.get('http://localhost:9000/api/users/logout');
      dispatch(setLoggedinUser(null));
      navigate('/');
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const [isChallengesOpen, setIsChallengesOpen] = useState(false);

  const toggleChallenges = () => {
    setIsChallengesOpen(!isChallengesOpen);
  };

  return (
    <header className="sticky top-0 z-50 text-white shadow-lg navbar bg-gradient-to-r from-purple-700 via-blue-700 to-indigo-700">
      <div className="navbar-start">
        <Link to="/" className="text-2xl font-bold btn btn-ghost">
          Code Battle
        </Link>
      </div>
      <div className="flex items-center gap-4 navbar-end">
        <ul className="hidden menu menu-horizontal lg:flex">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/leaderboard">Leaderboard</Link>
          </li>
          <li>
            <Link to="/practice-mode">Practice Mode</Link>
          </li>
          <li className="relative">
            <button
              onClick={toggleChallenges}
              className="flex items-center gap-1 focus:outline-none"
            >
              Challenges
              <svg
                className={`ml-1 w-4 h-4 transform ${isChallengesOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isChallengesOpen && (
              <ul className="absolute left-0 w-48 p-2 mt-1 text-white bg-gray-800 rounded shadow-lg top-full">
                <li>
                  <Link to="/match">Quick Match</Link>
                </li>
                <li>
                  <Link to="/challenge-friend" className="p-2 rounded hover:bg-gray-700">
                    Challenge a Friend
                  </Link>
                </li>
                <li>
                  <Link to="/daily-challenge" className="p-2 rounded hover:bg-gray-700">
                    Daily Challenge
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li>
            <Link to="/friends">Friends</Link>
          </li>
          <li>
            <Link to="/friendrequests">Friend Requests</Link>
          </li>
        </ul>

        {/* Profile Icon with Dropdown */}
        <div className="dropdown dropdown-end">
          <div tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <img alt="User Avatar" src={loggedinUser?.avatar} />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="p-2 mt-3 bg-gray-800 shadow dropdown-content rounded-box w-52"
          >
            <li className="p-2">
              <Link to="/profile">Profile</Link>
            </li>
            <li className="p-2">
              <Link to="/settings">Settings</Link>
            </li>
            <li onClick={logoutFunction} className="p-2 cursor-pointer">
              Logout
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
