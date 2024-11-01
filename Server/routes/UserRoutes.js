import express from "express"
import { register,login, logout, getQuestion } from "../controllers/UserControllers.js"
import { upload } from "../middlewares/multer.js"
import multer from "multer"
import isAuthenticated from "../middlewares/check-auth.js"

const router=express.Router()

//Routes
router.route("/register").post(upload.single('avatar'), register) 
router.route("/login").post(login)
router.route("/logout").get(logout)
router.route("/question").get(isAuthenticated,getQuestion)

export default router