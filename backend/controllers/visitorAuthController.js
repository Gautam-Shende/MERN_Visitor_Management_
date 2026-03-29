
import * as visitorAuthService from "../services/visitorAuthService.js"

export const registerVisitor = async (req, res) => {
  try {
    const { body, file } = req
    
   
    if (!body.name || !body.email || !body.password || !body.phone) {
     
      // console.log("Registration attempt missing required fields")
      return res.status(400).json({
        success: false,
        message: "Name, email, password, and phone are required"
      })
      // console.log("Error: Missing required registration fields")
    }
    
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/
   
    if (!emailRegex.test(body.email)) {
     
      // console.log("Invalid email format during registration:", body.email)
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address"
      })
      // console.log("Error: Invalid email format")
    }
    
    if (body.password.length < 6) {
      // console.log("Password too short during registration")
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long"
      })
      // console.log("Error: Password too short")
    }
    
    // console.log("Attempting to register new visitor with email:", body.email)
    const result = await visitorAuthService.registerVisitorService(body, file)
    
    if (!result || !result.token || !result.visitor) {
     
      // console.log("Registration service returned incomplete result")
      return res.status(500).json({
        success: false,
        message: "Registration failed due to service error"
      })
      // console.log("Error: Incomplete registration result")
    }
    // console.log("Visitor registered successfully:", result.visitor.email)
    
    
    res.status(201).json({
      success: true,
      message: "Visitor registered successfully",
      ...result,
    })
    // console.log("Registration response sent for email:", body.email)
 
  } catch (error) {
    // console.error("Registration Error:", error)
    
    if (error.message === "Visitor already registered with this email") {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
        alreadyExists: true
      })
      // console.log("Error: Visitor already exists with email")
    }
    
    if (error.message === "Invalid file format" || error.message === "Photo upload failed") {
      return res.status(400).json({
        success: false,
        message: "Invalid photo format. Please upload a valid image"
      })
      // console.log("Error: Invalid photo upload")
    }
    
    if (error.message === "Database connection error") {
     
      return res.status(503).json({
        success: false,
        message: "Service temporarily unavailable. Please try again later"
      })
      // console.log("Error: Database connection issue")
    }
    
    res.status(500).json({
      success: false,
      message: error.message || "Server error during registration"
    })
    // console.log("Error: Server error during registration", error)
  }
}

export const loginVisitor = async (req, res) => {
  try {
    const { email, password } = req.body
    
    if (!email || !password) {
     
      // console.log("Login attempt missing credentials")
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      })
      // console.log("Error: Missing login credentials")
    }
    
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/
    if (!emailRegex.test(email)) {
      
      // console.log("Invalid email format during login:", email)
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address"
      })
      // console.log("Error: Invalid email format")
    }
    
    // console.log("Attempting login for email:", email)
    const result = await visitorAuthService.loginVisitorService(email, password)
    
    if (!result || !result.token || !result.visitor) {
      
      // console.log("Login service returned incomplete result for email:", email)
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      })
      // console.log("Error: Incomplete login result")
    }
    // console.log("Login successful for email:", email)
   
   
    res.status(200).json({
      success: true,
      message: "Login successful",
      ...result,
    })
    // console.log("Login response sent for email:", email)
  } 
  catch (error) {
    // console.error("Login error:", error)
    
    if (error.message === "Invalid email or password") {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      })
      // console.log("Error: Invalid credentials")
    }
    
    if (error.message === "Account is pending approval") {
      
      return res.status(403).json({
        success: false,
        message: "Your account is pending approval. Please wait for admin approval",
        status: "pending"
      })
      // console.log("Error: Account pending approval")
    }
    
    if (error.message === "Account is rejected") {
      return res.status(403).json({
        success: false,
        message: "Your account registration has been rejected. Please contact support",
        status: "rejected"
      })
      // console.log("Error: Account rejected")
    }
    
    if (error.message === "Account is blocked") {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked. Please contact administrator",
        status: "blocked"
      })
      // console.log("Error: Account blocked")
    }
    
    if (error.message === "Too many failed login attempts") {
     
      return res.status(429).json({
        success: false,
        message: "Too many failed attempts. Please try again after 15 minutes"
      })
      // console.log("Error: Rate limit exceeded")
    }
    
    res.status(401).json({
      success: false,
      message: error.message || "Invalid credentials"
    })
    // console.log("Error: Login failed", error)
  }
}

