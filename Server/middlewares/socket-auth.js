// middlewares/socketAuth.js
import jwt from 'jsonwebtoken';
import { User } from '../models/Usermodel.js';
import cookie from 'cookie';
import dotenv from 'dotenv';

dotenv.config();

const socketAuth = async (socket, next) => {
  try {
    const cookies = socket.handshake.headers.cookie;

    if (!cookies) {
      return next(new Error("Authentication error: No cookies found"));
    }

    const parsedCookies = cookie.parse(cookies);
    const token = parsedCookies.token;

    if (!token) {
      return next(new Error("Authentication error: Token not found in cookies"));
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decode.userId).select('-password');

    if (!user) {
      return next(new Error("Authentication error: Invalid user"));
    }

    // Attach user info to socket
    socket.user = {
      userId: user._id.toString(),
      username: user.username,
    };

    next();
  } catch (error) {
    console.error('Socket auth error:', error.message);
    next(new Error("Authentication error: Invalid token or user"));
  }
};

export default socketAuth;
