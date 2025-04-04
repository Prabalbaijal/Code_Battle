  import { Server } from 'socket.io';
  import http from 'http';
  import express from 'express';
  import { User } from '../models/Usermodel.js';
  import { Contest } from '../models/ContestModel.js';
  import Question from '../models/QuestionModel.js'
  import mongoose from 'mongoose';
  import { updateUserData } from '../controllers/UserUpdate.js';
  import { getQuestion } from '../controllers/UserControllers.js';
  import { scheduleContestTimeout } from '../controllers/UserControllers.js';
  import { startSession } from 'mongoose';


  const app = express();
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: ['http://localhost:5173'],
      methods: ['GET', 'POST'],
    },
  });

  const contestUsers = new Set();
  const unSocketMap=new Map();

  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      const objectId = new mongoose.Types.ObjectId(userId);

      User.findById(objectId)
        .then(async (user) => {
          if (user) {
            const userName = user.username;
            unSocketMap.set(userName, socket);
            
            console.log(`User connected: userId=${userId}, socketId=${socket.id}, userName=${userName}`);
            const ongoingContest = await Contest.findOne({
              $or: [{ user1: userName }, { user2: userName }],
              status: 'active'
          });
          if(ongoingContest) {
             contestUsers.add(userName);
          }
            updateOnlineUsers();

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
              const opponentSocketId = unSocketMap.get(opponentUsername);
          
              if (opponentSocketId) {
                  const roomName = `${userName}-${opponentUsername}`;
                  
                  // Notify opponent about the challenge request
                  console.log(roomName);  
          
                  opponentSocketId.emit('playNotification', { roomName, initiator: userName });
                  console.log("playNotification emitted");
          
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
                  
                  
                  contestUsers.add(user1);
                  contestUsers.add(user2);
                  updateOnlineUsers();

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
            const session = await startSession(); // Start a new session
            session.startTransaction(); // Start a transaction
        
            try {
                // Fetch contest from DB
                const contest = await Contest.findOneAndUpdate(
                  { roomName, status: 'active' }, // Ensure contest is still active
                  { status: 'completed' }, // Mark contest as completed
                  { new: false,session } // Return the old contest data before update
              );
                if (!contest) {
                  await session.abortTransaction();
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
                await Contest.findOneAndDelete({ roomName },{session});
                await session.commitTransaction(); // Commit all changes
                session.endSession();
                contestUsers.delete(user1);
                contestUsers.delete(user2);
                updateOnlineUsers();
            } catch (error) {
                console.error("Error handling problem solve:", error);
                socket.emit('contestError', { message: 'Failed to update contest. Try again.' });
            }
        });
        
            

        socket.on('leaveContest', async ({ roomName, userName }) => {
          const session = await startSession(); // Start a session
          session.startTransaction();
          try {
              // Fetch contest from DB
              const contest = await Contest.findOneAndUpdate(
                { roomName, status: "active" }, 
                { status: "completed" }, 
                { new: false,session }
            );
              if (!contest) {
                await session.abortTransaction();
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
              await Contest.findOneAndDelete({ roomName },{ session });
              await session.commitTransaction(); // Commit all changes
              session.endSession();
              contestUsers.delete(user1);
              contestUsers.delete(user2);
              updateOnlineUsers();
      
          } catch (error) {
              console.error("Error handling contest leave:", error);
              socket.emit('contestError', { message: 'Failed to update contest. Try again.' });
          }
      });
      
      

            socket.on('disconnect', async () => {
              const userNames = Array.from(unSocketMap.keys()).find(key => unSocketMap.get(key) === socket);
              if (userNames) {
                unSocketMap.delete(userNames);
                contestUsers.delete(userNames);
                console.log(`User disconnected: ${userName}`);
                updateOnlineUsers();
              }
            });
          }
        })
        .catch((err) => console.log('Error fetching user:', err));
    }
  });

  function updateOnlineUsers() {
    const onlineUsers = Array.from(unSocketMap.keys()).map(userName => ({
      userName,
      inContest: contestUsers.has(userName), // Check if the user is in a contest
    }));

    io.emit('getOnlineUsers', onlineUsers);
  }


  export { app, io, server, unSocketMap,updateOnlineUsers,contestUsers };