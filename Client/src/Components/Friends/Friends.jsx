import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {FaUserPlus } from 'react-icons/fa';
import Header from '../Header/Header';
import { setRequestSentModal } from '../../redux/uiSlice';
import { useRef } from 'react';

const Friends = () => {
  const [friends, setFriends] = useState([]);
  const {socket}=useSelector((store)=>store.socket)
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading,setLoading]=useState(true)
  const {requestSentModal,waitingMessage}=useSelector((state)=>state.ui)
  const debounceTimer = useRef(null);
  const { loggedinUser } = useSelector((store) => store.user);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const {onlineUsers}=useSelector(store=>store.user)
   const [opponentName, setOpponentName] = useState('');
  const onlineusers=onlineUsers && onlineUsers.filter((friend)=>{
    return friend.inContest===false
  }).map((f)=>{
    return f.userName
  })
  // console.log(onlineusers)
  const handlePlay = (opponentUsername) => {
      if (!socket) return;
      setOpponentName(opponentUsername); 
      socket.emit('playRequest', { opponentUsername });
    };
  
    const handleCloseModal = () => {
      console.log(opponentName)
      if (socket && loggedinUser) {
        socket.emit("cancelChallenge", { 
          opponent:opponentName ,
          initiator: loggedinUser.username,
        });
      }
      dispatch(setRequestSentModal(false));
      setOpponentName('');
    };
  
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/friends/getfriends`, {
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

  const handleSearchChange = (e) => {
  const query = e.target.value;
  setSearchQuery(query); // update input immediately

  if (debounceTimer.current) {
    clearTimeout(debounceTimer.current);
  }

  debounceTimer.current = setTimeout(() => {
    callSearchApi(query);
  }, 400);
};

  
  const callSearchApi = async (query) => {
  if (!query.trim()) return;
  toast.loading("Searching for users", { id: 'search-toast' });

  try {
    const res = await axios.get(`${BACKEND_URL}/api/users/search?query=${query}`, {
      withCredentials: true,
    });
    toast.dismiss('search-toast');
    setSearchResults(res.data.users);
  } catch (error) {
    toast.error(error.message, { id: 'search-toast' });
  }
};
  
  const handleAddFriend = async (friendUsername) => {
    toast.loading('Sending Friend request',{id:'friend-request-toast'})
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
      const response = await axios.post(`${BACKEND_URL}/api/friends/sendfriendrequest`, {
        senderUsername: loggedinUser?.username,
        receiverUsername: friendUsername,
      },{withCredentials:true});
  
      toast.success(response.data.message,{id:'friend-request-toast'});
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to send friend request.',{id:'friend-request-toast'});
    }
  };

  const handleRemoveFriend= async(friendUsername) => {
    try{
    const BACKEND_URL=import.meta.env.VITE_BACKEND_URL
    const res=await axios.put(`${BACKEND_URL}/api/friends/remove`,{
      friendUserName:friendUsername
    },{withCredentials:true})
    setFriends((prev) => prev.filter(friend => friend.username !== friendUsername));
    toast.success(res.data.message)
    }catch(error){
      toast.error('Error removing friend.')
    }
  }
  
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
            onChange={handleSearchChange}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/*  Search Results */}
        {searchResults.length > 0 && (
          <div className="w-full p-4 mb-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
            <h2 className="mb-2 text-xl font-semibold dark:text-white">Search Results</h2>
            <ul className="space-y-3">
              {searchResults.map((user) => (
                <li key={user._id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`avatar ${onlineusers?.includes(user.username) ? 'online' : '' }`}>
                    <div className='w-10 rounded-full'>
                        <img alt="userprofile" src={user?.avatar} />
                    </div>
                  </div>
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
                        <div className={`avatar ${onlineusers?.includes(friend.username) ? 'online' : '' }`}>
                    <div className='w-12 rounded-full'>
                        <img alt="userprofile" src={friend?.avatar} />
                    </div>
                  </div>
                  
                      <div>
                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{friend.fullname}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">@{friend.username}</p>
                      </div>
                    </div>
                    <div className='flex justify-around'>    
                    <button className="m-2 btn btn-success btn-sm" disabled={!onlineusers?.includes(friend.username)} onClick={()=>{handlePlay(friend.username)}}>Play</button>
                    <button className="m-2 btn btn-info btn-sm" onClick={()=>{handleRemoveFriend(friend.username)}}>Remove Friend</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {requestSentModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
    <div className="p-6 text-center bg-gray-900 border border-gray-700 rounded-lg shadow-2xl w-80">
      <h2 className="mb-3 text-xl font-semibold text-white">Waiting for Opponent...</h2>

      <p className="text-gray-400">
        {waitingMessage || "Waiting for the opponent to accept the match request."}
        <br></br>
        Don't refresh page without cancelling your request.
      </p>

      <button
        onClick={handleCloseModal}
        className="px-4 py-2 mt-4 text-white transition duration-200 bg-blue-600 rounded-lg hover:bg-blue-500"
      >
        Cancel
      </button>
    </div>
  </div>
)}
    </section>
  );
};

export default Friends;
