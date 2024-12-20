import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

const Match = () => {
  const { loggedinUser } = useSelector((store) => store.user);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    // Initialize socket connection with the logged-in user's ID
    const socket = io('http://localhost:9000', {
      query: { userId: loggedinUser?._id }, // Replace with dynamic userId
    });

    // Listen for the list of online users (userNames)
    socket.on('getOnlineUsers', (users) => {
      console.log('Online users:', users); // users will be an array of user names
      setOnlineUsers(users);
    });

    // Clean up the socket connection on component unmount
    return () => {
      socket.off('getOnlineUsers');
      socket.disconnect();
    };
  }, [loggedinUser?._id]); // Reconnect socket on userId change

  return (
    <div>
      <h3>Online Users</h3>
      <ul>
        {onlineUsers.map((userName, index) => (
          <li key={index}>{userName}</li> // Display userName instead of userId
        ))}
      </ul>
    </div>
  );
};

export default Match;
