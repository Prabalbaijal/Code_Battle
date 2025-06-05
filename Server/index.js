import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import cookieParser from 'cookie-parser';
import UserRoute from './routes/UserRoutes.js';
import QuestionRoutes from './routes/QuestionRoutes.js'
import FriendRoutes from './routes/FriendsRoutes.js'
import ContestRoutes from './routes/ContestRoutes.js'
import AuthRoutes from './routes/AuthRoutes.js'
import { server, app } from './socket/socket.js'; // Import server from socket.js
import { rescheduleAllTimeouts } from './controllers/ContestControllers.js';

dotenv.config();

const PORT = process.env.PORT || 2000;

// CORS Configuration
const corsOptions = {
    origin: ["http://localhost:5173","https://code-battle-1.onrender.com"],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());

app.use('/api/auth',AuthRoutes)
app.use('/api/users', UserRoute);
app.use('/api/questions',QuestionRoutes)
app.use('/api/friends',FriendRoutes)
app.use('/api/contest',ContestRoutes)

server.listen(PORT, "0.0.0.0" ,async () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
    await rescheduleAllTimeouts();
});
