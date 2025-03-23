// import React, { useEffect, useState } from "react";
// import ProfileHeader from "./ProfileHeader";
// import Stats from "./Stats";
// import PerformanceGraph from "./PerformanceGraph";
// import ContestHistory from "./ContestHistory";
// import axios from "axios";
// import { Settings, LogOut } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { setLoggedinUser } from "../../redux/userSlice.js";
// import toast from "react-hot-toast";

// const Profile = () => {
//   const [matchHistory, setMatchHistory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isSmallScreen, setIsSmallScreen] = useState(false);
//   const [isSettingsOpen, setIsSettingsOpen] = useState(false);
//   const [level, setLevel] = useState(null);
//   const [coins, setCoins] = useState(null);

//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const fetchProfileData = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:9000/api/users/updateprofile",
//           {
//             headers: { "Content-Type": "application/json" },
//             withCredentials: true,
//           }
//         );

//         setMatchHistory(response.data.matchHistory);
//         setLevel(response.data.level);
//         setCoins(response.data.coins);
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
//       const res = await axios.get("http://localhost:9000/api/users/logout");
//       navigate("/");
//       toast.success(res.data.message);
//       dispatch(setLoggedinUser(null));
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div className="flex flex-col min-h-screen">
//       {/* Header */}
//       <ProfileHeader />

//       {/* Main Content */}
//       <div className="flex flex-col flex-grow max-h-screen pt-12 lg:flex-row">
//         {/* Sidebar (Stats) */}
//         <div className="w-full p-4 bg-gray-100 border-b border-gray-300 lg:w-1/4 lg:border-r">
//           <Stats level={level} coins={coins} />
//         </div>

//         {/* Main Section */}
//         <div className="flex flex-col w-full p-4 space-y-4 overflow-hidden lg:w-3/4">
//           {/* Performance Graph (Fix Height Issue) */}
//           <div className="p-4 bg-white rounded-lg shadow flex-grow max-h-[400px]">
//             <PerformanceGraph />
//           </div>

//           {/* Contest History (Fix Layout Issue) */}
//           <div className="p-4 bg-white rounded-lg shadow flex-grow overflow-y-auto max-h-[300px]">
//             {loading ? (
//               <p className="text-center text-gray-500">Loading...</p>
//             ) : (
//               <ContestHistory contests={matchHistory} />
//             )}
//           </div>

//           {/* Settings Button for Small Screens */}
//           {isSmallScreen && (
//             <div className="relative mt-4">
//               <button
//                 onClick={() => setIsSettingsOpen(!isSettingsOpen)}
//                 className="flex items-center justify-center w-full py-2 space-x-2 text-gray-800 transition-all bg-gray-200 rounded-lg shadow-md hover:bg-gray-300"
//               >
//                 <Settings size={20} />
//                 <span className="text-sm font-medium">Settings</span>
//               </button>

//               {/* Dropdown Menu for Logout */}
//               {isSettingsOpen && (
//                 <div className="absolute left-0 z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg top-full">
//                   <button
//                     onClick={logoutFunction}
//                     className="flex items-center w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
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



import React, { useEffect, useState } from "react";
import ProfileHeader from "./ProfileHeader";
import Stats from "./Stats";
import PerformanceGraph from "./PerformanceGraph";
import ContestHistory from "./ContestHistory";
import axios from "axios";
import { Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoggedinUser } from "../../redux/userSlice.js";
import toast from "react-hot-toast";
import "./Profile.css";

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
        const response = await axios.get(
          "http://localhost:9000/api/users/updateprofile",
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );

        setMatchHistory(response.data.matchHistory);
        setLevel(response.data.level);
        setCoins(response.data.coins);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();

    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const logoutFunction = async () => {
    try {
      const res = await axios.get("http://localhost:9000/api/users/logout");
      navigate("/");
      toast.success(res.data.message);
      dispatch(setLoggedinUser(null));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="profile-container">
      <ProfileHeader />

      <div className="profile-main">
        <div className="profile-sidebar">
          <Stats level={level} coins={coins} />
        </div>

        <div className="profile-content">
          <div className="profile-graph">
            <PerformanceGraph />
          </div>

          <div className="profile-history">
            {loading ? (
              <p className="loading-text">Loading...</p>
            ) : (
              <ContestHistory contests={matchHistory} />
            )}
          </div>

          {isSmallScreen && (
            <div className="settings-container">
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="settings-button"
              >
                <Settings size={20} />
                <span>Settings</span>
              </button>

              {isSettingsOpen && (
                <div className="settings-dropdown">
                  <button
                    onClick={logoutFunction}
                    className="logout-button"
                  >
                    <LogOut size={16} className="logout-icon" />
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
