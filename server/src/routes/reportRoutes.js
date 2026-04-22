import express from "express"
import { getVisitorReport } from "../controllers/admin/adminReportController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/api/reports/visitors", protect, getVisitorReport)

export default router