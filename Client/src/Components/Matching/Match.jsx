import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Header from '../Header/Header';
import { setRequestSentModal } from '../../redux/uiSlice';

const Match = () => {
  const { loggedinUser, onlineUsers } = useSelector((store) => store.user);
  const { socket } = useSelector((store) => store.socket);
  const navigate = useNavigate();
  const dispatch=useDispatch();
  const {requestSentModal,waitingMessage}=useSelector((state)=>state.ui)

  const [friends, setFriends] = useState([]);
  const [otherUsers, setOtherUsers] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [sentRequests, setSentRequests] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [opponentName, setOpponentName] = useState('');


  useEffect(() => {
    console.log(loggedinUser,socket)
    if (!loggedinUser?._id || !socket) return;

    const fetchFriends = async () => {
      try {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
        const response = await axios.get(`${BACKEND_URL}/api/friends/getfriends`, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        });
        console.log(response)
        setFriends(response.data.friends);
      } catch (error) {
        console.error('Error fetching friends:', error);
        toast.error('Failed to fetch friends');
      }
    };

    fetchFriends();

  }, [loggedinUser?._id, socket, navigate]);
  useEffect(() => {
    if (!onlineUsers || !loggedinUser) return;
  
    const friendUsernames = new Set(friends?.map(friend => friend.username) || []);
    
    // Filter online friends (EXCLUDE logged-in user)
    const friendsOnline = onlineUsers.filter(user => 
      friendUsernames.has(user.userName) && 
      user.userName !== loggedinUser.username
    );
  
    // Filter other online users (EXCLUDE logged-in user, but include when friends is empty)
    const filteredOthers = onlineUsers.filter(user => 
      (!friendUsernames.has(user.userName) || friends.length === 0) && 
      user.userName !== loggedinUser.username
    );
  
    setOnlineFriends(friendsOnline);
    setOtherUsers(filteredOthers);
  }, [onlineUsers, friends, loggedinUser?.username]);
  
  const filteredOnlineFriends = onlineFriends.filter(user =>
    user.userName.toLowerCase().includes(searchTerm)
  );
  
  const filteredOtherUsers = otherUsers.filter(user =>
    user.userName.toLowerCase().includes(searchTerm)
  );
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

const handleAddFriend = async (friendUsername) => {
  try {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const response = await axios.post(`${BACKEND_URL}/api/friends/sendfriendrequest`, {
      senderUsername: loggedinUser?.username,
      receiverUsername: friendUsername,
    },{
      withCredentials:true
    });

    toast.success(response.data.message);

    // Disable button for this user
    setSentRequests((prev) => ({ ...prev, [friendUsername]: true }));
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || 'Failed to send friend request.');
  }
};

  if (!loggedinUser) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        <p>Loading user data...</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-gray-100 bg-gray-900">
      <div className="fixed top-0 left-0 z-50 w-full bg-white shadow-md">
        <Header />
      </div>
      
      <h3 className="mb-6 text-3xl font-bold">Online Users</h3>
      <input
  type="text"
  placeholder="Search by username..."
  className="w-full max-w-md px-4 py-2 mb-6 text-white placeholder-gray-400 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
/>

      {/* Friends Section */}
      {onlineFriends.length > 0 ? (
        <div className="w-full max-w-md mb-6 bg-gray-800 rounded-lg shadow-lg">
          <h4 className="px-4 py-2 text-lg font-semibold text-gray-300">Friends (Online)</h4>
          <ul className="divide-y divide-gray-700">
            {filteredOnlineFriends.map(({ userName, inContest }, index) => (
              <li key={index} className="flex items-center justify-between px-4 py-3 hover:bg-gray-700">
                <span className="font-medium text-gray-100">
                  {userName} {inContest ? "(In Contest)" : "(Available)"}
                </span>
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => handlePlay(userName)}
                  disabled={inContest}
                >
                  Play
                </button>
              </li>
            ))}
          </ul>
        </div>
      ):(
        <p className="text-lg text-gray-400">No friends online.</p>
      )}

      {/* Other Users Section */}
      {filteredOtherUsers.length > 0 ? (
        <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg">
          <h4 className="px-4 py-2 text-lg font-semibold text-gray-300">Other Users</h4>
          <ul className="divide-y divide-gray-700">
            {otherUsers.map(({ userName, inContest }, index) => (
              <li key={index} className="flex items-center justify-between px-4 py-3 hover:bg-gray-700">
                <span className="font-medium text-gray-100">
                  {userName} {inContest ? "(In Contest)" : "(Available)"}
                </span>
                <div className="flex space-x-2">
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handlePlay(userName)}
                    disabled={inContest}
                  >
                    Play
                  </button>
                  <button
  className="btn btn-info btn-sm"
  onClick={() => handleAddFriend(userName)}
  disabled={sentRequests[userName]}
>
  {sentRequests[userName] ? "Request Sent" : "Add Friend"}
</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-lg text-gray-400">No other users online.</p>
      )}

      {/* Request Sent Modal */}
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

    </div>

  );
};

export default Match;
