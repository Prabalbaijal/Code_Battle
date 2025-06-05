import express from 'express'
import isAuthenticated from '../middlewares/check-auth.js'
import { login,logout,register,getUser,forgotPassword,resetPassword } from '../controllers/AuthControllers.js'
import { upload } from '../middlewares/multer.js'

const router=express.Router()

router.route("/register").post(upload.single('avatar'), register) 
router.route("/login").post(login)
router.route("/logout").get(logout)
router.route("/getUser").get(isAuthenticated,getUser)
router.route("/forgot-password").post(forgotPassword)
router.route("/reset-password/:token").post(resetPassword)

export default router