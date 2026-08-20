import express from "express"
import User from "../models/User.js"
import { protect } from "../middleware/authMiddleware.js"
import { authorizeRoles } from "../middleware/roleMiddleware.js"
import { HTTP_STATUS, MESSAGES } from "../../constants.js"

const router = express.Router()

// User route: Admins and employees can access the user list
router.get("/api/users", protect, authorizeRoles("admin", "employee"), async (req, res) => {
  try {
    const users = await User.find().select("name email role")
    return res.status(HTTP_STATUS.OK).json(users)
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.SERVER_ERROR })
  }
})

export default router