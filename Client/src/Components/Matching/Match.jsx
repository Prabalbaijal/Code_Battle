import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

const Match = () => {
  const { loggedinUser } = useSelector((store) => store.user);
  const [onlineUsers, setOnlineUsers] = useState([]);

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-100 p-6">
      <h3 className="text-3xl font-bold mb-6">Online Users</h3>

      {filteredUsers.length === 0 ? (
        <p className="text-gray-400 text-lg">No other users online.</p>
      ) : (
        <div className="bg-gray-800 shadow-lg rounded-lg w-full max-w-md">
          <ul className="divide-y divide-gray-700">
            {filteredUsers.map((userName, index) => (
              <li
                key={index}
                className="flex justify-between items-center px-4 py-3 hover:bg-gray-700"
              >
                <span className="font-medium text-gray-100">{userName}</span>
                <div className="flex space-x-2">
                  <button className="btn btn-success btn-sm">Play</button>
                  <button className="btn btn-info btn-sm">Add Friend</button>
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







// import { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { io } from 'socket.io-client';

// const Match = () => {
//   const { loggedinUser } = useSelector((store) => store.user);
//   const [onlineUsers, setOnlineUsers] = useState([]);

//   useEffect(() => {
//     // Initialize socket connection with the logged-in user's ID
//     const socket = io('http://localhost:9000', {
//       query: { userId: loggedinUser?._id }, // Replace with dynamic userId
//     });

//     // Listen for the list of online users (userNames)
//     socket.on('getOnlineUsers', (users) => {
//       console.log('Online users:', users); // users will be an array of user names
//       setOnlineUsers(users);
//     });

//     // Clean up the socket connection on component unmount
//     return () => {
//       socket.off('getOnlineUsers');
//       socket.disconnect();
//     };
//   }, [loggedinUser?._id]); // Reconnect socket on userId change

//   return (
//     <div>
//       <h3>Online Users</h3>
//       <ul>
//         {onlineUsers.map((userName, index) => (
//           <li key={index}>{userName}</li> // Display userName instead of userId
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Match;
