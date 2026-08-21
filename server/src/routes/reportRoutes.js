import express from "express"
import { getVisitorReport } from "../controllers/reportController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/visitors", protect, getVisitorReport)

export default router