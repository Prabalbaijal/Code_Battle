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

const router = createBrowserRouter([
  { path: '/', element: <Login /> },
  { path: '/home', element: <HomePage /> },
  { path: '/match', element: <Match /> },
  { path: '/problem', element: <Problem /> },
  { path: '/profile', element: <Profile /> },
  { path: '/friendrequests', element: <FriendRequests /> },
  { path: '/friends', element: <Friends /> },
]);

export default function App() {
  const { loggedinUser } = useSelector((store) => store.user);
  const { socket } = useSelector((store) => store.socket);
  const dispatch = useDispatch();

  // EFFECT 1: Create socket when user logs in.
  useEffect(() => {
    if (loggedinUser && !socket) {
      const newSocket = io('http://localhost:9000', {
        query: { userId: loggedinUser._id },
        reconnection: false,
      });
      dispatch(setSocket(newSocket));

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

      // Cleanup when this effect is cleaned up (if loggedinUser changes or component unmounts)
      return () => {
        newSocket.off('getOnlineUsers');
        newSocket.off('notification');
        newSocket.close();
        dispatch(disconnectSocket());
      };
    }
    // We intentionally do not include socket in the dependency array here
    // so that this effect runs only when loggedinUser changes.
  }, [loggedinUser, dispatch]);

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
