import express from "express"
// Auth request handlers
import { loginUser, getMe } from "../controllers/auth/authController.js"
// protected route
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// Public route: authentication  authentication not required
// Login with email and password
router.post("/api/auth/login", loginUser)
// Return the currently logged-in user
router.get('/api/auth/me', protect, getMe)

export default router