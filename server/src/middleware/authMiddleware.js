import jwt from "jsonwebtoken"
import User from "../models/User.js"
import { HTTP_STATUS, MESSAGES } from "../../constants.js"

// Authentication middleware to verify user JWT token
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    // Verify presence of Bearer token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MESSAGES.TOKEN_MISSING || MESSAGES.UNAUTHORIZED })
    }

    const token = authHeader.split(" ")[1]

    // Verify token using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Find authenticated user by ID
    const user = await User.findById(decoded.id).select("-password")
    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MESSAGES.USER_NOT_FOUND })
    }

    // Attach user object to request
    req.user = user
    next()
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MESSAGES.TOKEN_SESSION_EXPIRED })
    }
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MESSAGES.TOKEN_INVALID })
  }
}