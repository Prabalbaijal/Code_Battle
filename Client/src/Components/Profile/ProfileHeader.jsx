
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { setLoggedinUser } from '../../redux/userSlice.js';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Menu, X } from 'lucide-react';
import logo from "../../assets/logo.png";

const ProfileHeader = () => {
  const { loggedinUser } = useSelector(store => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isProfilePage = location.pathname === '/profile';

  const logoutFunction = async () => {
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const res = await axios.get(`${BACKEND_URL}/api/users/logout`);
      navigate("/");
      toast.success(res.data.message);
      dispatch(setLoggedinUser(null));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <header
      className="z-50 w-full shadow-lg bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-600"
    >
      <div className="flex items-center justify-between w-full px-4 py-2 lg:px-8">
        {/* Logo */}

{/* 
        {<div className="navbar-start">
          <Link to="/" className="text-xl font-bold sm:text-2xl btn btn-ghost whitespace-nowrap">
            Code Battle
          </Link>
        </div>} */}

{ 
        <div className="navbar-start">
          <button
            onClick={() => window.location.reload()}
            className="relative flex items-center space-x-4 sm:ml-[-0px] mb-4 sm:mb-0 focus:outline-none"
          >
          
            <img
              src={logo}
              alt="Logo"
              className="transition duration-300 rounded-lg w-36 sm:w-80 h-18 hover:brightness-125"
            />
          </button>
        </div> }






        {/* Hamburger Menu for Small Screens */}
        <div className="lg:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="btn btn-ghost">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Navbar Items for Larger Screens */}
        <div className={`absolute left-0 top-16 w-full bg-gray-800 p-4 space-y-2 lg:relative lg:top-0 lg:flex lg:w-auto lg:bg-transparent lg:space-y-0 lg:space-x-6 ${isMenuOpen ? 'block' : 'hidden'}`}>
          <ul className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <li><Link to="/home" className="block p-2 text-white lg:text-gray-200 hover:text-gray-300">Home</Link></li>
            <li><Link to="/match" className="block p-2 text-white lg:text-gray-200 hover:text-gray-300">Quick Match</Link></li>
            <li><Link to="/activecontests" className="block p-2 text-white lg:text-gray-200 hover:text-gray-300">Active Contests</Link></li>
            <li><Link to="/friends" className="block p-2 text-white lg:text-gray-200 hover:text-gray-300">Friends</Link></li>
            <li><Link to="/friendrequests" className="block p-2 text-white lg:text-gray-200 hover:text-gray-300">Friend Requests</Link></li>
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
                <li onClick={logoutFunction} className="p-2 border-t border-gray-600 cursor-pointer">Logout</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default ProfileHeader;


// import React, { useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate, Link, useLocation } from 'react-router-dom';
// import { setLoggedinUser } from '../../redux/userSlice.js';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { Menu, X, Moon, Sun } from 'lucide-react';
// import logo from '../../assets/logo.png';

// const ProfileHeader = ({ toggleDarkMode, darkMode }) => {
//   const { loggedinUser } = useSelector((store) => store.user);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const location = useLocation();
//   const isProfilePage = location.pathname === '/profile';

//   const logoutFunction = async () => {
//     try {
//       const res = await axios.get('http://localhost:9000/api/users/logout');
//       navigate('/');
//       toast.success(res.data.message);
//       dispatch(setLoggedinUser(null));
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <header className="profile-header">
//       <div className="header-container">
//         {/* Logo */}
//         <div className="navbar-start">
//           <button onClick={() => window.location.reload()} className="logo-container">
//             <img src={logo} alt="Logo" className="logo" />
//           </button>
//         </div>

//         {/* Navbar Items */}
//         <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
//           {["home", "match", "activecontests", "friends", "friendrequests"].map((item) => (
//             <Link key={item} to={`/${item}`} className="nav-item">
//               {item.charAt(0).toUpperCase() + item.slice(1)}
//             </Link>
//           ))}
//         </nav>

//         {/* Dark Mode Toggle */}
//         <button onClick={toggleDarkMode} className="dark-mode-toggle">
//           {darkMode ? <Sun size={24} /> : <Moon size={24} />}
//         </button>

//         {/* Profile Section */}
//         {!isProfilePage && loggedinUser && (
//           <div className="profile-container">
//             <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="profile-button">
//               <img src={loggedinUser.avatar} alt="User Avatar" className="avatar" />
//               <span className="status-dot"></span>
//             </button>

//             {isDropdownOpen && (
//               <div className="profile-dropdown">
//                 <Link to="/profile" className="dropdown-item">Profile</Link>
//                 <Link to="/settings" className="dropdown-item">Settings</Link>
//                 <button onClick={logoutFunction} className="dropdown-item logout">
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Mobile Menu Button */}
//         <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="menu-toggle">
//           {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//         </button>
//       </div>
//     </header>
//   );
// };

// export default ProfileHeader;
