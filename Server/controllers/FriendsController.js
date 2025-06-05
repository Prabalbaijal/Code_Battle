import { User } from "../models/Usermodel.js";  

export const sendrequest = async (req, res) => {
    const { senderUsername, receiverUsername } = req.body;

    try {
        console.log('Sender:', senderUsername, 'Receiver:', receiverUsername);

        const sender = await User.findOne({ username: senderUsername });
        const receiver = await User.findOne({ username: receiverUsername });

        if (!sender) {
            return res.status(404).json({ message: 'Sender not found. Please log in again!' });
        }

        if (!receiver) {
            return res.status(404).json({ message: 'Receiver not found!' });
        }

        if (sender._id.equals(receiver._id)) {
            return res.status(400).json({ message: 'You cannot send a friend request to yourself.' });
        }

        const alreadyFriends = sender.friends.includes(receiver._id);
        if (alreadyFriends) {
            return res.status(400).json({ message: 'You are already friend of this user.' });
        }
        const existingRequest = receiver.friendRequests.find(
            (req) => req.sender.toString() === sender._id.toString()
        );

        if (existingRequest) {
            return res.status(400).json({ message: 'Friend request already sent!' });
        }

        receiver.friendRequests.push({
            sender: sender._id,
            status: 'pending',
        });

        await receiver.save();

        res.status(200).json({ message: 'Friend request sent successfully!' });
    } catch (error) {
        console.error('Error in sendrequest:', error);
        res.status(500).json({ message: 'Failed to send friend request.' });
    }
};

export const getFriendRequests = async (req, res) => {
    try {
        // Get the logged-in user's ID from the `req.user` object (set by `isAuthenticated`)
        const userId = req.user._id;

        // Find the user and populate the friendRequests with the sender's details
        const user = await User.findById(userId)
            .populate('friendRequests.sender', 'fullname username avatar')  // Populate sender's details
            .select('friendRequests');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // Send the populated friendRequests as the response
        res.status(200).json({ success: true, friendRequests: user.friendRequests });
    } catch (error) {
        console.error('Error fetching friend requests:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch friend requests.' });
    }
};

export const handleFriendRequest = async (req, res) => {
    const { senderUsername, receiverUsername, action } = req.body; // action: 'accept' or 'reject'

    try {
        // Find both users
        const sender = await User.findOne({ username: senderUsername });
        const receiver = await User.findOne({ username: receiverUsername });

        if (!sender || !receiver) {
            return res.status(404).json({ message: 'User not found!' });
        }

        // Check for the friend request
        const friendRequest = receiver.friendRequests.find(
            (request) => request.sender.toString() === sender._id.toString()
        );

        if (!friendRequest) {
            return res.status(404).json({ message: 'Friend request not found!' });
        }

        if (friendRequest.status !== 'pending') {
            return res.status(400).json({ message: 'Friend request already processed!' });
        }

        // Handle the action
        if (action === 'accept') {
            const alreadyFriends =
                receiver.friends.includes(sender._id) || sender.friends.includes(receiver._id);
            if (!alreadyFriends) {
                receiver.friends.push(sender._id);
                sender.friends.push(receiver._id);
            }

            friendRequest.status = 'accepted'; // Optional: update status before filtering
        } else if (action === 'reject') {
            friendRequest.status = 'ignored'; // Optional: update status before filtering
        } else {
            return res.status(400).json({ message: 'Invalid action!' });
        }

        // Remove processed request from friendRequests array
        receiver.friendRequests = receiver.friendRequests.filter(
            (request) => request.sender.toString() !== sender._id.toString()
        );

        // Save both users
        await sender.save();
        await receiver.save();

        return res.status(200).json({ message: `Friend request ${action}ed successfully!` });
    } catch (error) {
        console.error('Error handling friend request:', error);
        return res.status(500).json({ message: 'Server Error' });
    }
};

export const getFriends = async (req, res) => {
    try {
        // Get the logged-in user
        const userId = req.user._id;
        // Find the user and populate the friends field with friend details
        const user = await User.findById(userId).populate('friends', 'username fullname avatar');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the list of friends
        return res.status(200).json({ friends: user.friends });
    } catch (error) {
        console.error('Error fetching friends:', error);
        return res.status(500).json({ message: 'Server Error' });
    }
};