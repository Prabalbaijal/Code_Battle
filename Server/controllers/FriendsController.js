import { User } from "../models/Usermodel.js";  
import { Friend } from "../models/friendRequest.js";

export const sendrequest = async (req, res) => {
  const { senderUsername, receiverUsername } = req.body;

  try {
    const sender = await User.findOne({ username: senderUsername });
    const receiver = await User.findOne({ username: receiverUsername });

    if (!sender || !receiver)
      return res.status(404).json({ message: "User not found" });

    if (sender._id.equals(receiver._id))
      return res.status(400).json({ message: "Cannot friend yourself" });

    const existing = await Friend.findOne({
      $or: [
        { requester: sender._id, recipient: receiver._id, $or: [ {status:'accepted'},{status:'pending'} ] },
        { requester: receiver._id, recipient: sender._id, $or: [ {status:'accepted'},{status:'pending'} ] },
      ],
    });

    if (existing)
      return res.status(400).json({ message: "Pending request already exists or already a friend." });

    const newRequest = new Friend({
      requester: sender._id,
      recipient: receiver._id,
      status: "pending",
    });

    await newRequest.save();
    res.status(200).json({ message: "Friend request sent" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


export const getFriendRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await Friend.find({
      recipient: userId,
      status: "pending",
    }).populate("requester", "username fullname avatar");

    res.status(200).json({ friendRequests: requests });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch requests" });
  }
};


export const handleFriendRequest = async (req, res) => {
  const { senderUsername, receiverUsername, action } = req.body;

  try {
    const sender = await User.findOne({ username: senderUsername });
    const receiver = await User.findOne({ username: receiverUsername });

    if (!sender || !receiver)
      return res.status(404).json({ message: "User not found" });

    const request = await Friend.findOne({
      requester: sender._id,
      recipient: receiver._id,
      status: "pending",
    });

    if (!request)
      return res.status(404).json({ message: "Request not found" });

    if (action === "accept") {
      request.status = "accepted";
    } else if (action === "reject") {
      request.status = "ignored";
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    await request.save();
    res.status(200).json({ message: `Friend request ${action}ed` });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


export const getFriends = async (req, res) => {
  try {
    const userId = req.user._id;

    const friendships = await Friend.find({
      $or: [
        { requester: userId, status: "accepted" },
        { recipient: userId, status: "accepted" },
      ],
    }).populate("requester recipient", "username fullname avatar");

    const friends = friendships.map((f) =>
      f.requester._id.equals(userId) ? f.recipient : f.requester
    );

    res.status(200).json({ friends });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const removeFriend = async (req, res) => {
    //console.log('remove')
  const { friendUserName } = req.body
  const  userId  = req.user._id

  const friend= await User.findOne({username:friendUserName})
  const friendId=friend._id
    //console.log(friendId,userId)
  try {
    const friendship = await Friend.findOneAndDelete({
      $or: [
        { requester: userId, recipient: friendId, status: "accepted" },
        { requester: friendId, recipient: userId, status: "accepted" },
      ],
    });

    if (!friendship) {
      return res.status(404).json({ message: "Friendship not found" });
    }

    res.status(200).json({ message: "Friend removed" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove friend" });
  }
};
