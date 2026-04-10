import jwt from "jsonwebtoken"
import User from "../src/models/User.js"

export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]
  
  if (!token) {
    return res.status(401).json({ error: "No token provided" })
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select("-password")
    
    if (!user) {
      return res.status(401).json({ error: "User not found" })
    }
    
    req.user = user
    next()
  } catch (error) {
    console.log("Auth error:", error.message)
    return res.status(401).json({ error: "Invalid token" })
  }
}