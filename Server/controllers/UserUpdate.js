import { User } from "../models/Usermodel.js";

export const updateUserData = async (winnerUsername, loserUsername) => {
    try {
        console.log(winnerUsername)
        console.log(loserUsername)
        const winner = await User.findOne({ username: winnerUsername });
        const loser = await User.findOne({ username: loserUsername });

        if (winner && loser) {
            // Update coins
            winner.coins += 50;
            loser.coins -= 50;
            if(loser.coins<0) loser.coins=0;

            // Update levels
            winner.level = getLevelFromCoins(winner.coins);
            loser.level = getLevelFromCoins(loser.coins);

            // Add contest result to match history
            winner.matchHistory.push({
                opponent: loser._id,
                result: "win",
                score: 50,
            });

            loser.matchHistory.push({
                opponent: winner._id,
                result: "lose",
                score: -50,
            });

            await winner.save();
            await loser.save();

            console.log(`Updated winner (${winnerUsername}): coins=${winner.coins}, level=${winner.level}`);
            console.log(`Updated loser (${loserUsername}): coins=${loser.coins}, level=${loser.level}`);
        } else {
            console.log(`User data not found for winner: ${winnerUsername} or loser: ${loserUsername}`);
        }
    } catch (error) {
        console.error("Error updating user data:", error);
    }
};

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
  contestHistory: [
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
}, { timestamps: true });


export const updateUserDataOnNoWinner = async (user1Username, user2Username) => {
  try {
    const [user1, user2] = await Promise.all([
      User.findOne({ username: user1Username }),
      User.findOne({ username: user2Username })
    ]);

    if (user1 && user2) {
      user1.coins = Math.max(0, user1.coins - 50);
      user2.coins = Math.max(0, user2.coins - 50);

      user1.level = getLevelFromCoins(user1.coins);
      user2.level = getLevelFromCoins(user2.coins);

      user1.matchHistory.push({
        opponent: user2._id,
        result: "draw",
        score: -50,
        date: new Date()
      });

      user2.matchHistory.push({
        opponent: user1._id,
        result: "draw",
        score: -50,
        date: new Date()
      });

      await Promise.all([user1.save(), user2.save()]);

      console.log(`❌ No winner. Deducted coins: ${user1.username} (${user1.coins}), ${user2.username} (${user2.coins})`);
    } else {
      console.log(`❌ User not found: ${user1Username} or ${user2Username}`);
    }
  } catch (error) {
    console.error(`Error updating user data on no winner:`, error.message);
  }
};

function getLevelFromCoins(coins) {
    if (coins < 500) return 1;
    else if (coins < 900) return 2;
    else if (coins < 1000) return 3;
    return 4;
}
