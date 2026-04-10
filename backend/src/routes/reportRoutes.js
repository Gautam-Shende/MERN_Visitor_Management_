import express from "express"
import { getVisitorReport } from "../controllers/reportController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router();

// router.get("/reports/visitors", getVisitorReport)
router.get("/api/reports/visitors", protect, getVisitorReport)

export default router
