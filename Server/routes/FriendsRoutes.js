import express from 'express'
import isAuthenticated from '../middlewares/check-auth.js'
import { getFriendRequests,sendrequest,handleFriendRequest,getFriends } from '../controllers/FriendsController.js'

const router=express.Router()

router.route("/getfriendrequests").get(isAuthenticated,getFriendRequests)
router.route("/sendfriendrequest").post(isAuthenticated,sendrequest)
router.route("/handleRequest").post(isAuthenticated,handleFriendRequest)
router.route("/getfriends").get(isAuthenticated,getFriends)

export default router