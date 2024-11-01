import express from "express"
import { register,login, logout } from "../controllers/UserControllers.js"
import { upload } from "../middlewares/multer.js"
import multer from "multer"

const router=express.Router()

//Routes
router.route("/register").post(upload.single('avatar'), register) 
router.route("/login").post(login)
router.route("/logout").get(logout)

export default router