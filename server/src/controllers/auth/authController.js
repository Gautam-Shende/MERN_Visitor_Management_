
import * as authService from "../../services/auth/authService.js"
import { HTTP_STATUS, MESSAGES } from "../../../constants.js"
import User from "../../models/User.js"

// User login controller
export const loginUser = async (req, res) => {
  const { email, password } = req.body

  // Validate required inputs
  if (!email || !password) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: MESSAGES.LOGIN_ERROR })
  }

  try {
    const result = await authService.loginUser(email, password)
    return res.status(HTTP_STATUS.OK).json({ token: result.token, user: result.user })
  } catch (err) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MESSAGES.LOGIN_FAILED })
  }
}

// Get authenticated user profile controller
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password")

    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: MESSAGES.USER_NOT_FOUND })
    }

    return res.status(HTTP_STATUS.OK).json({ user })
  } catch (err) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.SERVER_ERROR })
  }
}

