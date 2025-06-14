import {User} from '../models/Usermodel.js'
import { uploadOnCloudinary } from '../config/cloudinary.js'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from "crypto"
import nodemailer from "nodemailer"

export const register = async (req, res) => {
    try {
        const { fullname, username, email, password, confirmPassword } = req.body
        const avatar = req.file ? req.file.path : null // Get the uploaded file path
        if (!avatar) {
            return res.status(400).json({ message: "Avatar is required." });
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
                isAdmin:user.isAdmin,
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
        isAdmin:user.isAdmin,
        success: true
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { 
            maxAge: 0 ,
            httpOnly:true,
            sameSite:'None',
            secure:true
        }).json({
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