import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Match = () => {
  const { loggedinUser } = useSelector((store) => store.user);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const socket = io('http://localhost:9000', {
      query: { userId: loggedinUser?._id },
    });

    socket.on('getOnlineUsers', (users) => {
      console.log('Online users:', users);
      setOnlineUsers(users);
    });

    return () => {
      socket.off('getOnlineUsers');
      socket.disconnect();
    };
  }, [loggedinUser?._id]);

  // Filter out the logged-in user from the list of online users
  const filteredUsers = onlineUsers.filter(
    (userName) => userName !== loggedinUser?.username
  );

  const handlePlay = (opponentUsername) => {
    const socket = io('http://localhost:9000', {
      query: { userId: loggedinUser?._id },
    });
  
    socket.emit('playRequest', { opponentUsername });
  
    socket.on('playNotification', ({ roomName, initiator }) => {
      if (initiator !== loggedinUser.username) {
        const accept = window.confirm(`${initiator} has challenged you to a match. Do you accept?`);
        if (accept) {
          socket.emit('joinRoom', roomName);
          navigate(`/problem`, { state: { roomName } });
        }
      }
    });
  
    socket.on('opponentOffline', ({ message }) => {
      alert(message);
    });
  };
  

  // Handle "Add Friend" button click
  const handleAddFriend = async (friendUsername) => {
    try {
      console.log(loggedinUser.username)
      const response = await axios.post('http://localhost:9000/api/users/sendfriendrequest', {
        senderUsername: loggedinUser.username,
        receiverUsername: friendUsername,
      });
      alert(response.data.message);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to send friend request.');
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
