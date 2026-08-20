
import * as visitorAuthService from "../../services/auth/visitorAuthService.js"
import * as appointmentService from "../../services/appointment/appointmentService.js"
import { HTTP_STATUS, MESSAGES } from "../../../constants.js"

// Visitor Registration Controller
export const registerVisitor = async (req, res) => {
  const { name, email, password, phone, purpose } = req.body
  const photo = req.file

  if (!name || !email || !password || !phone) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "All fields required" })
  }

  if (password.length < 6) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Password must be 6+ characters" })
  }

  try {
    const result = await visitorAuthService.registerVisitorService(
      { name, email, password, phone, purpose },
      photo
    )
    return res.status(HTTP_STATUS.CREATED).json({
      message: MESSAGES.REGISTER_SUCCESS,
      token: result.token,
      visitor: result.visitor,
    })
  } catch (error) {
    if (error.message === "Visitor already registered with this email") {
      return res.status(HTTP_STATUS.CONFLICT).json({ message: MESSAGES.EMAIL_EXISTS })
    }
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.SERVER_ERROR })
  }
}

// Visitor Login Controller
export const loginVisitor = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: MESSAGES.LOGIN_ERROR,
    })
  }

  try {
    const result = await visitorAuthService.loginVisitorService(email, password)
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.LOGIN_SUCCESS,
      token: result.token,
      visitor: result.visitor,
    })
  } catch (err) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: MESSAGES.LOGIN_FAILED,
    })
  }
}

// Get Visitor Profile Controller
export const getVisitorProfile = async (req, res) => {
  const visitorId = req.visitor?._id

  if (!visitorId) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MESSAGES.UNAUTHORIZED })
  }

  try {
    const visitor = await visitorAuthService.getVisitorProfileService(visitorId)
    return res.status(HTTP_STATUS.OK).json(visitor)
  } catch (err) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.SERVER_ERROR })
  }
}

// Request Appointment Controller
export const requestAppointment = async (req, res) => {
  const visitorId = req.visitor?._id

  if (!visitorId) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: MESSAGES.UNAUTHORIZED })
  }

  const { preferredDate, purpose, message } = req.body

  if (!preferredDate) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: "Preferred date is required" })
  }

  if (!purpose) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: "Purpose of visit is required" })
  }

  try {
    const appointment = await visitorAuthService.requestAppointmentService({
      visitorId,
      preferredDate,
      purpose,
      message,
    })

    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: MESSAGES.APPOINTMENT_REQUEST_SUCCESS,
      data: appointment,
    })
  } catch (err) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: err.message || "Failed to submit request" })
  }
}

// Get My Appointment Requests Controller
export const getMyRequests = async (req, res) => {
  const visitorId = req.visitor?._id

  if (!visitorId) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: MESSAGES.UNAUTHORIZED })
  }

  try {
    const requests = await appointmentService.getMyRequestsService(visitorId)
    return res.status(HTTP_STATUS.OK).json({ success: true, data: requests })
  } catch (err) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to fetch requests..." })
  }
}

