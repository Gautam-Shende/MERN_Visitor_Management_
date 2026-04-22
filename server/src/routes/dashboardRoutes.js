import express from "express"
import { getDashboardStats } from "../controllers/admin/adminDashboardController.js"
import { protect } from "../middleware/authMiddleware.js"
import { authorizeRoles } from "../middleware/roleMiddleware.js"

const router = express.Router()

router.get("/api/dashboard", protect, authorizeRoles("admin"), getDashboardStats)

export default router