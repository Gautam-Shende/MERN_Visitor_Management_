
import * as authService from "../../services/auth/authService.js"
import { HTTP_STATUS, MESSAGES } from "../../../constants.js"

export const loginUser = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    // console.log({ error: MESSAGES.LOGIN_EROR }M)
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: MESSAGES.LOGIN_EROR })
  }

  try {
    const result = await authService.loginUser(email, password)
    return res.status(HTTP_STATUS.OK).json({ token: result.token, user: result.user })
  } catch (err) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MESSAGES.LOGIN_FAILED })
  }
}
