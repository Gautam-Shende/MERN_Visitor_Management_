import jwt from "jsonwebtoken"
import Visitor from "../models/Visitor.js"

export const protectVisitor = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]
  
  if (!token) {
    return res.status(401).json({ error: "No token provided" })
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const visitor = await Visitor.findById(decoded.id).select("-password")
    
    if (!visitor) {
      return res.status(401).json({ error: "Visitor not found" })
    }
    
    req.visitor = visitor
    next()
  } catch (error) {
    console.log("Visitor auth error:", error.message)
    return res.status(401).json({ error: "Invalid token" })
  }
}