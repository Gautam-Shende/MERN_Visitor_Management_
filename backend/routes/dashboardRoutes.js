
import express from "express"
// import User from "../models/User.js"

import { getDashboardStats } from "../controllers/dashboardController.js"

import { protect } from "../middleware/authMiddleware.js"

// import storage from "../middleware/uploadMiddleware.js"
import { authorizeRoles } from "../middleware/roleMiddleware.js"

const router = express.Router();

router.get("/api/dashboard", protect, authorizeRoles("admin"), getDashboardStats)

export default router
