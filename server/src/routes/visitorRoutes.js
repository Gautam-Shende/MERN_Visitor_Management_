import express from "express"
import { getVisitors, getVisitorById } from "../controllers/visitorController.js"
import { protect } from "../middleware/authMiddleware.js"
import { authorizeRoles } from "../middleware/roleMiddleware.js"

const router = express.Router()

router.get("/", protect, authorizeRoles("admin", "employee"), getVisitors)
router.get("/:id", protect, authorizeRoles("admin", "employee"), getVisitorById)

export default router