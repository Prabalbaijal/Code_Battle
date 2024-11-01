import {User} from '../models/Usermodel.js'
import { uploadOnCloudinary } from '../config/cloudinary.js'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Question from '../models/QuestionModel.js'

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
            sameSite: 'strict'
        })
            .json({
                _id: user._id,
                email: user.email,
                fullname:user.fullname,
                username:user.username,
                avatar:user.avatar,
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

export const getQuestion = async (req, res) => {
    try {
        const userId = req.user.id; // User ID from decoded token
        const user = await User.findById(userId).populate('questionsAttempted');
        if(!user) console.log("User not found ")
        
        // Determine difficulty based on user's level
        let difficulty;
        if (user.level === 0 || user.level === 1) difficulty = 'Easy';
        else if (user.level === 2 || user.level === 3) difficulty = 'Medium';
        else difficulty = 'Hard';

        // Fetch a question not yet attempted by the user
        const question = await Question.findOne({
            difficulty,
            _id: { $nin: user.questionsAttempted }
        });

        if (!question) return res.status(404).json({ message: 'No questions available' });
        res.json(question);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
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