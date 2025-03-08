
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setLoggedinUser } from '../../redux/userSlice.js';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaChevronDown, FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
  const { loggedinUser } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 shadow-lg bg-gradient-to-r from-purple-700 via-blue-700 to-indigo-700 p-4 flex items-center justify-between">
     
      <Link 
  to="/home" 
  className="text-2xl font-bold text-white" 
  onClick={(e) => {
    if (window.location.pathname === "/home") {
      e.preventDefault(); // Prevent default navigation if already on /home
      window.location.reload(); // Force refresh
    }
  }}
>
  Code Battle
</Link>

      
      {/* Hamburger Menu Icon */}
      <button onClick={toggleMenu} className="lg:hidden text-white focus:outline-none">
        {isMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
      </button>

      {/* Navigation Links */}
      <div className={`lg:flex items-center space-x-6 text-white ${isMenuOpen ? 'block' : 'hidden'}`}>
        <nav className="flex flex-col lg:flex-row lg:space-x-6 space-y-4 lg:space-y-0">
          <Link to="/home" className="hover:text-gray-300">Home</Link>
          <Link to="/leaderboard" className="hover:text-gray-300">Leaderboard</Link>
          <Link to="/practice-mode" className="hover:text-gray-300">Practice</Link>
          <div className="relative group">
            <button className="flex items-center gap-1 hover:text-gray-300">
              Challenges <FaChevronDown className="w-3 h-3" />
            </button>
            <ul className="absolute left-0 mt-2 hidden group-hover:block bg-gray-800 text-white rounded shadow-lg w-48 py-2">
              <li><Link to="/match" className="block px-4 py-2 hover:bg-gray-700">Quick Match</Link></li>
              <li><Link to="/challenge-friend" className="block px-4 py-2 hover:bg-gray-700">Challenge a Friend</Link></li>
              <li><Link to="/daily-challenge" className="block px-4 py-2 hover:bg-gray-700">Daily Challenge</Link></li>
            </ul>
          </div>
          <Link to="/friends" className="hover:text-gray-300">Friends</Link>
          <Link to="/friendrequests" className="hover:text-gray-300">Requests</Link>
        </nav>
        
        {/* Profile Dropdown */}
        <div className="relative">
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