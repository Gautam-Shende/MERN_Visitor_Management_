import User from "../models/User.js"
import jwt from "jsonwebtoken"

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" })
}

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email: email.toLowerCase() })
  
  if (!user) {
    throw new Error("Invalid email or password")
  }
  
  const isMatch = await user.comparePassword(password)
  
  if (!isMatch) {
    throw new Error("Invalid email or password")
  }
  
  const token = generateToken(user._id)
  const { password: _, ...userData } = user.toObject()
  
  return { token, user: userData }
}