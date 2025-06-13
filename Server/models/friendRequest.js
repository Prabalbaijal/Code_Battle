import mongoose from "mongoose";

const FriendsSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "ignored"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Friend = mongoose.model("Friend", FriendsSchema);
