// import React from 'react';
// import ProfileHeader from './ProfileHeader';
// import Stats from './Stats';
// import PerformanceGraph from './PerformanceGraph';
// import ContestHistory from './ContestHistory';
// import './Profile.css';

// const Profile = () => {
//   return (
//     <div className="profile-page h-screen w-full flex flex-col">
//       {/* Header */}
//       <ProfileHeader />

//       {/* Main Content */}
//       <div className="flex h-full">
//         {/* Left Sidebar (25%) */}
//         <div className="w-1/4 bg-gray-100 border-r border-gray-300">
//           <Stats />
//         </div>

//         {/* Right Content (75%) */}
//         <div className="w-3/4 p-4 flex flex-col space-y-4">
//           {/* Performance Graph */}
//           <div className="flex-1 bg-gray-50 shadow-sm p-4 rounded-lg">
//             <PerformanceGraph />
//           </div>

//           {/* Contest History */}
//           <div className="flex-1 bg-gray-50 shadow-sm p-4 rounded-lg overflow-y-auto">
//             <ContestHistory />
//           </div>
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
import './Profile.css';

const Profile = () => {
  const [matchHistory, setMatchHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get("http://localhost:9000/api/users/updateprofile", {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });

        // Extracting match history from the API response
        setMatchHistory(response.data.matchHistory);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  return (
    <div className="profile-page h-screen w-full flex flex-col">
      {/* Header */}
      <ProfileHeader />

      {/* Main Content */}
      <div className="flex h-full">
        {/* Left Sidebar (25%) */}
        <div className="w-1/4 bg-gray-100 border-r border-gray-300">
          <Stats />
        </div>

        {/* Right Content (75%) */}
        <div className="w-3/4 p-4 flex flex-col space-y-4">
          {/* Performance Graph */}
          <div className="flex-1 bg-white shadow p-4">
            <PerformanceGraph />
          </div>

          {/* Contest History */}
          <div className="flex-1 bg-white shadow p-4 overflow-y-auto">
            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : (
              <ContestHistory contests={matchHistory} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
