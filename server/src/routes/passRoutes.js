import express from "express"
import {
  generatePass,
  scanPass,
  getPasses,
  getPassById,
  getCheckLogsByPassId,
} from "../controllers/passController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/scan", protect, scanPass)
router.post("/:id", protect, generatePass)
router.get("/", protect, getPasses)
router.get("/:id", protect, getPassById)
router.get("/:passId/checklogs", protect, getCheckLogsByPassId)

export default router