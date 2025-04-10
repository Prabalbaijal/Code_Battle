import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import io from 'socket.io-client';
import { setSocket,disconnectSocket } from '../redux/socketSlice.js';
import { setOnlineUsers } from '../redux/userSlice.js';


export default function SocketInitialiser() {
  const { loggedinUser } = useSelector((store) => store.user);
  const { socket } = useSelector((store) => store.socket);
  const dispatch = useDispatch();

  // EFFECT 1: Create socket when user logs in.
  useEffect(() => {
    if (!loggedinUser) return; // No user? Skip effect.

     console.log(" Checking existing socket before creating a new one...");
    if (socket) {
      // console.log("Disconnecting old socket before creating a new one...");
      socket.off('getOnlineUsers');
      socket.close();
      dispatch(disconnectSocket()); 
    }

    // console.log("Creating a new socket connection...");
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
      //console.log("Cleaning up socket before unmount...");
      newSocket.off('getOnlineUsers');
      newSocket.close();
      dispatch(disconnectSocket());
    };

  }, [loggedinUser, dispatch]); //  Runs only when loggedinUser changes


  // EFFECT 2: Cleanup socket when user logs out.
  useEffect(() => {
    if (!loggedinUser && socket) {
      socket.close();
      dispatch(disconnectSocket());
    }
  }, [loggedinUser, socket, dispatch]);

  return null
}
