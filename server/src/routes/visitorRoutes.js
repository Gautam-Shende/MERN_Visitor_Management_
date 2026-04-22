import express from "express"
import { getVisitors, getVisitorById } from "../controllers/auth/visitorController.js"
import { protect } from "../middleware/authMiddleware.js"
import { authorizeRoles } from "../middleware/roleMiddleware.js"

const router = express.Router()

router.get("/api/visitors", protect, authorizeRoles("admin", "employee"), getVisitors)
router.get("/api/visitors/:id", protect, authorizeRoles("admin", "employee"), getVisitorById)

export default router