import User from "../models/User.js"
import { HTTP_STATUS } from "../constants.js"

// Get list of users (Admin / Employee access)
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("name email role")
    return res.status(HTTP_STATUS.OK).json(users)
  } catch (error) {
    next(error)
  }
}
