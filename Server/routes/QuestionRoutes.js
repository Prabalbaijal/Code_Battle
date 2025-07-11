import express from 'express'
import isAuthenticated from '../middlewares/check-auth.js'
import { addQuestion, submitQuestion } from '../controllers/QuestionControllers.js'

const router = express.Router()

router.route("/submit").post(isAuthenticated,submitQuestion)
router.route("/add-question").post(isAuthenticated,addQuestion)

export default router