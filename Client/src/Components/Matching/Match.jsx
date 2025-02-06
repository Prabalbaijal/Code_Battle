import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Match = () => {
  const { loggedinUser, onlineUsers } = useSelector((store) => store.user);
  const { socket } = useSelector((store) => store.socket);
  const navigate = useNavigate();

  const [challengeDetails, setChallengeDetails] = useState(null);
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);
  const [waitingMessage, setWaitingMessage] = useState('');
  const [isRequestSentModalOpen, setIsRequestSentModalOpen] = useState(false);
  const [friends, setFriends] = useState([]);
  const [otherUsers, setOtherUsers] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);

  useEffect(() => {
    if (!loggedinUser?._id || !socket) return;

    // Fetch friends list
    const fetchFriends = async () => {
      try {
        const response = await axios.get('http://localhost:9000/api/users/getfriends', {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
      });
        setFriends(response.data.friends);
      } catch (error) {
        console.error('Error fetching friends:', error);
        toast.error('Failed to fetch friends');
      }
    };

    fetchFriends();

    // Opponent ne challenge bheja
    socket.on('playNotification', ({ roomName, initiator }) => {
      console.log("Received playNotification from", initiator);

      if (initiator !== loggedinUser.username) {
        setChallengeDetails({ roomName, initiator });
        setIsChallengeModalOpen(true);
      }
    });

    // Match start hone par problem page par navigate
    socket.on('startContest', ({ roomName, endTime }) => {
      console.log("startContest received. Navigating to problem page:", roomName);
      navigate('/problem', { state: { roomName, endTime } });
    });

    // Opponent left
    socket.on('opponentOffline', ({ message }) => {
      console.log("Opponent offline:", message);
      toast.error(message);
    });

    // Request sent confirmation
    socket.on('requestSent', ({ message }) => {
      setWaitingMessage(message);
      setIsRequestSentModalOpen(true);
    });

    return () => {
      socket.off('playNotification');
      socket.off('startContest');
      socket.off('opponentOffline');
      socket.off('requestSent');
    };
  }, [loggedinUser?._id, socket, navigate]);

  useEffect(() => {
    if (onlineUsers.length > 0 && friends.length > 0) {
      const friendsOnline = friends.filter(friend => onlineUsers.includes(friend.username));
      const filteredOthers = onlineUsers.filter(user => 
        !friendsOnline.some(friend => friend.username === user) && user !== loggedinUser.username
      );
  
      setOnlineFriends(friendsOnline);
      setOtherUsers(filteredOthers);
    }
  }, [onlineUsers, friends, loggedinUser.username]);

  // Accept Challenge
  const acceptChallenge = () => {
    if (challengeDetails) {
      console.log("Accepted challenge. Emitting joinRoom with roomName:", challengeDetails.roomName);
      socket.emit("joinRoom", challengeDetails.roomName);
      setIsChallengeModalOpen(false);
    }
  };

  // Reject Challenge
  const declineChallenge = () => {
    setChallengeDetails(null);
    setIsChallengeModalOpen(false);
  };

  // Play Request
  const handlePlay = (opponentUsername) => {
    if (!socket) return;
    socket.emit('playRequest', { opponentUsername });
    toast.success(`Play request sent to ${opponentUsername}`);
  };

  // Add Friend
  const handleAddFriend = async (friendUsername) => {
    try {
      const response = await axios.post('http://localhost:9000/api/users/sendfriendrequest', {
        senderUsername: loggedinUser.username,
        receiverUsername: friendUsername,
      });
      toast.success(response.data.message);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to send friend request.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-gray-100 bg-gray-900">
      <h3 className="mb-6 text-3xl font-bold">Online Users</h3>

      {/* Friends Section */}
{onlineFriends.length > 0 && (
  <div className="w-full max-w-md mb-6 bg-gray-800 rounded-lg shadow-lg">
    <h4 className="px-4 py-2 text-lg font-semibold text-gray-300">Friends (Online)</h4>
    <ul className="divide-y divide-gray-700">
      {onlineFriends.map((friend, index) => (
        <li key={index} className="flex items-center justify-between px-4 py-3 hover:bg-gray-700">
          <span className="font-medium text-gray-100">{friend.username}</span>
          <div className="flex space-x-2">
            <button className="btn btn-success btn-sm" onClick={() => handlePlay(friend.username)}>
              Play
            </button>
          </div>
        </li>
      ))}
    </ul>
  </div>
)}

      {/* Other Users Section */}
      {otherUsers.length > 0 ? (
        <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg">
          <h4 className="px-4 py-2 text-lg font-semibold text-gray-300">Other Users</h4>
          <ul className="divide-y divide-gray-700">
            {otherUsers.map((userName, index) => (
              <li key={index} className="flex items-center justify-between px-4 py-3 hover:bg-gray-700">
                <span className="font-medium text-gray-100">{userName}</span>
                <div className="flex space-x-2">
                  <button className="btn btn-success btn-sm" onClick={() => handlePlay(userName)}>
                    Play
                  </button>
                  <button className="btn btn-info btn-sm" onClick={() => handleAddFriend(userName)}>
                    Add Friend
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-lg text-gray-400">No other users online.</p>
      )}

      {/* Challenge Modal */}
      {isChallengeModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 text-center bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-xl font-semibold">
              {challengeDetails?.initiator} has challenged you to a match!
            </h2>
            <p className="text-gray-600">Do you accept?</p>
            <div className="flex justify-center mt-4 space-x-4">
              <button
                onClick={acceptChallenge}
                className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
              >
                Accept
              </button>
              <button
                onClick={declineChallenge}
                className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Request Sent Modal */}
      {isRequestSentModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 text-center bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-xl font-semibold">Waiting for opponent...</h2>
            <p className="text-gray-600">{waitingMessage || "Waiting for the opponent to accept the match request."}</p>
            <button
              onClick={() => setIsRequestSentModalOpen(false)}
              className="px-4 py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Match;
