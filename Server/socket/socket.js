// socket.js
import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import { User } from '../models/Usermodel.js'; // Assuming you have a User model to fetch user details

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173'], // Replace with your frontend URL if needed
    methods: ['GET', 'POST'],
  },
});

const userSocketMap = {}; // Maps userId -> { socketId, userName }

// Handle new socket connections
io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    User.findById(userId).then((user) => {
      if (user) {
        const userName = user.fullname; 

        // Store the user's socket ID and name
        userSocketMap[userId] = { socketId: socket.id, userName };

        console.log(`User connected: userId=${userId}, socketId=${socket.id}, userName=${userName}`);

        // Send updated online users list to all clients
        const onlineUserNames = Object.values(userSocketMap).map((user) => user.userName);
        io.emit('getOnlineUsers', onlineUserNames);
      }
    }).catch((err) => console.log('Error fetching user:', err));
  }

  // Handle socket disconnect
  socket.on('disconnect', () => {
    if (userId) {
      const userName = userSocketMap[userId]?.userName;
      delete userSocketMap[userId];
      console.log(`User disconnected: userId=${userId}, socketId=${socket.id}, userName=${userName}`);

      // Send updated online users list to all clients
      const onlineUserNames = Object.values(userSocketMap).map((user) => user.userName);
      io.emit('getOnlineUsers', onlineUserNames);
    }
  });
});

export { app, io, server };
