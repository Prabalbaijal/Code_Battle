    import express from "express"
    import { register,login, logout, getQuestion, submitQuestion, sendrequest, handleFriendRequest, getFriendRequests, getFriends, getUserProfile } from "../controllers/UserControllers.js"
    import { upload } from "../middlewares/multer.js"
    import multer from "multer"
    import isAuthenticated from "../middlewares/check-auth.js"

    const router=express.Router()

    //Routes
    router.route("/register").post(upload.single('avatar'), register) 
    router.route("/login").post(login)
    router.route("/logout").get(logout)
    router.route("/question").get(isAuthenticated,getQuestion)
    router.route("/submit").post(submitQuestion)
    router.route("/getfriendrequests").get(isAuthenticated,getFriendRequests)
    router.route("/sendfriendrequest").post(sendrequest)
    router.route("/handleRequest").post(handleFriendRequest)
    router.route("/getfriends").get(isAuthenticated,getFriends)
    router.route("/updateprofile").get(isAuthenticated,getUserProfile)
    
    export default router