import User from "../../models/User.js"
import jwt from "jsonwebtoken"

// Generate JWT containing user identification ID
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" })
}

// Service to handle user login authentication
export const loginUser = async (email, password) => {
  const sanitizedEmail = email ? email.toLowerCase().trim() : ""

  const user = await User.findOne({ email: sanitizedEmail })
  if (!user) {
    throw new Error("Invalid email or password")
  }

  const isMatch = await user.comparePassword(password)
  if (!isMatch) {
    throw new Error("Invalid email or password")
  }

  const token = generateToken(user._id)

  return {
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  }
}

