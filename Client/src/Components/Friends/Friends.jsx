
import React, { useEffect, useState } from 'react';
import ProfileHeader from '../Profile/ProfileHeader';
import axios from 'axios';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { FaGamepad, FaUser, FaCircle } from 'react-icons/fa';

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const { loggedinUser } = useSelector((store) => store.user);

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

  return (
    <section className="friends-section p-6 min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Navbar */}
      <nav className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 flex justify-between items-center shadow-md z-10 rounded-lg">
        <h3 className="text-2xl font-bold">Friends</h3>
        <div className="space-x-6">
          <a href="/home" className="hover:underline">Home</a>
          <a href="/profile" className="hover:underline">Profile</a>
          
        </div>
      </nav>

      {/* Friends List */}
      {friends.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 mt-6">No friends available.</p>
      ) : (
        <ul className="friends-list space-y-4 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-transparent mt-6">
          {friends.map((friend) => (
            <li
              key={friend._id}
              className="friend-item bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow duration-300 border border-white/20 dark:border-gray-700/20"
            >
              <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                <div className="friend-info flex items-center space-x-4">
                  <img
                    src={friend.avatar}
                    alt={friend.username}
                    className="avatar w-12 h-12 rounded-full object-cover border-2 border-purple-300 dark:border-purple-600"
                  />
                  <div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{friend.fullname}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">@{friend.username}</p>
                  </div>
                </div>

                <div className="friend-status flex items-center space-x-2">
                  {friend.status === 'online' && <FaCircle className="text-green-500 animate-pulse" />}
                  {friend.status === 'in-game' && <FaGamepad className="text-blue-500" />}
                  {friend.status === 'offline' && <FaCircle className="text-gray-500" />}
                  <span
                    className={`text-sm font-medium ${
                      friend.status === 'online' ? 'text-green-800 dark:text-green-200' :
                      friend.status === 'in-game' ? 'text-blue-800 dark:text-blue-200' :
                      'text-gray-800 dark:text-gray-200'
                    }`}
                  >
                    {friend.status}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Friends;