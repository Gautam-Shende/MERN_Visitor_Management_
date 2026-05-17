import express from "express"
import { loginUser, getMe } from "../controllers/auth/authController.js"
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post("/api/auth/login", loginUser)
router.get('/api/auth/me', protect, getMe)

export default router