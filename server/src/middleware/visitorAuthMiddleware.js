
import jwt from "jsonwebtoken"
import Visitor from "../models/Visitor.js"
import { HTTP_STATUS, MESSAGES } from "../../constants.js"

// Authentication middleware to verify visitor JWT token
export const protectVisitor = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    // Verify presence of Bearer token
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MESSAGES.TOKEN_MISSING || MESSAGES.UNAUTHORIZED })
    }

    const token = authHeader.split(" ")[1]

    // Verify token using JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Find authenticated visitor by ID
    const visitor = await Visitor.findById(decoded.id).select("-password")
    if (!visitor) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MESSAGES.VISITOR_NOT_FOUND })
    }

    // Attach visitor object to request
    req.visitor = visitor
    next()
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MESSAGES.TOKEN_SESSION_EXPIRED })
    }
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MESSAGES.TOKEN_INVALID })
  }
}