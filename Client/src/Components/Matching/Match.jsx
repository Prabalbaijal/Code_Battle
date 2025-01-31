import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

let socket; // Ensure a single instance of the socket connection

const Match = () => {
  const { loggedinUser } = useSelector((store) => store.user);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedinUser?._id) {
      socket = io('http://localhost:9000', {
        query: { userId: loggedinUser._id },
      });
  
      socket.on('getOnlineUsers', (users) => {
        setOnlineUsers(users);
      });
  
      socket.on('playNotification', ({ roomName, initiator }) => {
        if (initiator !== loggedinUser.username) {
          const accept = window.confirm(`${initiator} has challenged you to a match. Do you accept?`);
          if (accept) {
            socket.emit('acceptRequest', roomName); // Notify the server
            navigate(`/problem`, { state: { roomName } });
          }
        }
      });
  
      socket.on('startContest', ({ roomName }) => {
        navigate(`/problem`, { state: { roomName } });
      });
  
      socket.on('opponentOffline', ({ message }) => {
        toast.error(message);
      });
  
      return () => {
        socket.disconnect();
        socket = null;
      };
    }
  }, [loggedinUser?._id, navigate]);
  

  const filteredUsers = onlineUsers.filter(
    (userName) => userName !== loggedinUser?.username
  );

  const handlePlay = (opponentUsername) => {
    if (!socket) return;

    socket.emit('playRequest', { opponentUsername });
    toast.success(`Play request sent to ${opponentUsername}`);
  };

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

      {filteredUsers.length === 0 ? (
        <p className="text-lg text-gray-400">No other users online.</p>
      ) : (
        <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-lg">
          <ul className="divide-y divide-gray-700">
            {filteredUsers.map((userName, index) => (
              <li
                key={index}
                className="flex items-center justify-between px-4 py-3 hover:bg-gray-700"
              >
                <span className="font-medium text-gray-100">{userName}</span>
                <div className="flex space-x-2">
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handlePlay(userName)}
                  >
                    Play
                  </button>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => handleAddFriend(userName)}
                  >
                    Add Friend
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Match;