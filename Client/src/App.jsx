import React, { useEffect } from 'react';
import Login from './Components/Login/Login.jsx';
import './index.css';
import HomePage from './Components/HomePage/HomePage.jsx';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Match from './Components/Matching/Match.jsx';
import Problem from './Components/Problem/Problem.jsx';
import Profile from './Components/Profile/Profile.jsx';
import { useSelector, useDispatch } from 'react-redux';
import io from 'socket.io-client';
import FriendRequests from './Components/FriendRequest/FriendRequest.jsx';
import Friends from './Components/Friends/Friends.jsx';
import { setSocket, disconnectSocket } from './redux/socketSlice.js';
import { setOnlineUsers } from './redux/userSlice.js';
// import { Settings } from './Components/Settings.jsx';


const router = createBrowserRouter([
  { path: '/', element: <Login /> },
  { path: '/home', element: <HomePage /> },
  { path: '/match', element: <Match /> },
  { path: '/problem', element: <Problem /> },
  { path: '/profile', element: <Profile /> },
  { path: '/friendrequests', element: <FriendRequests /> },
  { path: '/friends', element: <Friends /> },
  // { path: '/Settings', element: <Settings /> },
]);

export default function App() {
  const { loggedinUser } = useSelector((store) => store.user);
  const { socket } = useSelector((store) => store.socket);
  const dispatch = useDispatch();

  // EFFECT 1: Create socket when user logs in.
  useEffect(() => {
    if (!loggedinUser) return; // No user? Skip effect.

    console.log("🔌 Checking existing socket before creating a new one...");

    // ✅ Disconnect old socket if it exists
    if (socket) {
        console.log("⚠️ Disconnecting old socket before creating a new one...");
        socket.off('getOnlineUsers');
        socket.off('notification');
        socket.close(); // Properly close old connection
        dispatch(disconnectSocket()); // Clear from Redux
    }

    // ✅ Create a new socket
    console.log("✅ Creating a new socket connection...");
    const newSocket = io('http://localhost:9000', {
        query: { userId: loggedinUser._id },
        reconnection: false,
    });

    // ✅ Store new socket in Redux
    dispatch(setSocket(newSocket));

    // ✅ Handle incoming events
    newSocket.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
    });

    newSocket.on('notification', (notification) => {
        if (notification.type === 'friend_request') {
            alert(`Friend request from ${notification.from}`);
        } else if (notification.type === 'friend_request_accepted') {
            alert(`${notification.from} accepted your friend request!`);
        }
    });

    // ✅ Cleanup: Disconnect socket when user logs out or refreshes
    return () => {
        console.log("🧹 Cleaning up socket before unmount...");
        newSocket.off('getOnlineUsers');
        newSocket.off('notification');
        newSocket.close();
        dispatch(disconnectSocket());
    };

}, [loggedinUser, dispatch]); // ✅ Runs only when loggedinUser changes


  // EFFECT 2: Cleanup socket when user logs out.
  useEffect(() => {
    if (!loggedinUser && socket) {
      socket.close();
      dispatch(disconnectSocket());
    }
  }, [loggedinUser, socket, dispatch]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}
