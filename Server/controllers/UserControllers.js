import {User} from '../models/Usermodel.js'
import { uploadOnCloudinary } from '../config/cloudinary.js'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Question from '../models/QuestionModel.js'
import axios from 'axios'
import { Contest } from '../models/ContestModel.js'
import { contestUsers, unSocketMap, updateOnlineUsers } from '../socket/socket.js'
import { updateUserDataOnNoWinner } from './UserUpdate.js'
import crypto from "crypto"
import nodemailer from "nodemailer"


export const register = async (req, res) => {
    try {
        const { fullname, username, email, password, confirmPassword } = req.body
        const avatar = req.file ? req.file.path : null // Get the uploaded file path
        if (!avatar) {
            return res.status(400).json({ message: "Avatar is required. hai hi nhi" });
        }
        if (!fullname || !username || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required!!" })
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" })
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Please provide a valid email" })
        }

        const user1 = await User.findOne({ email })
        if (user1) {
            return res.status(400).json({ message: "Email already exists! Try a different one." })
        }
        if(await User.findOne({username})){
            return res.status(400).json({message:"Username already exists! Try another one."})
        }

        const hashedPass = await bcrypt.hash(password, 10)
        let avatarUrl = null;
        if (avatar) {
            const uploadResponse = await uploadOnCloudinary(avatar);
            if (uploadResponse) {
                avatarUrl = uploadResponse.secure_url;
            }
        }
        if (!avatarUrl) {
            return res.status(400).json({ message: "Avatar is required." });
        }
        
        const user = await User.create({
            fullname,
            username,
            email,
            password: hashedPass,
            avatar:avatarUrl, 
            createdAt: new Date()
        })

        const createdUser = await User.findById(user._id).select("-password")
        if (!createdUser) {
            return res.status(500).json({
                message: "Something went wrong while registering the user!!"
            })
        }

        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
            user: createdUser
        })
    } catch (error) {
        console.error(error.message)
        return res.status(500).json({
            message: 'Server Error',
            success: false
        })
    }
}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body
        if (!username || !password) {
            return res.status(400).json({ message: "Please fill all the required fields." })
        }

        const user = await User.findOne({ username })
        if (!user) {
            return res.status(400).json({
                message: "Invalid user!!",
                success: false
            })
        }

        const matchPassword = await bcrypt.compare(password, user.password)
        if (!matchPassword) {
            return res.status(400).json({
                message: "Incorrect Password!!",
                success: false
            })
        }

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.JWT_SECRET, {
            expiresIn: '1d'
        })

        return res.status(200).cookie("token", token, {
            maxAge: 1 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'None',
            secure:true,
        })
            .json({
                _id: user._id,
                email: user.email,
                fullname:user.fullname,
                username:user.username,
                avatar:user.avatar,
                level:user.level,
                coins:user.coins,
                success: true
            })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: 'Server Error',
            success: false
        })
    }
}

export const getUser = async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      const user=req.user;
      res.status(200).json({
        _id: user._id,
        email: user.email,
        fullname:user.fullname,
        username:user.username,
        avatar:user.avatar,
        level:user.level,
        coins:user.coins,
        success: true
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged Out Successfully."
        })
    } catch (error) {
        console.error('Error during logout:', error)
        res.status(500).json({
            message: 'Server Error',
            success: false
        })
    }
}

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate Reset Token
        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
        await user.save();

        // Send Reset Email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const resetURL = `http://localhost:5173/reset-password/${resetToken}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Password Reset Request",
            html: `<p>Click <a href="${resetURL}">here</a> to reset your password. This link is valid for 1 hour.</p>`,
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: "Reset link sent to your email" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

export const resetPassword = async (req, res) => {
    console.log("inside")
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }, // Ensure token is not expired
        });
        console.log(user)
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }
        const hashedPass = await bcrypt.hash(newPassword, 10)
        user.password = hashedPass; // Ensure password is hashed using a pre-save middleware
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: "Password reset successful" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


export const getQuestion = async (user1, user2) => {
    try {
        // Fetch attempted questions by both users
        console.log(user1)
        console.log(user2)
        const user1Data = await User.findOne({ username: user1 }).select("questionsAttempted");
        const user2Data = await User.findOne({ username: user2 }).select("questionsAttempted");

        if (!user1Data || !user2Data) {
            throw new Error("One or both users not found");
        }

        const attemptedQuestions = [...user1Data.questionsAttempted, ...user2Data.questionsAttempted];
        console.log(attemptedQuestions)
        // Fetch a random question that has not been attempted
        const question = await Question.findOne({
            _id:{$nin : attemptedQuestions}
        });
        console.log(question.title)
        return  question;
    } catch (error) {
        console.error("Error fetching problem:", error);
        return null;
    }
};





export const recordAttempt=async (req, res) => {
    const { userId, questionId } = req.body;

    try {
        // Check if the attempt already exists to avoid duplicates
        const existingAttempt = await Attempt.findOne({ userId, questionId });
        if (existingAttempt) {
            return res.status(200).json({ message: 'Attempt already recorded' });
        }

        // Record new attempt
        const newAttempt = new Attempt({ userId, questionId });
        await newAttempt.save();

        res.json({ message: 'Attempt recorded successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error recording attempt', error });
    }
}

