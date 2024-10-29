import express from "express"
import { register } from "../controllers/UserControllers.js"
import { upload } from "../middlewares/multer.js"

const router=express.Router()

//Routes
router.route("/register").post(upload.single('avatar'), register) 

export default router