
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setLoggedinUser } from '../../redux/userSlice.js';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaTimes } from 'react-icons/fa';

import logo from "../../Assets/AppLogo.png"

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
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const res = await axios.get(`${BACKEND_URL}/api/users/logout`,{withCredentials:true});
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

    <header className="sticky top-0 z-50 flex items-center justify-between w-full p-4 shadow-lg bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-600">


      <Link
        to="/"
        onClick={() => window.location.reload()}
        className="relative flex items-center space-x-4 sm:ml-[-0px] mb-4 sm:mb-0"
      >
        {/* Logo Image with Effects */}
        <img
          src={logo}
          alt="Logo"
          className="transition duration-300 rounded-lg w-36 sm:w-80 h-22 hover:brightness-125"
        />
      </Link>


      <div className="lg:hidden">
        <button onClick={() => setIsSidebarOpen(true)} className="focus:outline-none">
          <img src={loggedinUser?.avatar} alt="User Avatar" className="w-10 h-10 rounded-full" />
        </button>
      </div>

      {isSidebarOpen && (

        <div className="fixed inset-0 z-50 flex justify-end bg-black bg-opacity-50">
          <div ref={sidebarRef} className="flex flex-col w-64 h-full p-6 space-y-4 text-white transition-transform transform translate-x-0 bg-gray-900">
            <button onClick={() => setIsSidebarOpen(false)} className="self-end text-white">
              <FaTimes size={24} />
            </button>
            <nav className="flex flex-col space-y-4">
              <button onClick={() => handleNavigation('/home')} className="text-left hover:text-gray-300">
                Home
              </button>
              {/* Challenges Dropdown */}
              <Link to="/match" className="hover:text-gray-300" onClick={() => setIsSidebarOpen(false)}>
                Quick Match
              </Link>
              <Link to="/activecontests" className="hover:text-gray-300" onClick={() => setIsSidebarOpen(false)}>
                Active Contests
              </Link>
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

      <div className="items-center hidden space-x-6 text-white lg:flex">
        <nav className="flex flex-row space-x-6">
          <Link to="/home" className="hover:text-gray-300" onClick={() => handleNavigation('/home')}>Home</Link>
          <Link to="/match" className="hover:text-gray-300">Quick Match</Link>
          <Link to="/activecontests" className="hover:text-gray-300">Active Contests</Link>

          <Link to="/friends" className="hover:text-gray-300">Friends</Link>
          <Link to="/friendrequests" className="hover:text-gray-300">Friend Requests</Link>
        </nav>
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="focus:outline-none">
            <img src={loggedinUser?.avatar} alt="User Avatar" className="w-10 h-10 rounded-full" />
          </button>
          {isDropdownOpen && (
            <ul className="absolute right-0 w-48 py-2 mt-2 text-white bg-gray-800 rounded shadow-lg">
              <li><Link to="/profile" className="block px-4 py-2 hover:bg-gray-700">Profile</Link></li>
              <li><Link to="/settings" className="block px-4 py-2 hover:bg-gray-700">Settings</Link></li>
              <li onClick={logoutFunction} className="block px-4 py-2 cursor-pointer hover:bg-red-600">Logout</li>
            </ul>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
