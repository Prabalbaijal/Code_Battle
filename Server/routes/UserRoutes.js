    import express from "express"
    import { getLeaderboard, getUserProfile, searchUsers } from "../controllers/UserControllers.js"
    import isAuthenticated from "../middlewares/check-auth.js"

    const router=express.Router()

    //Routes
   
    router.route("/updateprofile").get(isAuthenticated,getUserProfile)
    router.route("/search").get(isAuthenticated,searchUsers)
    router.route("/leaderboard").get(isAuthenticated,getLeaderboard)
    
    export default router