import express from "express"

const router=express.Router()

//Routes
router.route("/register").post(upload.single('profilePicture'), register) 