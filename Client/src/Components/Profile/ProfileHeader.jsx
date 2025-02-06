












import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { setLoggedinUser } from '../../redux/userSlice.js';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Menu, X } from 'lucide-react';

const ProfileHeader = () => {
  const { loggedinUser } = useSelector(store => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isProfilePage = location.pathname === '/profile';

  const logoutFunction = async () => {
    try {
      const res = await axios.get('http://localhost:9000/api/users/logout');
      navigate("/");
      toast.success(res.data.message);
      dispatch(setLoggedinUser(null));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header 
      className="sticky top-0 z-50 text-white shadow-lg navbar bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-600 m-0 p-0"
    >
      <div className="flex items-center justify-between w-full px-4 py-2 lg:px-8">
        {/* Logo */}
        <div className="navbar-start">
          <Link to="/" className="text-xl sm:text-2xl font-bold btn btn-ghost whitespace-nowrap">
            Code Battle
          </Link>
        </div>

        {/* Hamburger Menu for Small Screens */}
        <div className="lg:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="btn btn-ghost">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Navbar Items for Larger Screens */}
        <div className={`absolute left-0 top-16 w-full bg-gray-800 p-4 space-y-2 lg:relative lg:top-0 lg:flex lg:w-auto lg:bg-transparent lg:space-y-0 lg:space-x-6 ${isMenuOpen ? 'block' : 'hidden'}`}>
          <ul className="flex flex-col lg:flex-row lg:items-center gap-4">
            <li><Link to="/" className="block p-2 text-white lg:text-gray-200 hover:text-gray-300">Home</Link></li>
            <li><Link to="/leaderboard" className="block p-2 text-white lg:text-gray-200 hover:text-gray-300">Leaderboard</Link></li>
            <li><Link to="/practice-mode" className="block p-2 text-white lg:text-gray-200 hover:text-gray-300">Practice Mode</Link></li>
            <li><Link to="/friends" className="block p-2 text-white lg:text-gray-200 hover:text-gray-300">Friends</Link></li>
          </ul>
        </div>

        {/* Profile Icon (Conditional Rendering) */}
        {!isProfilePage && (
          <div className="flex items-center space-x-4">
            <div className="dropdown dropdown-end">
              <div tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img alt="User Avatar" src={loggedinUser?.avatar} />
                </div>
              </div>
              <ul tabIndex={0} className="p-2 mt-3 bg-gray-800 shadow dropdown-content rounded-box w-52">
                <li className="p-2"><Link to="/profile">Profile</Link></li>
                <li className="p-2"><Link to="/settings">Settings</Link></li>
                <li onClick={logoutFunction} className="p-2 cursor-pointer border-t border-gray-600">Logout</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default ProfileHeader;