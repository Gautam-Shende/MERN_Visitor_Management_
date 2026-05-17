import User from "../../models/User.js"
import jwt from "jsonwebtoken"

const makeToken = (userId) => {
  return jwt.sign({ id: userId }, 
  process.env.JWT_SECRET, { expiresIn: "7d" })
}

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email: email.toLowerCase() })
  if (!user) throw new Error("Invalid email or password")

  const passwordOk = await user.comparePassword(password)
  if (!passwordOk) throw new Error("Invalid email or password")

  const token = makeToken(user._id)
  const { password: _pw, ...rest } = user.toObject()

  return { token, user: rest }
}
