import express from "express"
import {
  exportVisitorsCSV,
  exportVisitorsExcel,
} from "../controllers/admin/adminExportController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/api/export/csv/:visitorId", protect, exportVisitorsCSV)
router.get("/api/export/excel/:visitorId", protect, exportVisitorsExcel)

export default router