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
    default: 0,
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
  lastOnline: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["online", "offline", "in-game"],
    default: "offline",
  },
  questionsAttempted: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
}, { timestamps: true });

userSchema.methods.updateLevel = function () {
  if (this.coins >= 1000) this.level = 10;
  else if (this.coins >= 500) this.level = 5;
  else this.level = Math.floor(this.coins / 100) + 1;
};

export const User = mongoose.model("User", userSchema);
