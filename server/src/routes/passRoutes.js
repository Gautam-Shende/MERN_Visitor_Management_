import express from "express"
import {
  generatePass,
  scanPass,
  getPasses,
  getPassById,
  getCheckLogsByPassId,
} from "../controllers/security/passController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/api/pass/scan", protect, scanPass)
router.post("/api/pass/:id", protect, generatePass)
router.get("/api/pass", protect, getPasses)
router.get("/api/pass/:id", protect, getPassById)
router.get("/api/pass/:passId/checklogs", protect, getCheckLogsByPassId)

export default router