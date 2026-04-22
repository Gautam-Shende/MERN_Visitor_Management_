
import * as visitorAuthService from "../../services/auth/visitorAuthService.js"
import { HTTP_STATUS, MESSAGES } from "../../../constants.js"

// export const registerVisitor = async (req, res) => {

//   const { name, email, password, phone} = req.body;

//   // const photo = req.body;
//   const photo = req.file;

//   if (!name || !email || !password || !phone) {
//     return res.status(HTTP_STATUS.BAD_REQUEST).json({  message: MESSAGES.VISITOR_REGISTER_ERROR })
//   }

//   if (password.length < 6) {
//     return res.status(HTTP_STATUS.BAD_REQUEST).json({  message: "Password must be 6+ characters" })
//   }

//   try {
//     const result = await visitorAuthService.registerVisitorService(
//       { name, email, password, phone}, photo);

//     return res.status(HTTP_STATUS.CREATED).json({
//       message: MESSAGES.REGISTER_SUCCESS,
//       token: result.token,
//       visitor: result.visitor
//     })

//   } catch (err) {
//     if (err.message === "Visitor already registered with this email") {
//           // console.log({error: MESSAGES.EMAIL_EXISTS})
//       return res.status(HTTP_STATUS.CONFLICT).json({ message: MESSAGES.EMAIL_EXISTS})
//     }
//     return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.SERVER_ERROR })
//   }
// }

export const registerVisitor = async (req, res) => {
  const { name, email, password, phone, purpose } = req.body
  const photo = req.file
  
  if (!name || !email || !password || !phone) {
    return res.status(400).json({ error: "All fields required" })
  }
  
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be 6+ characters" })
  }
  
  try {
    const result = await visitorAuthService.registerVisitorService(
      { name, email, password, phone, purpose },
      photo
    )
    res.status(201).json({
      message: "Registration successful",
      token: result.token,
      visitor: result.visitor
    })
  } catch (error) {
    console.log("Registration error:", error.message)
    
    if (error.message === "Visitor already registered with this email") {
      return res.status(409).json({ error: "Email already exists" })
    }
    res.status(500).json({ error: "Server error" })
  }
}

export const loginVisitor = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: MESSAGES.LOGIN_ERROR,
      //  error: MESSAGES.LOGIN_ERROR 
      })
  }

  try {
    const result = await visitorAuthService.loginVisitorService(email, password)
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.LOGIN_SUCCESS,
      token: result.token,
      visitor: result.visitor
    })
  } catch (err) {
    // console.log({ error: MESSAGES.LOGIN_FAILED })
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ 
      success: false,
      message: MESSAGES.LOGIN_FAILED,
      // error: MESSAGES.LOGIN_FAILED 
    })
  }
}

export const getVisitorProfile = async (req, res) => {
  const visitorId = req.visitor?._id;

  if (!visitorId){
     return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MESSAGES.UNAUTHORIZED })
  }

  try {
    const visitor = await visitorAuthService.getVisitorProfileService(visitorId)
    return res.status(HTTP_STATUS.BAD_REQUEST).json(visitor);

  } catch (err) {
    // console.log({ error: MESSAGES.SERVER_ERROR })
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.SERVER_ERROR })
  }
}

export const requestAppointment = async (req, res) => {
  const visitorId = req.visitor?._id;

  if (!visitorId) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: MESSAGES.UNAUTHORIZED })
  }

  const { preferredDate, purpose, message } = req.body;

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
      message
    })

    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: MESSAGES.APPOINTMENT_REQUEST_SUCCESS,
      data: appointment
    })
  } catch (err) {
    // console.log({ success: false, message: err.message || "Failed to submit request" })
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: err.message || "Failed to submit request" })
  }
}

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
