    import express from "express"
    import { getUserProfile, searchUsers } from "../controllers/UserControllers.js"
    import isAuthenticated from "../middlewares/check-auth.js"

    const router=express.Router()

    //Routes
   
    router.route("/updateprofile").get(isAuthenticated,getUserProfile)
    router.route("/search").get(isAuthenticated,searchUsers)
    
    export default router