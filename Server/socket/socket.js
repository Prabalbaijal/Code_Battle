import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import { User } from '../models/Usermodel.js';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173'], // Adjust for your frontend URL
    methods: ['GET', 'POST'],
  },
});

const userSocketMap = {}; // Maps userId -> { socketId, userName }
const contestTimers = {};

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    User.findById(userId).then((user) => {
      if (user) {
        const userName = user.username;

        // Store the user's socket ID and name
        userSocketMap[userId] = { socketId: socket.id, userName };

        console.log(`User connected: userId=${userId}, socketId=${socket.id}, userName=${userName}`);

        // Send updated online users list to all clients
        const onlineUserNames = Object.values(userSocketMap).map((user) => user.userName);
        io.emit('getOnlineUsers', onlineUserNames);

        // Handle Play request
        socket.on('playRequest', ({ opponentUsername }) => {
          const opponent = Object.values(userSocketMap).find(
            (user) => user.userName === opponentUsername
          );

          if (opponent) {
            const roomName = `${userName}-${opponentUsername}`;
            socket.join(roomName); // Current user joins the room
            io.to(opponent.socketId).emit('playNotification', {
              roomName,
              initiator: userName,
            });
          } else {
            socket.emit('opponentOffline', { message: 'Opponent is offline.' });
          }
        });

        // Handle opponent joining the room
        socket.on('joinRoom', (roomName) => {
          socket.join(roomName);

          // Start contest with a timer
          const contestDuration = 300000; // 5 minutes (example duration)
          const contestTimer = setTimeout(() => {
            // If no one solved the problem, contest ends in a draw
            io.to(roomName).emit('contestEnded', {
              winner: null,
              message: 'Contest ended. No one solved the problem.',
            });
            console.log(`Contest ended with no winner in room: ${roomName}`);
            delete contestTimers[roomName];
          }, contestDuration);

          contestTimers[roomName] = { timer: contestTimer, winner: null };

          io.to(roomName).emit('startContest', { message: 'Both players are in. Starting the contest.' });
        });

        // Handle problem-solving
        socket.on('solveProblem', ({ roomName, userName }) => {
          const contest = contestTimers[roomName];
          if (contest && !contest.winner) {
            clearTimeout(contest.timer); // Stop the contest timer
            contest.winner = userName;

            // Notify both users about the winner
            io.to(roomName).emit('contestEnded', {
              winner: userName,
              message: `${userName} solved the problem first and won the contest!`,
            });

            console.log(`Contest ended for room: ${roomName}, winner: ${userName}`);
            delete contestTimers[roomName];
          }
        });
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
export { app, io, server, userSocketMap };  
