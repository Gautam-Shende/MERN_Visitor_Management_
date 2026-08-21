import express from "express"
import { getUsers } from "../controllers/userController.js"
import { protect } from "../middleware/authMiddleware.js"
import { authorizeRoles } from "../middleware/roleMiddleware.js"

const router = express.Router()

router.get("/", protect, authorizeRoles("admin", "employee"), getUsers)

export default router