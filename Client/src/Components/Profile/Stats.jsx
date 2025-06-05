import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLoggedinUser } from '../../redux/userSlice.js';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Settings, 
  LogOut, 
  Trophy, 
  Coins, 
  Mail, 
  User2, 
  AtSign,
  Shield 
} from 'lucide-react';

const Stats = ({ level, coins }) => {
  const { loggedinUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [animateProfile, setAnimateProfile] = useState(false);

  useEffect(() => {
    setAnimateProfile(true);
  }, []);

  const logoutFunction = async () => {
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const res = await axios.get(`${BACKEND_URL}/api/auth/logout`,{withCredentials:true});
      dispatch(setLoggedinUser(null));
      navigate('/');
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
      toast.error('Logout failed. Please try again.');
    }
  };

  return (
    <div className="flex flex-col h-full p-6 transition-all duration-300 border-r border-gray-700 shadow-xl bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Profile Section */}
      <div className={`flex flex-col items-center space-y-6 flex-grow mt-8 transform transition-all duration-700 ${animateProfile ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        {/* Avatar Container with Glow Effect */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200"></div>
          <img
            src={loggedinUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400'}
            alt="Profile"
            className="relative object-cover w-40 h-40 transition duration-500 transform border-4 border-gray-800 rounded-full hover:scale-105"
          />
        </div>

        {/* User Info */}
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text">
            {loggedinUser?.fullname}
          </h2>
          <p className="flex items-center justify-center space-x-1 text-gray-400">
            <AtSign size={16} className="text-gray-500" />
            <span>{loggedinUser?.username}</span>
          </p>
        </div>

        {/* Stats Cards */}
        <div className="w-full space-y-4">
          {/* Email Card */}
          <div className="p-4 transition-all duration-300 border border-gray-700 bg-gray-800/50 backdrop-blur-sm rounded-xl hover:border-gray-600">
            <div className="flex items-center space-x-3">
              <Mail className="text-blue-400" size={20} />
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-gray-200">{loggedinUser?.email}</p>
              </div>
            </div>
          </div>

          {/* Level Card */}
          <div className="p-4 transition-all duration-300 border border-gray-700 bg-gray-800/50 backdrop-blur-sm rounded-xl hover:border-gray-600">
            <div className="flex items-center space-x-3">
              <Shield className="text-purple-400" size={20} />
              <div>
                <p className="text-sm text-gray-400">Level</p>
                <div className="flex items-center space-x-2">
                  <span className="text-lg text-gray-200">{level}</span>
                  <div className="flex-grow h-2 overflow-hidden bg-gray-700 rounded-full">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                      style={{ width: `${(level % 10) * 10}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Coins Card */}
          <div className="p-4 transition-all duration-300 border border-gray-700 bg-gray-800/50 backdrop-blur-sm rounded-xl hover:border-gray-600">
            <div className="flex items-center space-x-3">
              <Coins className="text-yellow-400" size={20} />
              <div>
                <p className="text-sm text-gray-400">Coins</p>
                <p className="text-lg text-gray-200">{coins}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Button */}
      <div className="relative mt-auto">
        <button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className="w-full group"
        >
          <div className="flex items-center justify-center w-full py-3 space-x-2 transition-all duration-300 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 hover:border-gray-600">
            <Settings size={20} className="text-gray-400 group-hover:text-gray-200" />
            <span className="text-sm font-medium text-gray-400 group-hover:text-gray-200">Settings</span>
          </div>
        </button>

        {/* Dropdown Menu */}
        {isSettingsOpen && (
          <div className="absolute left-0 w-full mb-2 overflow-hidden bg-gray-800 border border-gray-700 rounded-lg shadow-xl bottom-full">
            <button
              onClick={logoutFunction}
              className="flex items-center w-full px-4 py-3 space-x-2 text-left text-gray-300 transition-colors duration-200 hover:bg-gray-700"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stats;



// import React, { useState, useEffect, useRef } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import { setLoggedinUser } from '../../redux/userSlice.js';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import { Settings, LogOut } from 'lucide-react';
// import defaultAvatar from "../../assets/defaultAvatar.png";

// const Stats = ({ level, coins }) => {
//   const { loggedinUser } = useSelector((store) => store.user);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [isSettingsOpen, setIsSettingsOpen] = useState(false);
//   const dropdownRef = useRef(null);

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

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsSettingsOpen(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   return (
//     <div className="flex flex-col h-full p-6 text-white bg-gray-900 border-r border-gray-700 shadow-lg">
//       {/* Profile Section */}
//       <div className="flex flex-col items-center flex-grow mt-10 space-y-4">
//         <img
//           src={loggedinUser?.avatar || defaultAvatar}
//           alt="Profile Pic"
//           className="object-cover w-40 h-40 transition-transform border-4 rounded-full shadow-lg border-cyan-400 hover:scale-105"
//         />
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-cyan-300">{loggedinUser?.fullname}</h2>
//           <p className="text-gray-400">@{loggedinUser?.username}</p>
//         </div>
//         <div className="flex flex-col w-full px-6 py-4 space-y-2 bg-gray-800 rounded-lg shadow-md">
//           <p className="font-medium text-gray-300">📧 {loggedinUser?.email}</p>
//           <p className="text-gray-400">🎮 Level: <span className="text-gray-300">{level}</span></p>
//           <p className="text-gray-400">💰 Coins: <span className="text-gray-300">{coins}</span></p>
//         </div>
//       </div>

//       {/* Settings Button */}
//       <div className="relative hidden mt-auto lg:block" ref={dropdownRef}>
//         <button
//           onClick={() => setIsSettingsOpen(!isSettingsOpen)}
//           className="flex items-center justify-center w-full py-2 space-x-2 transition-all bg-gray-700 rounded-lg shadow-md hover:bg-cyan-500"
//         >
//           <Settings size={20} className="text-white" />
//           <span className="text-sm font-medium">Settings</span>
//         </button>

//         {isSettingsOpen && (
//           <div className="absolute right-0 w-40 mt-2 overflow-hidden bg-gray-800 border border-gray-600 rounded-lg shadow-lg top-full">
//             <button onClick={logoutFunction} className="flex items-center w-full px-4 py-2 text-left text-red-400 hover:bg-red-600 hover:text-white">
//               <LogOut size={16} className="mr-2" />
//               Logout
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Stats;