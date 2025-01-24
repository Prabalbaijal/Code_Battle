import React, { useEffect } from 'react';
import Login from './Components/Login/Login.jsx';
import './index.css';
import HomePage from './Components/HomePage/HomePage.jsx';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Match from './Components/Matching/Match.jsx';
import Problem from './Components/Problem/Problem.jsx';
import Profile from './Components/Profile/Profile.jsx';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import FriendRequests from './Components/FriendRequest/FriendRequest.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/home',
    element: <HomePage />,
  },
  {
    path: '/match',
    element: <Match />,
  },
  {
    path: '/problem',
    element: <Problem />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
  {
    path: '/friendrequests',
    element: <FriendRequests />
  }
]);

export default function App() {
  const { loggedinUser } = useSelector((store) => store.user);

  useEffect(() => {
    if (!loggedinUser?._id) return;

    const socket = io('http://localhost:9000', {
      query: { userId: loggedinUser._id },
    });

    // Listen for notifications
    socket.on('notification', (notification) => {
      if (notification.type === 'friend_request') {
        alert(`Friend request from ${notification.from}`);
      } else if (notification.type === 'friend_request_accepted') {
        alert(`${notification.from} accepted your friend request!`);
      }
    });

    return () => {
      socket.off('notification');
      socket.disconnect();
    };
  }, [loggedinUser?._id]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}
