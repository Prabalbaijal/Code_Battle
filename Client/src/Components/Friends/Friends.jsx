import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { FaGamepad, FaUser, FaCircle,FaSearch,FaUserPlus } from 'react-icons/fa';
import Header from '../Header/Header';

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading,setLoading]=useState(true)
  const { loggedinUser } = useSelector((store) => store.user);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/users/getfriends`, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        });
        setFriends(response.data.friends);
        setLoading(false);
      } catch (error) {
        // console.error('Error fetching friends:', error);
        toast.error(error.message);
        setLoading(false);
      }
    };

    if (loggedinUser && loggedinUser._id) fetchFriends();
  }, [loggedinUser]);
  useEffect(()=>{
    if(searchQuery===''){
      setSearchResults([])
    }
  },[searchQuery])

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    toast.loading("Searching for users",{id: 'search-toast'})
    try {
      //console.log(searchQuery)
      const res = await axios.get(`${BACKEND_URL}/api/users/search?query=${searchQuery}`, {
        withCredentials: true,
      });
      toast.dismiss('search-toast')
      setSearchResults(res.data.users);
    } catch (error) {
      // console.error('Search failed:', error);
      toast.error(error.message,{id:'search-toast'});
    }
  };

  const handleAddFriend = async (friendUsername) => {
    toast.loading('Sending Friend request',{id:'friend-request-toast'})
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const response = await axios.post(`${BACKEND_URL}/api/users/sendfriendrequest`, {
        senderUsername: loggedinUser?.username,
        receiverUsername: friendUsername,
      });
  
      toast.success(response.data.message,{id:'friend-request-toast'});
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to send friend request.',{id:'friend-request-toast'});
    }
  };
  
  return (
    <section className="min-h-screen p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="fixed top-0 left-0 z-50 w-full bg-white shadow-md">
        <Header />
      </div>

      <div className="flex flex-col items-center w-full p-6 pt-24 m-auto sm:max-w-[50vw]">
        <h1 className="mt-4 mb-6 text-3xl font-bold text-center dark:text-gray-100">
          Your Friends
        </h1>

        {/* 🔍 Search Section */}
        <div className="flex w-full mb-6 space-x-2">
          <input
            type="text"
            placeholder="Search by username to add friend..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 dark:bg-gray-800 dark:text-white"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700"
          >
            <FaSearch />
          </button>
        </div>

        {/* 🔍 Search Results */}
        {searchResults.length > 0 && (
          <div className="w-full p-4 mb-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <h2 className="mb-2 text-xl font-semibold dark:text-white">Search Results</h2>
            <ul className="space-y-3">
              {searchResults.map((user) => (
                <li key={user._id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-100">
                        {user.fullname}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddFriend(user.username)}
                    className="flex items-center px-3 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700"
                  >
                    <FaUserPlus className="mr-1" /> Add
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      
        {/* Scrollable Friends List */}
        <div className="w-full max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-transparent">
          {loading ? (
    <p className="mt-6 text-gray-600 dark:text-gray-400">Loading friends...</p>
  ):
          friends?.length === 0 ? (
            <p className="mt-6 text-gray-600 dark:text-gray-400">You don't have any friends.</p>
          ) : (
            <ul className="space-y-4">
              {friends.map((friend) => (
                <li
                  key={friend._id}
                  className="p-4 transition-shadow duration-300 border rounded-lg shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-md hover:shadow-xl border-white/20 dark:border-gray-700/20"
                >
                  <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
                    <div className="flex items-center space-x-4">
                      <img
                        src={friend.avatar}
                        alt={friend.username}
                        className="object-cover w-12 h-12 border-2 border-purple-300 rounded-full dark:border-purple-600"
                      />
                      <div>
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{friend.fullname}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">@{friend.username}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
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
        </div>
      </div>
    </section>
  );
};

export default Friends;