export const getVisitorProfile = async (req, res) => {
  try {
    const visitorId = req.visitor?._id
    
    if (!visitorId) {
     
      // console.log("Get profile attempt - no visitor ID in request")
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in again"
      })
      // console.log("Error: Missing visitor ID")
    }
    
    // console.log("Fetching profile for visitor ID:", visitorId)
    
    
    const visitor = await visitorAuthService.getVisitorProfileService(visitorId)
    

    if (!visitor) {
    
      // console.log("Visitor profile not found for ID:", visitorId)
      return res.status(404).json({
        success: false,
        message: "Visitor profile not found"
      })
      // console.log("Error: Visitor not found")
    }
    // console.log("Profile fetched successfully for:", visitor.email)
   
   
    res.status(200).json({
      success: true,
      visitor,
    })
    // console.log("Profile response sent for visitor ID:", visitorId)
  }
   catch (error) {
    // console.error("Error in getVisitorProfile:", error)
    
    if (error.message === "Visitor not found") {
      return res.status(404).json({
        success: false,
        message: "Visitor profile not found"
      })
      // console.log("Error: Visitor not found in service")
    }
    
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch profile"
    })
    // console.log("Error: Server error while fetching profile", error)
  }
}

export const updateVisitorProfile = async (req, res) => {
  try {
    const visitorId = req.visitor?._id
    const { body, file } = req
    
    
    if (!visitorId) {
      // console.log("Update profile attempt - no visitor ID in request")
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please log in again"
      })
      // console.log("Error: Missing visitor ID")
    }
    
    if (!body.name && !body.phone && !file) {
      // console.log("Update profile attempt with no update data")
      return res.status(400).json({
        success: false,
        message: "At least one field (name, phone, or photo) is required for update"
      })
      // console.log("Error: No update data provided")
    }
    

    if (body.phone && !/^\d{10}$/.test(body.phone)) {
      // console.log("Invalid phone format:", body.phone)
      return res.status(400).json({
        success: false,
        message: "Please provide a valid 10-digit phone number"
      })
      // console.log("Error: Invalid phone format")
    }
    
    // console.log("Updating profile for visitor ID:", visitorId)
    
    
    const visitor = await visitorAuthService.updateVisitorProfileService(
      visitorId,
      body,
      file
    )
    
    if (!visitor) {
      // console.log("Visitor not found for update - ID:", visitorId)
      return res.status(404).json({
        success: false,
        message: "Visitor profile not found"
      })
      // console.log("Error: Visitor not found")
    }
    
    // console.log("Profile updated successfully for visitor ID:", visitorId)
    
    
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      visitor,
    })
    // console.log("Update response sent for visitor ID:", visitorId)
  
  } catch (error) {
    // console.error("Error in updateVisitorProfile:", error)
    
    if (error.message === "Visitor not found") {
      return res.status(404).json({
        success: false,
        message: "Visitor profile not found"
      })
      // console.log("Error: Visitor not found for update")
    }
    
    if (error.message === "Email already in use") {
      return res.status(409).json({
        success: false,
        message: "This email is already registered to another account"
      })
      // console.log("Error: Email conflict during update")
    }
  

    if (error.message === "Invalid file format" || error.message === "Photo upload failed") {
      
      return res.status(400).json({
        success: false,
        message: "Invalid photo format. Please upload a valid image"
      })
      // console.log("Error: Invalid photo upload during update")
    }
    
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update profile"
    })
    // console.log("Error: Server error during profile update", error)
  }
}