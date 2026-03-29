
import * as authService from "../services/authService.js"

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    
    if (!email || !password) {
      // console.log("Login attempt missing credentials")
      return res.status(400).json({ 
        message: "Email and password are required" 
      })
      // console.log("Error: Missing credentials")
    }
    
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/
    if (!emailRegex.test(email)) {
      // console.log("Invalid email format:", email)
      return res.status(400).json({ 
        message: "Please provide a valid email address" 
      })
      // console.log("Error: Invalid email format")
    }
    
    const result = await authService.loginUser(email, password)
    
    if (!result || !result.token || !result.user) {
     
      // console.log("Login service returned incomplete result")
      return res.status(401).json({ 
        message: "Authentication failed" 
      })
      // console.log("Error: Incomplete login result")
    }
    
    // console.log("User logged in successfully:", result.user.email)
    res.status(200).json({
     
      message: "Login successful, welcome back!",
      token: result.token,
      user: result.user,
    })
    // console.log("Login response sent successfully")
  
  } catch (err) {
    // console.error("Error in loginUser controller:", err)
    
    if (err.message === "Invalid email or password") {
      return res.status(401).json({ 
        message: "Invalid email or password" 
      })
      // console.log("Error: Invalid email or password")
    }
    
    if (err.message === "User not found") {
      
      return res.status(404).json({ 
        message: "No account found with this email" 
      })
      // console.log("Error: User not found")
    }
    
    if (err.message === "Account is blocked" || err.message === "Account is deactivated") {
     
      return res.status(403).json({ 
        message: err.message,
        reason: "Please contact administrator"
      })
      // console.log("Error: Account is blocked or deactivated")
    }
    
    if (err.message === "Email not verified") {
      return res.status(403).json({ 
       
        message: "Please verify your email before logging in",
        requiresVerification: true
      })
      // console.log("Error: Email not verified")
    }
    
    if (err.message === "Too many login attempts") {
     
      return res.status(429).json({ 
        message: "Too many login attempts. Please try again later" 
      })
      // console.log("toomany login....")
    }
    
    res.status(500).json({ 
      message: err.message || "Server error during login" 
    })
    // console.log(" server error during login problem....")
  }
}