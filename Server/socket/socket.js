import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import { User } from '../models/Usermodel.js';
import { Contest } from '../models/ContestModel.js';
import Question from '../models/QuestionModel.js'
import mongoose from 'mongoose';
import { updateUserData, updateUserDataOnNoWinner } from '../controllers/UserUpdate.js';
import { getQuestion } from '../controllers/UserControllers.js';
import { scheduleContestTimeout } from '../controllers/UserControllers.js';


const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST'],
  },
});

const userSocketMap = {}; // Maps userId -> { socketId, userName }
const contestRoomMap = {}; // Maps roomName -> contest details
const unSocketMap=new Map();

io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    const objectId = new mongoose.Types.ObjectId(userId);

    User.findById(objectId)
      .then(async (user) => {
        if (user) {
          const userName = user.username;
          userSocketMap[userId] = { socketId: socket.id, userName };
          unSocketMap.set(userName, socket);

          console.log(`User connected: userId=${userId}, socketId=${socket.id}, userName=${userName}`);

          const onlineUserNames = Object.values(userSocketMap).map((user) => user.userName);
          io.emit('getOnlineUsers', onlineUserNames);

          // Check if user was in an active contest

          socket.on('reconnectContest', async ({ roomName, username }) => {
            try {
                // Fetch contest without populating problem
                const contest = await Contest.findOne({ roomName }).select("problemId endTime");
                if (!contest) {
                    return socket.emit('contestError', { message: 'Contest not found.' });
                }
        
                // Fetch problem separately using problemId
                const problem = await Question.findById(contest.problemId);
                if (!problem) {
                    return socket.emit('contestError', { message: 'Problem not found.' });
                }
        
                // Extract usernames from roomName
                const [user1, user2] = roomName.split('-');
                const opponent = user1 === username ? user2 : user1; // Get opponent's name
        
                // Ensuring the requesting user is in this contest
                if (username !== user1 && username !== user2) {
                    return socket.emit('contestError', { message: 'You are not part of this contest.' });
                }
                const userSocketId = unSocketMap.get(username);
                if (userSocketId) {
                    userSocketId.emit('reconnectContest', {
                        roomName,
                        endTime: contest.endTime.getTime(),
                        problem,
                    });
                } else {
                    socket.emit('contestError', { message: 'User socket not found. Try again.' });
                }
        
            } catch (error) {
                console.error('Error reconnecting contest:', error);
                socket.emit('contestError', { message: 'Failed to reconnect. Try again.' });
            }
        });
        
        
          // Handle Play request
          socket.on('playRequest', async ({ opponentUsername }) => {
            const opponent = Object.values(userSocketMap).find(
              (user) => user.userName === opponentUsername
            );
            if (opponent) {
              const roomName = `${userName}-${opponentUsername}`;
              
              // Notify opponent about the challenge request
              console.log(roomName)

              io.to(opponent.socketId).emit('playNotification', { roomName, initiator: userName });
              console.log("playnotification emitted")
              // Notify sender that request has been sent
              socket.emit('requestSent', { message: 'Waiting for opponent to accept...' });
          
            } else {
              socket.emit('opponentOffline', { message: 'Opponent is offline.' });
            }
          });
          
          socket.on("challengeRejected", ({ initiator }) => {
            const initiatorid=unSocketMap.get(initiator)
            initiatorid.emit("challengeRejected", { initiator });
          });          

          socket.on('joinRoom', async (roomName) => {
            try {
                const [user1, user2] = roomName.split('-');
                if (!user1 || !user2) return;

                const user1Socket = unSocketMap.get(user1);
                const user2Socket = unSocketMap.get(user2);
                console.log(user1Socket);
                console.log(user2Socket)
                if (!user1Socket || !user2Socket) {
                  return socket.emit('contestError', { message: 'One or both users are not online.' });
              }
              user1Socket.join(roomName);
              user2Socket.join(roomName);

                console.log(`User joined room: ${roomName}`);
        
                // Fetch the unattempted problem
                const problem = await getQuestion(user1, user2);
                if (!problem) {
                    return socket.emit('contestError', { message: 'No unattempted problems available.' });
                }
        
                // Store contest with `endTime`
                const contestDuration = 1800000; // 30 minutes
                const endTime = Date.now() + contestDuration;
        
                const contest = new Contest({
                    roomName,
                    user1,
                    user2,
                    problemId: problem._id,
                    status: 'active',
                    endTime
                });
        
                await contest.save();
        
                // Schedule contest timeout
                scheduleContestTimeout(roomName, endTime);
        
                // Notify users
                io.to(roomName).emit('startContest', { 
                    roomName, 
                    endTime, 
                    problem
                });
        
            } catch (error) {
                console.error('Error handling contest:', error);
                socket.emit('contestError', { message: 'Failed to start contest. Please try again.' });
            }
        });        
        
        
        socket.on('solveProblem', async ({ roomName, userName }) => {
          try {
              // Fetch contest from DB
              const contest = await Contest.findOne({ roomName }).select("user1 user2");
              if (!contest) {
                  return socket.emit('contestError', { message: 'Contest not found.' });
              }
      
              const { user1, user2 } = contest;
              const loserName = userName === user1 ? user2 : user1;
      
              // Update user data
              await updateUserData(userName, loserName);
      
              // Notify both users
              [user1, user2].forEach((user) => {
                  const userSocket = unSocketMap.get(user);
                if (userSocket) {
                    userSocket.emit('contestEnded', {
                        winner:userName,
                        message: `${userName} solved the problem first. ${userName} wins!`,
                    });
                }
              });
      
              // Remove contest from DB
              await Contest.findOneAndDelete({ roomName });
      
          } catch (error) {
              console.error("Error handling problem solve:", error);
              socket.emit('contestError', { message: 'Failed to update contest. Try again.' });
          }
      });
      
          

      socket.on('leaveContest', async ({ roomName, userName }) => {
        try {
            // Fetch contest from DB
            const contest = await Contest.findOne({ roomName }).select("user1 user2");
            if (!contest) {
                return socket.emit('contestError', { message: 'Contest not found.' });
            }
    
            const { user1, user2 } = contest;
            const winner = userName === user1 ? user2 : user1;
    
            // Update user data
            await updateUserData(winner, userName);
    
            // Notify both users
            [user1, user2].forEach((user) => {
                const userSocket = unSocketMap.get(user);
                if (userSocket) {
                    userSocket.emit('contestEnded', {
                        winner,
                        message: `${userName} left. ${winner} wins!`,
                    });
                }
            });
    
            // Remove contest from DB
            await Contest.findOneAndDelete({ roomName });
    
        } catch (error) {
            console.error("Error handling contest leave:", error);
            socket.emit('contestError', { message: 'Failed to update contest. Try again.' });
        }
    });
    
    

          socket.on('disconnect', async () => {
            if (userId) {
              const userName = userSocketMap[userId]?.userName;
              delete userSocketMap[userId];
              delete unSocketMap[userName];
              console.log(`User disconnected: userId=${userId}, socketId=${socket.id}, userName=${userName}`);

              const onlineUserNames = Object.values(userSocketMap).map((user) => user.userName);
              io.emit('getOnlineUsers', onlineUserNames);
            }
          });
        }
      })
      .catch((err) => console.log('Error fetching user:', err));
  }
});

export { app, io, server, userSocketMap, contestRoomMap,unSocketMap };
