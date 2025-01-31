import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import { User } from '../models/Usermodel.js';
import mongoose from 'mongoose';

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
    const objectId = new mongoose.Types.ObjectId(userId);

    User.findById(objectId)
      .then((user) => {
        if (user) {
          const userName = user.username;
          userSocketMap[userId] = { socketId: socket.id, userName };

          console.log(`User connected: userId=${userId}, socketId=${socket.id}, userName=${userName}`);

          // Broadcast updated online users list
          const onlineUserNames = Object.values(userSocketMap).map((user) => user.userName);
          io.emit('getOnlineUsers', onlineUserNames);

          // Handle Play request
          socket.on('playRequest', ({ opponentUsername }) => {
            const opponent = Object.values(userSocketMap).find(
              (user) => user.userName === opponentUsername
            );
          
            if (opponent) {
              const roomName = `${userName}-${opponentUsername}`;
              socket.join(roomName); // Sender joins the room
          
              io.to(opponent.socketId).emit('playNotification', {
                roomName,
                initiator: userName,
              });
          
              // Also notify the sender that the request is sent
              socket.emit('requestSent', { message: 'Waiting for opponent to accept...' });
          
            } else {
              socket.emit('opponentOffline', { message: 'Opponent is offline.' });
            }
          });
          
          // Handle opponent joining the room
          socket.on('joinRoom', (roomName) => {
            socket.join(roomName);
          
            const roomUsers = [...(io.sockets.adapter.rooms.get(roomName) || [])];
            if (roomUsers.length === 2) {
              // Notify both players that the contest is starting
              io.to(roomName).emit('startContest', {
                message: 'Both players are in. Starting the contest.',
              });
          
              // Start the contest timer
              const contestDuration = 300000; // 5 minutes
              const contestTimer = setTimeout(() => {
                io.to(roomName).emit('contestEnded', {
                  winner: null,
                  message: 'Contest ended. No one solved the problem.',
                });
                console.log(`Contest ended with no winner in room: ${roomName}`);
                delete contestTimers[roomName];
              }, contestDuration);
          
              contestTimers[roomName] = { timer: contestTimer, winner: null };
            }
          });
          
          socket.on('acceptRequest', (roomName) => {
            socket.join(roomName);
            io.to(roomName).emit('startContest', { roomName });
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

          // Handle disconnection
          socket.on('disconnect', () => {
            if (userId) {
              const userName = userSocketMap[userId]?.userName;
              delete userSocketMap[userId];
              console.log(`User disconnected: userId=${userId}, socketId=${socket.id}, userName=${userName}`);

              // Notify opponents in active contests
              const activeRooms = Array.from(socket.rooms).filter(
                (room) => room !== socket.id && contestTimers[room]
              );

              activeRooms.forEach((roomName) => {
                io.to(roomName).emit('opponentOffline', {
                  message: `${userName} disconnected. Contest ended.`,
                });
                clearTimeout(contestTimers[roomName]?.timer);
                delete contestTimers[roomName];
              });

              // Update online users list
              const onlineUserNames = Object.values(userSocketMap).map((user) => user.userName);
              io.emit('getOnlineUsers', onlineUserNames);
            }
          });
        }
      })
      .catch((err) => console.log('Error fetching user:', err));
  }
});

export { app, io, server, userSocketMap };
