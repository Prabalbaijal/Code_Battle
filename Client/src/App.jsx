import React, { useEffect } from 'react';
import './index.css';
import { RouterProvider} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import io from 'socket.io-client';
import { setSocket, disconnectSocket } from './redux/socketSlice.js';
import { setOnlineUsers } from './redux/userSlice.js';
import axios from 'axios';
import { setLoggedinUser } from './redux/userSlice.js';
import router from './Components/Routes.jsx';
import { useState } from 'react';

export default function App() {
  const { loggedinUser } = useSelector((store) => store.user);
  const { socket } = useSelector((store) => store.socket);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    axios.get(`${BACKEND_URL}/api/auth/getUser`, { withCredentials: true }) 
        .then(res => {
            if (res.data && !loggedinUser) {
                dispatch(setLoggedinUser(res.data));
            }
        })
        .catch(() => dispatch(setLoggedinUser(null)))
        .finally(()=>{
          setLoading(false);
        })
}, [dispatch]);


  // EFFECT 1: Create socket when user logs in.
  useEffect(() => {
    if (!loggedinUser || loading) return; 

    console.log("Checking existing socket before creating a new one...");

    // Disconnect old socket if it exists
    if (socket) {
      console.log(" Disconnecting old socket before creating a new one...");
      socket.off('getOnlineUsers');
      socket.close(); // Properly close old connection
      dispatch(disconnectSocket()); // Clear from Redux
    }

    // Create a new socket
    console.log("Creating a new socket connection...");
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const newSocket = io(`${BACKEND_URL}`, {
      query: { userId: loggedinUser._id },
      reconnection: false,
    });

    //  Store new socket in Redux
    dispatch(setSocket(newSocket));

    // Handle incoming events
    newSocket.on('getOnlineUsers', (onlineUsers) => {
      dispatch(setOnlineUsers(onlineUsers));
    });


    // Cleanup: Disconnect socket when user logs out or refreshes
    return () => {
      console.log("Cleaning up socket before unmount...");
      newSocket.off('getOnlineUsers');
      newSocket.close();
      dispatch(disconnectSocket());
    };

  }, [loggedinUser,loading]); //  Runs only when loggedinUser changes


  // EFFECT 2: Cleanup socket when user logs out.
  useEffect(() => {
    if (!loggedinUser && socket) {
      socket.close();
      dispatch(disconnectSocket());
    }
  }, [loggedinUser, socket, dispatch]);

  if (loading) return <h2>Connecting to server,Please wait...</h2>;

  return (

    <div>
      <RouterProvider router={router} />
    </div>
  );
}