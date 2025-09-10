import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import { User } from '../models/Usermodel.js';
import { Contest } from '../models/ContestModel.js';
import Question from '../models/QuestionModel.js'
import mongoose from 'mongoose';
import { updateUserData, updateUserDataOnNoWinner } from '../controllers/UserUpdate.js';
import { getQuestion } from '../controllers/QuestionControllers.js';
import { scheduleContestTimeout } from '../controllers/ContestControllers.js';
import { startSession } from 'mongoose';
import socketAuth from '../middlewares/socket-auth.js';
import { createAdapter } from "@socket.io/redis-adapter";
import Redis from "ioredis";
import dotenv from 'dotenv'
dotenv.config()

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  pingInterval: 5000,
  pingTimeout: 3000,
  cors: {
    origin: ['http://localhost:5173', "https://code-battle-1.onrender.com", "https://code-battle-wheat.vercel.app"],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.use(socketAuth)

/* ---------------------------- Redis connections ---------------------------- */

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// ioredis clients
const pubClient = new Redis(REDIS_URL);
const subClient = new Redis(REDIS_URL);
pubClient.on("error", (err) => {
  console.error("Redis Pub Client Error:", err);
});
subClient.on("error", (err) => {
  console.error("Redis Sub Client Error:", err);
});

// socket.io adapter (multi-server sync)
io.adapter(createAdapter(pubClient, subClient));

// enable keyspace notifications for expirations (Ex)
await pubClient.config('SET', 'notify-keyspace-events', 'Ex');

// subscribe to expiry events on DB 0
await subClient.psubscribe('__keyevent@0__:expired');

/* ------------------------------ Redis helpers ----------------------------- */

// username -> socketId
const setUserSocket = async (username, socketId) =>
  pubClient.hset('user:sockets', username, socketId);
const getUserSocket = async (username) =>
  pubClient.hget('user:sockets', username);
const delUserSocket = async (username) =>
  pubClient.hdel('user:sockets', username);

// set of users currently in any contest
const addContestUser = async (username) =>
  pubClient.sadd('contest:users', username);
const removeContestUser = async (username) =>
  pubClient.srem('contest:users', username);
const isContestUser = async (username) =>
  (await pubClient.sismember('contest:users', username)) === 1;

// for online list broadcast
async function updateOnlineUsers() {
  const sockets = await pubClient.hgetall('user:sockets'); // { username: socketId }
  const usernames = Object.keys(sockets);
  const users = [];

  for (const userName of usernames) {
    const inContest = await isContestUser(userName);
    users.push({ userName, inContest: !!inContest });
  }
  io.emit('getOnlineUsers', users);
}

/* ------------------------- Handle Redis key expiries ----------------------- */
/**
 * Contest timeout handled via Redis key expiry: "contest:<roomName>"
 * On expiry, we:
 * 1) verify contest still active in Mongo
 * 2) emit to both users (direct by socketId from Redis)
 * 3) write DB no-winner result, clean Redis flags
 */
subClient.on('pmessage', (pattern, channel, expiredKey) => {
  console.log(' Expired Event:', { pattern, channel, expiredKey });
});

subClient.on('pmessage', async (_pattern, _channel, expiredKey) => {
  try {
    if (!expiredKey.startsWith('contest:')) return;

    const roomName = expiredKey.split(':')[1];

    const contest = await Contest.findOne({ roomName, status: 'active' });
    if (!contest) return; // already closed

    const { user1, user2 } = contest;

    // emit to both by socketId
    for (const user of [user1, user2]) {
      const sid = await getUserSocket(user);
      if (sid) {
        io.to(sid).emit('contestEnded', {
          winner: 'Nobody',
          message: 'Nobody won. Time Up!!',
        });
      }
    }

    const session = await startSession();
    session.startTransaction();

    await updateUserDataOnNoWinner(user1, user2, session);
    await Contest.findOneAndUpdate(
      { roomName, status: 'active' },
      { status: 'completed' },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    if (contest) {
      await removeContestUser(contest.user1);
      await removeContestUser(contest.user2);
    }
    await updateOnlineUsers();


    console.log(`Contest ${roomName} ended by Redis timeout.`);
  } catch (err) {
    console.error('Error on contest expiry handler:', err);
  }
});

/* --------------------------------- Sockets -------------------------------- */

io.on('connection', async (socket) => {
  try {
    const { username, userId } = socket.user
    const userName = username;
    await setUserSocket(userName, socket.id);

    console.log(`User connected: userId=${userId}, socketId=${socket.id}, userName=${userName}`);
    const ongoingContest = await Contest.findOne({
      $or: [{ user1: userName }, { user2: userName }],
      status: 'active'
    });
    if (ongoingContest) {
      await addContestUser(userName);
    }
    updateOnlineUsers();

    // Check if user was in an active contest

    socket.on('reconnectContest', async ({ roomName, username }) => {
      try {
        // Fetch contest without populating problem
        const contest = await Contest.findOne({ roomName, status: 'active' }).select("problemId endTime");
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
        const userSocketId = await getUserSocket(username)
        if (userSocketId) {
          io.to(userSocketId).emit('reconnectContest', {
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
      const opponentSocketId = await getUserSocket(opponentUsername);
      const userSocketId = await getUserSocket(userName)
      const existing = await Contest.findOne({
        $or: [{ user1: userName }, { user2: userName }],
        status: 'active'
      });
      if (existing) return socket.emit('contestError', { message: "You already have an active contest." })
      if (opponentSocketId) {
        const roomName = `${userName}-${opponentUsername}`;

        // Notify opponent about the challenge request
        console.log(roomName);

        io.to(opponentSocketId).emit('playNotification', { roomName, initiator: userName });

        console.log("playNotification emitted");

        // Notify sender that request has been sent
        socket.emit('requestSent', { message: 'Request sent.Waiting for opponent to accept...' });
      } else {
        socket.emit('opponentOffline', { message: 'Opponent is offline.' });
      }
    });


    socket.on("challengeRejected", async ({ initiator }) => {
      const initiatorid = await getUserSocket(initiator)
      io.to(initiatorid).emit("challengeRejected", { initiator });
    });

    socket.on('joinRoom', async (roomName) => {
      try {
        const existing = await Contest.findOne({ roomName, status: 'active' });
        if (existing) return socket.emit('contestError', { message: 'Contest already active.' });


        const [user1, user2] = roomName.split('-');
        if (!user1 || !user2) return;

        const user1SocketId = await getUserSocket(user1);
        const user2SocketId = await getUserSocket(user2);

        // console.log(user1Socket);
        // console.log(user2Socket)
        if (!user1SocketId || !user2SocketId) {
          return socket.emit('contestError', { message: 'One or both users are not online.' });
        }
        const user1Socket = io.sockets.sockets.get(user1SocketId);
        const user2Socket = io.sockets.sockets.get(user2SocketId);
        user1Socket.join(roomName);
        user2Socket.join(roomName);

        console.log(`User joined room: ${roomName}`);

        // Fetch the unattempted problem
        const problem = await getQuestion(user1, user2);
        if (!problem) {
          return io.to(roomName).emit('contestError', { message: 'No New problems are available for you.Please try after some time!!' });
        }

        // Store contest with `endTime`
        const contestDuration = 30 * 60000; // 30 minutes
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
        await scheduleContestTimeout(pubClient, roomName, endTime);


        await addContestUser(user1);
        await addContestUser(user2);
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
    socket.on("roomCreationStarted", async ({ to }) => {
      const targetSocket = await getUserSocket(to);

      if (targetSocket) {
        io.to(targetSocket).emit("roomCreating");
      }
    });


    socket.on("cancelChallenge", async ({ opponent, initiator }) => {
      const opponentSocket = await getUserSocket(opponent);
      // console.log(opponent,initiator)
      if (opponentSocket) {
        io.to(opponentSocket).emit("challengeCancelled", { initiator });
      }
    });



    socket.on('solveProblem', async ({ roomName, userName }) => {
      const session = await startSession(); // Start a new session
      session.startTransaction(); // Start a transaction

      try {
        // Fetch contest from DB
        const contest = await Contest.findOneAndUpdate(
          { roomName, status: 'active' }, // Ensure contest is still active
          { status: 'completed', winner: userName }, // Mark contest as completed
          { new: false, session } // Return the old contest data before update
        );
        if (!contest) {
          await session.abortTransaction();
          return socket.emit('contestError', { message: 'Contest not found.' });
        }

        const { user1, user2 } = contest;
        const loserName = userName === user1 ? user2 : user1;

        // Update user data
        await updateUserData(userName, loserName, session);

        // Notify both users
        [user1, user2].forEach(async (user) => {
          const userSocket = await getUserSocket(user);
          if (userSocket) {
            io.to(userSocket).emit('contestEnded', {
              winner: userName,
              message: `${userName} solved the problem first. ${userName} wins!`,
            });
          }
        });

        await session.commitTransaction(); // Commit all changes
        session.endSession();
        await removeContestUser(user1);
        await removeContestUser(user2);
        updateOnlineUsers();
      } catch (error) {
        if (error.errorLabels && error.errorLabels.includes("TransientTransactionError")) {
          console.warn("Transaction aborted due to conflict:", error);
          socket.emit('contestError', { message: 'Another player already solved it.' });
        } else {
          console.error("Error handling problem solve:", error);
          socket.emit('contestError', { message: 'Failed to update contest. Try again.' });
        }

        await session.abortTransaction();
        session.endSession();
      }
    });



    socket.on('leaveContest', async ({ roomName, userName }) => {
      const session = await startSession(); // Start a session
      session.startTransaction();
      try {
        const [userA, userB] = roomName.split('-')
        const winn = userName == userA ? userB : userA

        // Fetch contest from DB
        const contest = await Contest.findOneAndUpdate(
          { roomName, status: "active" },
          { status: "completed", winner: winn },
          { new: false, session }
        );
        if (!contest) {
          await session.abortTransaction();
          return socket.emit('contestError', { message: 'Contest not found.' });
        }
        const { user1, user2 } = contest;
        const winner = userName === user1 ? user2 : user1;

        // Update user data
        await updateUserData(winner, userName, session);

        // Notify both users
        [user1, user2].forEach(async (user) => {
          const userSocket = await getUserSocket(user);
          if (userSocket) {
            io.to(userSocket).emit('contestEnded', {
              winner,
              message: `${userName} left. ${winner} wins!`,
            });
          }
        });

        await session.commitTransaction(); // Commit all changes
        session.endSession();
        await removeContestUser(user1);
        await removeContestUser(user2);
        updateOnlineUsers();

      } catch (error) {
        if (error.errorLabels && error.errorLabels.includes("TransientTransactionError")) {
          console.warn("Transaction aborted due to conflict:", error);
          socket.emit('contestError', { message: 'Another player already solved it.' });
        } else {
          console.error("Error handling problem solve:", error);
          socket.emit('contestError', { message: 'Failed to update contest. Try again.' });
        }

        await session.abortTransaction();
        session.endSession();
      }
    });



    socket.on('disconnect', async () => {
      try {
        // mapping delete by username we already have
        await delUserSocket(userName);
        await removeContestUser(userName); // safe even if not in contest
        console.log(`User disconnected: ${userName}`);
        await updateOnlineUsers();
      } catch (err) {
        console.error('disconnect cleanup error:', err);
      }
    });
  } catch (err) {
    console.error(err)
    socket.emit('Some error occured at server side!!')
  }
});




export { app, io, server, updateOnlineUsers };