export const submitQuestion = async (req, res) => {
    const { source_code, language_id, testCases, executionTimes } = req.body;
    const maxRetries = 5; // Number of retry attempts
    const retryDelay = 2000; // Delay between retries in ms

    try {
        const results = [];
        const timeLimit = executionTimes.find(et => et.language_id === language_id)?.timeLimit || 1; // Default to 1 sec if not specified

        for (let i = 0; i < testCases.length; i++) {
            const testCase = testCases[i];
            const submissionResponse = await axios.post(
                'https://judge0-ce.p.rapidapi.com/submissions',
                {
                    source_code,
                    language_id,
                    stdin: testCase.input
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
                        'X-RapidAPI-Key': process.env.JUDGE0_API_KEY
                    }
                }
            );

            const token = submissionResponse.data.token;
            let attempt = 0;
            let resultResponse;

            // Retry loop to check for final result
            while (attempt < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, retryDelay));
                
                resultResponse = await axios.get(
                    `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
                            'X-RapidAPI-Key': process.env.JUDGE0_API_KEY
                        }
                    }
                );

                const status = resultResponse.data.status.description;
                
                if (status !== 'Processing') {
                    break; // Exit loop if result is not in "Processing"
                }
                
                attempt++;
            }
            const { stdout, stderr, status, compile_output, time } = resultResponse.data;
            const actualOutput = stdout ? stdout.trim() : null;
            console.log(actualOutput)
            console.log(testCase.expectedOutput)
            const executionTime = time ? parseFloat(time) : 0;
            console.log(executionTime)
            results.push({
                expected: testCase.expectedOutput,
                actual: actualOutput,
                isCorrect: actualOutput === testCase.expectedOutput,
                status,
                time: executionTime,
                compile_output,
                error: stderr
            });

            // Check TLE only for the second test case(since it has larger test cases) (index 1)
            if (i === 1 && executionTime > timeLimit) {
                results[i].status = "Time Limit Exceeded";
                results[i].isCorrect = false;
            }
        }

        const allPassed = results.every(result => result.isCorrect);

        res.json({
            allPassed,
            results
        });
    } catch (error) {
        console.error('Error in code submission:', error);
        res.status(500).json({ error: 'Error submitting code for evaluation' });
    }
};


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
        if(!alreadyFriends){
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

  export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch user data and populate opponent details
        const user = await User.findById(userId, "level coins matchHistory")
            .populate({
                path: "matchHistory.opponent",  // Populate opponent field
                select: "username"  // Only fetch username
            });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Format matchHistory to ensure opponent's username is sent instead of ID
        const formattedMatchHistory = user.matchHistory.map(match => ({
            ...match.toObject(),
            opponent: match.opponent?.username || "Unknown"  // Ensure username is returned
        }));

        res.json({
            level: user.level,
            coins: user.coins,
            matchHistory: formattedMatchHistory
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const scheduleContestTimeout = (roomName, endTime) => {
    const timeRemaining = endTime - Date.now();

    if (timeRemaining <= 0) return; // If already expired, exit.

    setTimeout(async () => {
        const contest = await Contest.findOne({ roomName, status: "active" });

        if (contest) {
            const { user1, user2 } = contest;

            // Notify users
            [user1, user2].forEach((user) => {
                const usersocket=unSocketMap.get(user)
                if (usersocket) {
                    usersocket.emit('contestEnded',{
                        winner:'Nobody',
                        message:'Nobody won.Time Up!!'
                    })
                }
            });
            updateUserDataOnNoWinner(user1,user2)

            // Remove contest from DB
            contestUsers.delete(user1);
            contestUsers.delete(user2);
            updateOnlineUsers()
            await Contest.findOneAndDelete({ roomName });
            console.log(`Contest ${roomName} ended due to timeout.`);
        }
    }, timeRemaining);
};

export const rescheduleAllTimeouts = async () => {
    try {
        const activeContests = await Contest.find({ status: "active" });

        activeContests.forEach((contest) => {
            scheduleContestTimeout(contest.roomName, contest.endTime);
        });

        console.log(`✅ Rescheduled ${activeContests.length} contest timeouts.`);
    } catch (error) {
        console.error("❌ Error rescheduling contests:", error);
    }
};
export const getActiveContests=async (req, res) => {
    try {
        const { username } = req.body; // Get username from request body

        // Find active contests where user is either user1 or user2
        const contests = await Contest.find({
            $or: [{ user1: username }, { user2: username }],
            status: "active"
        }).select("roomName user1 user2 endTime");

        // Process contests to determine opponent names without extra DB calls
        const contestsWithOpponent = contests.map(contest => ({
            roomName: contest.roomName,
            endTime: contest.endTime,
            opponentName: contest.user1 === username ? contest.user2 : contest.user1, // Determine opponent directly
        }));

        res.json(contestsWithOpponent);
    } catch (error) {
        console.error("Error fetching active contests:", error);
        res.status(500).json({ message: "Server error" });
    }
}

export const searchUsers = async (req, res) => {
    try {
      const query = req.query.query;
      if (!query) {
        return res.status(400).json({ message: 'Query is required' });
      }
  
      // Case-insensitive regex search
      const users = await User.find({
        username: { $regex: query, $options: 'i' },
      })
        .select('_id username fullname avatar')
        .limit(10);
  
      res.status(200).json({ users });
    } catch (error) {
      console.error('Error in searchUsers:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };