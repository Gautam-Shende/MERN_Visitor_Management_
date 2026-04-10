import * as visitorAuthService from "../services/visitorAuthService.js"
import * as appointmentService from "../services/appointmentService.js"  // Add this

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



// ==================== APPOINTMENT FUNCTIONS ====================

export const requestAppointment = async (req, res) => {
  try {
    const visitorId = req.visitor?._id
    console.log("Visitor ID:", visitorId)

    if (!visitorId) {
      console.log("❌ No visitor ID") 
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
    
    const appointmentRequest = await appointmentService.requestAppointmentService({
      visitorId,
      preferredDate,
      purpose,
      message
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

export const getMyRequests = async (req, res) => {
  try {
    const visitorId = req.visitor?._id
    
    if (!visitorId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      })
    }
    
    const requests = await appointmentService.getMyRequestsService(visitorId)
    
    res.status(200).json({
      success: true,
      data: requests
    })
    
  } catch (error) {
    console.error("Error in getMyRequests:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch requests"
    })
  }
}