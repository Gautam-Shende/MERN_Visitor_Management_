
import { HTTP_STATUS } from "../../constants.js"

// Authorization middleware to check if req.user has required role
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role

    // Stop request if no role is available on req.user
    if (!userRole) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "User role not found" })
    }

    // Stop request if role is not permitted
    if (!allowedRoles.includes(userRole)) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        message: `Access denied. ${userRole} role is not permitted.`,
      })
    }

    // Role authorized, continue to next middleware or controller
    next()
  }
}

