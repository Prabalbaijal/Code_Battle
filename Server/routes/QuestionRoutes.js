import express from 'express'
import isAuthenticated from '../middlewares/check-auth.js'
import { submitQuestion } from '../controllers/QuestionControllers.js'

const router = express.Router()

router.route("/submit").post(submitQuestion)

export default router