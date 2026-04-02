import * as visitorAuthService from "../services/visitorAuthService.js"

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
    return res.status(400).json({ error: "Email and password required" })
  }
  
  try {
    const result = await visitorAuthService.loginVisitorService(email, password)
    res.status(200).json({
      message: "Login successful",
      token: result.token,
      visitor: result.visitor
    })
  } catch (error) {
    console.log("Login error:", error.message)
    res.status(401).json({ error: "Invalid credentials" })
  }
}

export const getVisitorProfile = async (req, res) => {
  const visitorId = req.visitor?._id
  
  if (!visitorId) {
    return res.status(401).json({ error: "Unauthorized" })
  }
  
  try {
    const visitor = await visitorAuthService.getVisitorProfileService(visitorId)
    res.status(200).json(visitor)
  } catch (error) {
    console.log("Profile error:", error.message)
    res.status(500).json({ error: "Failed to fetch profile" })
  }
}

export const updateVisitorProfile = async (req, res) => {
  const visitorId = req.visitor?._id
  const { name, phone } = req.body
  const photo = req.file
  
  if (!visitorId) {
    return res.status(401).json({ error: "Unauthorized" })
  }
  
  if (!name && !phone && !photo) {
    return res.status(400).json({ error: "Nothing to update" })
  }
  
  try {
    const visitor = await visitorAuthService.updateVisitorProfileService(
      visitorId,
      { name, phone },
      photo
    )
    res.status(200).json({ message: "Profile updated", visitor })
  } catch (error) {
    console.log("Update error:", error.message)
    res.status(500).json({ error: "Failed to update profile" })
  }
}


// ==================== NEW FUNCTIONS ====================

// Visitor submits appointment request


// Visitor submits appointment request
export const requestAppointment = async (req, res) => {
  try {
    const visitorId = req.visitor?._id
    
    if (!visitorId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in again"
      })
    }
    
    const { preferredDate, purpose, message } = req.body
    
    if (!preferredDate) {
      return res.status(400).json({
        success: false,
        message: "Preferred date is required"
      })
    }
    
    if (!purpose) {
      return res.status(400).json({
        success: false,
        message: "Purpose of visit is required"
      })
    }
    
    const requestDate = new Date(preferredDate)
    if (requestDate < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Date must be in the future"
      })
    }
    
    const Appointment = require("../models/Appointment.js").default
    
    const existingRequest = await Appointment.findOne({
      visitor: visitorId,
      status: "requested"
    })
    
    if (existingRequest) {
      return res.status(409).json({
        success: false,
        message: "You already have a pending request"
      })
    }
    
    const appointmentRequest = await Appointment.create({
      visitor: visitorId,
      preferredDate: requestDate,
      status: "requested",
      requestedByVisitor: true,
      purpose: purpose,
      message: message || "",
      date: null,
      host: null
    })
    
    res.status(201).json({
      success: true,
      message: "Appointment request sent successfully",
      data: appointmentRequest
    })
    
  } catch (error) {
    console.error("Error in requestAppointment:", error)
    res.status(500).json({
      success: false,
      message: error.message || "Failed to submit request"
    })
  }
}



// Visitor gets their requests
export const getMyRequests = async (req, res) => {
  try {
    const visitorId = req.visitor?._id
    
    const requests = await getMyRequestsService(visitorId)
    
    res.status(200).json({
      success: true,
      data: requests
    })
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch requests"
    })
  }
}