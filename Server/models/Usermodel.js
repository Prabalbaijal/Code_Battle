import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
  coins: {
    type: Number,
    default: 400,
  },
  level: {
    type: Number,
    default: 1,
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  friendRequests: [
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      status: {
        type: String,
        enum: ["pending", "accepted", "ignored"],
        default: "pending",
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  matchHistory: [
    {
      opponent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      result: {
        type: String,
        enum: ["win", "lose", "draw"],
        required: true,
      },
      score: {
        type: Number,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  
  questionsAttempted: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  
}, { timestamps: true });


export const User = mongoose.model("User", userSchema);
