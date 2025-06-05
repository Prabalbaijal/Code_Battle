import express from 'express'
import { getActiveContests } from '../controllers/ContestControllers.js'
import isAuthenticated from '../middlewares/check-auth.js'

const router=express.Router()

router.route("/activecontests").post(isAuthenticated,getActiveContests)

export default router