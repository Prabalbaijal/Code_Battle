
// import React, { useEffect, useState } from 'react';
// import ProfileHeader from './ProfileHeader';
// import Stats from './Stats';
// import PerformanceGraph from './PerformanceGraph';
// import ContestHistory from './ContestHistory';
// import axios from 'axios';
// import { Settings, LogOut } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// import { setLoggedinUser } from '../../redux/userSlice.js';
// import toast from 'react-hot-toast';

// const Profile = () => {
//   const [matchHistory, setMatchHistory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isSmallScreen, setIsSmallScreen] = useState(false);
//   const [isSettingsOpen, setIsSettingsOpen] = useState(false);
//   const [level, setlevel] = useState(null);
//   const [coins, setCoins] = useState(null);

//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const fetchProfileData = async () => {
//       try {
//         const response = await axios.get("http://localhost:9000/api/users/updateprofile", {
//           headers: { "Content-Type": "application/json" },
//           withCredentials: true,
//         });

//         setMatchHistory(response.data.matchHistory);
//         setlevel(response.data.level);  // Set level
//         setCoins(response.data.coins);    // Set coins
//       } catch (error) {
//         console.error("Error fetching profile data:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfileData();

//     // Detect screen size
//     const handleResize = () => {
//       setIsSmallScreen(window.innerWidth < 1024);
//     };

//     handleResize(); // Initial check
//     window.addEventListener("resize", handleResize);

//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   const logoutFunction = async () => {
//     try {
//       const res = await axios.get('http://localhost:9000/api/users/logout');
//       navigate("/");
//       toast.success(res.data.message);
//       dispatch(setLoggedinUser(null));
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div className="profile-page min-h-screen flex flex-col">
//       {/* Header */}
//       <ProfileHeader />

//       {/* Main Content */}
//       <div className="flex flex-col lg:flex-row flex-grow">
//         {/* Stats (Sidebar on large, Full-width on small) */}
//         <div className="w-full lg:w-1/4 bg-gray-100 border-b lg:border-r border-gray-300 p-4">
//           {/* Pass level and coins as props to Stats */}
//           <Stats level={level} coins={coins} />
//         </div>

//         {/* Main Section */}
//         <div className="w-full lg:w-3/4 flex flex-col p-4 space-y-4">
//           {/* Performance Graph */}
//           <div className="bg-white shadow p-4 rounded-lg">
//             <PerformanceGraph />
//           </div>

//           {/* Contest History */}
//           <div className="bg-white shadow p-4 rounded-lg flex-1 overflow-y-auto max-h-[300px]">
//             {loading ? (
//               <p className="text-center text-gray-500">Loading...</p>
//             ) : (
//               <ContestHistory contests={matchHistory} />
//             )}
//           </div>

//           {/* Settings Button at Bottom on Small Screens */}
//           {isSmallScreen && (
//             <div className="mt-4 relative">
//               <button
//                 onClick={() => setIsSettingsOpen(!isSettingsOpen)}
//                 className="w-full py-2 bg-gray-200 text-gray-800 rounded-lg flex items-center justify-center space-x-2 shadow-md hover:bg-gray-300 transition-all"
//               >
//                 <Settings size={20} />
//                 <span className="text-sm font-medium">Settings</span>
//               </button>

//               {/* Dropdown Menu for Logout */}
//               {isSettingsOpen && (
//                 <div className="absolute left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 top-[-37px]">
//                   <button
//                     onClick={logoutFunction}
//                     className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center"
//                   >
//                     <LogOut size={16} className="mr-2" />
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;


import React, { useEffect, useState } from 'react';
import ProfileHeader from './ProfileHeader';
import Stats from './Stats';
import PerformanceGraph from './PerformanceGraph';
import ContestHistory from './ContestHistory';
import axios from 'axios';
import { Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLoggedinUser } from '../../redux/userSlice.js';
import toast from 'react-hot-toast';

const Profile = () => {
  const [matchHistory, setMatchHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [level, setLevel] = useState(null);
  const [coins, setCoins] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get("http://localhost:9000/api/users/updateprofile", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });

        setMatchHistory(response.data.matchHistory);
        setLevel(response.data.level);  // Set level
        setCoins(response.data.coins);    // Set coins
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();

    // Detect screen size
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    <div className="profile-page min-h-screen flex flex-col">
      {/* Header */}
      <ProfileHeader />

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row flex-grow max-h-screen overflow-hidden">
        {/* Stats (Sidebar on large, Full-width on small) */}
        <div className="w-full lg:w-1/4 bg-gray-100 border-b lg:border-r border-gray-300 p-4">
          {/* Pass level and coins as props to Stats */}
          <Stats level={level} coins={coins} />
        </div>

        {/* Main Section */}
        <div className="w-full lg:w-3/4 flex flex-col p-4 space-y-4 overflow-hidden">
          {/* Performance Graph */}
          <div className="bg-white shadow p-4 rounded-lg">
            <PerformanceGraph />
          </div>

          {/* Contest History */}
          <div className="bg-white shadow p-4 rounded-lg flex-1 overflow-hidden">
            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : (
              <ContestHistory contests={matchHistory} />
            )}
          </div>

          {/* Settings Button at Bottom on Small Screens */}
          {isSmallScreen && (
            <div className="mt-4 relative">
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="w-full py-2 bg-gray-200 text-gray-800 rounded-lg flex items-center justify-center space-x-2 shadow-md hover:bg-gray-300 transition-all"
              >
                <Settings size={20} />
                <span className="text-sm font-medium">Settings</span>
              </button>

              {/* Dropdown Menu for Logout */}
              {isSettingsOpen && (
                <div className="absolute left-0 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 top-[-37px]">
                  <button
                    onClick={logoutFunction}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
