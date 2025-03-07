import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { FaGamepad, FaUser, FaCircle, FaTrophy, FaCode } from 'react-icons/fa'; // Icons for status and features

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [isChallenging, setIsChallenging] = useState(false); // For challenge button loading state
  const { loggedinUser } = useSelector((store) => store.user); // Assuming `loggedinUser` includes `_id`.

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get('http://localhost:9000/api/users/getfriends', {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        });
        setFriends(response.data.friends);
      } catch (error) {
        console.error('Error fetching friends:', error);
        toast.error('Failed to fetch friends.');
      }
    };

    if (loggedinUser && loggedinUser._id) fetchFriends();
  }, [loggedinUser]);

  const handleChallenge = async (friendId) => {
    setIsChallenging(true);
    try {
      // Simulate an API call to send a challenge
      await axios.post('/api/challenge', { friendId });
      toast.success('Challenge sent!');
    } catch (error) {
      console.error('Error sending challenge:', error);
      toast.error('Failed to send challenge.');
    } finally {
      setIsChallenging(false);
    }
  };

  return (
    <section className="friends-section p-6 min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Sticky Header */}
      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 sticky top-0 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-4 z-10">
        Friends
      </h3>

      {/* Friends List */}
      {friends.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No friends available.</p>
      ) : (
        <ul className="friends-list space-y-4 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-transparent">
          {friends.map((friend) => (
            <li
              key={friend._id}
              className="friend-item bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow duration-300 border border-white/20 dark:border-gray-700/20"
            >
              <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                {/* Friend Info */}
                <div className="friend-info flex items-center space-x-4">
                  <img
                    src={friend.avatar}
                    alt={friend.username}
                    className="avatar w-12 h-12 rounded-full object-cover border-2 border-purple-300 dark:border-purple-600"
                  />
                  <div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {friend.fullname}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      @{friend.username}
                    </p>
                  </div>
                </div>

                {/* Friend Actions */}
                <div className="friend-actions flex items-center space-x-4">
                  {/* Status Indicator */}
                  <div className="friend-status flex items-center space-x-2">
                    {friend.status === 'online' && (
                      <FaCircle className="text-green-500 animate-pulse" />
                    )}
                    {friend.status === 'in-game' && (
                      <FaGamepad className="text-blue-500" />
                    )}
                    {friend.status === 'offline' && (
                      <FaCircle className="text-gray-500" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        friend.status === 'online'
                          ? 'text-green-800 dark:text-green-200'
                          : friend.status === 'in-game'
                          ? 'text-blue-800 dark:text-blue-200'
                          : 'text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      {friend.status === 'online' && 'Online'}
                      {friend.status === 'in-game' && 'In-Game'}
                      {friend.status === 'offline' && 'Offline'}
                    </span>
                  </div>

                  {/* Challenge Button */}
                  <button
                    onClick={() => handleChallenge(friend._id)}
                    disabled={isChallenging || friend.status === 'offline'}
                    className={`bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:from-purple-700 hover:to-blue-700 ${
                      isChallenging || friend.status === 'offline'
                        ? 'opacity-50 cursor-not-allowed'
                        : 'hover:shadow-lg'
                    }`}
                  >
                    {isChallenging ? 'Sending...' : 'Challenge'}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Floating Action Button (FAB) */}
      <button className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 hover:shadow-xl">
        <FaUser className="w-6 h-6" />
      </button>

      {/* Additional Coding Battle Features */}
      <div className="mt-8">
        <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Coding Battle Features
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Leaderboard Card */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-white/20 dark:border-gray-700/20">
            <FaTrophy className="w-8 h-8 text-yellow-500 mb-4" />
            <h5 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Leaderboard
            </h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Check your rank among top coders.
            </p>
          </div>

          {/* Practice Arena Card */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-white/20 dark:border-gray-700/20">
            <FaCode className="w-8 h-8 text-blue-500 mb-4" />
            <h5 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Practice Arena
            </h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Sharpen your skills with coding problems.
            </p>
          </div>

          {/* Battle History Card */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 border border-white/20 dark:border-gray-700/20">
            <FaGamepad className="w-8 h-8 text-purple-500 mb-4" />
            <h5 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Battle History
            </h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Review your past battles and performance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Friends;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useSelector } from 'react-redux';
// import toast from 'react-hot-toast';
// import { FaGamepad, FaUser, FaCircle, FaTrophy, FaCode } from 'react-icons/fa'; // Icons for status and features

// const Friends = () => {
//   const [friends, setFriends] = useState([]);
//   const [isChallenging, setIsChallenging] = useState(false);
//   const { loggedinUser } = useSelector((store) => store.user);

//   useEffect(() => {
//     const fetchFriends = async () => {
//       try {
//         const response = await axios.get('http://localhost:9000/api/users/getfriends', {
//           headers: { 'Content-Type': 'application/json' },
//           withCredentials: true,
//         });
//         setFriends(response.data.friends);
//       } catch (error) {
//         console.error('Error fetching friends:', error);
//         toast.error('Failed to fetch friends.');
//       }
//     };

//     if (loggedinUser && loggedinUser._id) fetchFriends();
//   }, [loggedinUser]);

//   const handleChallenge = async (friendId) => {
//     setIsChallenging(true);
//     try {
//       await axios.post('/api/challenge', { friendId });
//       toast.success('Challenge sent!');
//     } catch (error) {
//       console.error('Error sending challenge:', error);
//       toast.error('Failed to send challenge.');
//     } finally {
//       setIsChallenging(false);
//     }
//   };

//   return (
//     <section className="friends-section p-6 min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
//       {/* Navbar */}
//       <nav className="sticky top-0 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-4 px-6 flex justify-between items-center shadow-md z-10">
//         <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Friends</h3>
//         <a href="/home" className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-blue-500">Home</a>
//       </nav>

//       {/* Friends List */}
//       {friends.length === 0 ? (
//         <p className="text-gray-600 dark:text-gray-400">No friends available.</p>
//       ) : (
//         <ul className="friends-list space-y-4 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-transparent">
//           {friends.map((friend) => (
//             <li key={friend._id} className="friend-item bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow duration-300 border border-white/20 dark:border-gray-700/20">
//               <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
//                 {/* Friend Info */}
//                 <div className="friend-info flex items-center space-x-4">
//                   <img
//                     src={friend.avatar}
//                     alt={friend.username}
//                     className="avatar w-12 h-12 rounded-full object-cover border-2 border-purple-300 dark:border-purple-600"
//                   />
//                   <div>
//                     <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{friend.fullname}</p>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">@{friend.username}</p>
//                   </div>
//                 </div>

//                 {/* Friend Actions */}
//                 <div className="friend-actions flex items-center space-x-4">
//                   <div className="friend-status flex items-center space-x-2">
//                     {friend.status === 'online' && <FaCircle className="text-green-500 animate-pulse" />}
//                     {friend.status === 'in-game' && <FaGamepad className="text-blue-500" />}
//                     {friend.status === 'offline' && <FaCircle className="text-gray-500" />}
//                     <span className={`text-sm font-medium ${friend.status === 'online' ? 'text-green-800 dark:text-green-200' : friend.status === 'in-game' ? 'text-blue-800 dark:text-blue-200' : 'text-gray-800 dark:text-gray-200'}`}>{friend.status}</span>
//                   </div>

//                   {/* Challenge Button */}
//                   <button
//                     onClick={() => handleChallenge(friend._id)}
//                     disabled={isChallenging || friend.status === 'offline'}
//                     className={`bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-300 hover:from-purple-700 hover:to-blue-700 ${isChallenging || friend.status === 'offline' ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'}`}
//                   >
//                     {isChallenging ? 'Sending...' : 'Challenge'}
//                   </button>
//                 </div>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </section>
//   );
// };

// export default Friends;
add