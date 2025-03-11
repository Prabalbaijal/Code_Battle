
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setLoggedinUser } from '../../redux/userSlice.js';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaChevronDown, FaBars, FaTimes } from 'react-icons/fa';
import Settings from '../Settings/Settings.jsx';

const Header = () => {
  const { loggedinUser } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const sidebarRef = useRef(null);
  const dropdownRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNavigation = (path) => {
    if (window.location.pathname === path) {
      window.location.reload();
    } else {
      navigate(path);
    }
    setIsSidebarOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 shadow-lg bg-gradient-to-r from-purple-700 via-blue-700 to-indigo-700 p-4 flex items-center justify-between">
      <Link to="/home" className="text-2xl font-bold text-white" onClick={() => handleNavigation('/home')}>
        Code Battle
      </Link>

      <div className="lg:hidden">
        <button onClick={() => setIsSidebarOpen(true)} className="focus:outline-none">
          <img src={loggedinUser?.avatar} alt="User Avatar" className="w-10 h-10 rounded-full" />
        </button>
      </div>

      {isSidebarOpen && (

        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div ref={sidebarRef} className="w-64 bg-gray-900 text-white h-full p-6 flex flex-col space-y-4 transition-transform transform translate-x-0">
            <button onClick={() => setIsSidebarOpen(false)} className="text-white self-end">
              <FaTimes size={24} />
            </button>
            <nav className="flex flex-col space-y-4">
              <button onClick={() => handleNavigation('/home')} className="hover:text-gray-300 text-left">
                Home
              </button>
              <Link to="/leaderboard" className="hover:text-gray-300" onClick={() => setIsSidebarOpen(false)}>
                Leaderboard
              </Link>
              <Link to="/practice-mode" className="hover:text-gray-300" onClick={() => setIsSidebarOpen(false)}>
                Practice
              </Link>
              {/* Challenges Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1 hover:text-gray-300">
                  Challenges <FaChevronDown className="w-3 h-3" />
                </button>
                <ul className="absolute left-0 mt-2 hidden group-hover:block bg-gray-800 text-white rounded shadow-lg w-48 py-2">
                  <li>
                    <Link to="/match" className="block px-4 py-2 hover:bg-gray-700">
                      Quick Match
                    </Link>
                  </li>
                  <li>
                    <Link to="/challenge" className="block px-4 py-2 hover:bg-gray-700">
                      Challenge a Friend
                    </Link>
                    
                  </li>
                  <li>
                    <Link to="/daily-challenge" className="block px-4 py-2 hover:bg-gray-700">
                      Daily Challenge
                    </Link>
                  </li>
                </ul>
              </div>
              <Link to="/friends" className="hover:text-gray-300" onClick={() => setIsSidebarOpen(false)}>
                Friends
              </Link>
              <Link to="/friendrequests" className="hover:text-gray-300" onClick={() => setIsSidebarOpen(false)}>
                Friend Requests
              </Link>
              <Link to="/profile" className="hover:text-gray-300" onClick={() => setIsSidebarOpen(false)}>
                Profile
              </Link>
              <Link to="/settings" className="hover:text-gray-300" onClick={() => setIsSidebarOpen(false)}>
                Settings
              </Link>
              <button onClick={logoutFunction} className="hover:text-red-500">
                Logout
              </button>
            </nav>
          </div>
        </div>




      )}

      <div className="hidden lg:flex items-center space-x-6 text-white">
        <nav className="flex flex-row space-x-6">
          <Link to="/home" className="hover:text-gray-300" onClick={() => handleNavigation('/home')}>Home</Link>
          <Link to="/leaderboard" className="hover:text-gray-300">Leaderboard</Link>
          <Link to="/practice-mode" className="hover:text-gray-300">Practice</Link>

          <div className="relative group">
            <button className="flex items-center gap-1 hover:text-gray-300">
              Challenges <FaChevronDown className="w-3 h-3" />
            </button>
            <ul className="absolute left-0 mt-2 hidden group-hover:block bg-gray-800 text-white rounded shadow-lg w-48 py-2">
              <li><Link to="/match" className="block px-4 py-2 hover:bg-gray-700">Quick Match</Link></li>
              <li><Link to="/challenge" className="block px-4 py-2 hover:bg-gray-700">Challenge a Friend</Link></li>
              <li><Link to="/daily-challenge" className="block px-4 py-2 hover:bg-gray-700">Daily Challenge</Link></li>
            </ul>
          </div>


          <Link to="/friends" className="hover:text-gray-300">Friends</Link>
          <Link to="/friendrequests" className="hover:text-gray-300">Friend Requests</Link>
        </nav>
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="focus:outline-none">
            <img src={loggedinUser?.avatar} alt="User Avatar" className="w-10 h-10 rounded-full" />
          </button>
          {isDropdownOpen && (
            <ul className="absolute right-0 mt-2 bg-gray-800 text-white rounded shadow-lg w-48 py-2">
              <li><Link to="/profile" className="block px-4 py-2 hover:bg-gray-700">Profile</Link></li>
              <li><Link to="/settings" className="block px-4 py-2 hover:bg-gray-700">Settings</Link></li>
              <li onClick={logoutFunction} className="block px-4 py-2 hover:bg-red-600 cursor-pointer">Logout</li>
            </ul>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
