import express from "express"
import { register,login, logout, getQuestion } from "../controllers/UserControllers.js"
import { upload } from "../middlewares/multer.js"
import multer from "multer"

const router=express.Router()

//Routes
router.route("/register").post(upload.single('avatar'), register) 
router.route("/login").post(login)
router.route("/logout").get(logout)
router.get('/unattempted/:userId/:difficulty',getQuestion)

export default router