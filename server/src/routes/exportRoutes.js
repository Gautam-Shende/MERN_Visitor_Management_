import express from "express"
import {
  exportVisitorsCSV,
  exportVisitorsExcel,
} from "../controllers/reportController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/csv/:visitorId", protect, exportVisitorsCSV)
router.get("/excel/:visitorId", protect, exportVisitorsExcel)

export default router