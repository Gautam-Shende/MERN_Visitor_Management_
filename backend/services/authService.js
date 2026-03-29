
import User from "../models/User.js" 
import jwt from "jsonwebtoken"

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, 
    process.env.JWT_SECRET, 
    // { expiresIn: 1Day" })
    { expiresIn: "7d" })
}

export const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new Error("Email and password required")
    // console.log("Email and password required")
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Please enter valid email")
        // console.log("Please enter valid email")

  }

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) {
    throw new Error("Email not found");
    // console.log("Email not found")
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error("Wrong password");
    // console.log(Error("wrong password"))
  }

  const token = generateToken(user._id, user.role);
  const { password: _, ...safeUserData } = user.toObject();

  return { token, user: safeUserData };
}