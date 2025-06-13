import express from 'express'
import isAuthenticated from '../middlewares/check-auth.js'
import { getFriendRequests,sendrequest,handleFriendRequest,getFriends, removeFriend } from '../controllers/FriendsController.js'

const router=express.Router()

router.route("/getfriendrequests").get(isAuthenticated,getFriendRequests)
router.route("/sendfriendrequest").post(isAuthenticated,sendrequest)
router.route("/handleRequest").post(isAuthenticated,handleFriendRequest)
router.route("/getfriends").get(isAuthenticated,getFriends)
router.route("/remove").put(isAuthenticated,removeFriend)

export default router