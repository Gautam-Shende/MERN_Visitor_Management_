
import * as visitorService from "../services/visitorService.js"

export const getVisitors = async (req, res) => {
  try {
   
    // console.log("Fetching all visitors...")
    
    const visitors = await visitorService.getAllVisitors()
    
    if (!visitors) {
    
      // console.log(" No visitors found")
    
      return res.status(200).json({ 
        message: "No visitors found", 
        visitors: [] 
      })
      // console.log("Info: Empty visitors list")
    }
    
    // console.log("Found visitors:", visitors.length)
    res.status(200).json(visitors)
   
    // console.log("Visitors response sent successfully")
  } 
  
  catch (error) {
    
    if (error.message === "Database connection error") {
      return res.status(503).json({ 
        message: "Service temporarily unavailable. Please try again later",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined
      })
      // console.log("Error: Database connection issue")
    }
    
    res.status(500).json({ 
      message: error.message || "Failed to fetch visitors",
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined
    })
    // console.log("Error: Server error while fetching visitors", error)
  }
}

export const getVisitorById = async (req, res) => {
  try {
    const { id } = req.params
    
   
    if (!id) {
      // console.log("Get visitor by ID attempt missing ID")
      return res.status(400).json({ 
        message: "Visitor ID is required" 
      })
      // console.log("Error: Missing visitor ID")
    }  
    // console.log("Fetching visitor by ID:", id)
    
    
    const visitor = await visitorService.getVisitorById(id)
    
    if (!visitor) {
     
      // console.log("Visitor not found with ID:", id)
      return res.status(404).json({ 
        message: "Visitor not found" 
      })
      // console.log("Error: Visitor not found")
    }
    // console.log("Visitor found:", visitor.name, "with email:", visitor.email)
    
    
    res.status(200).json(visitor)
    // console.log("Visitor response sent for ID:", id)
  } 
  
  catch (error) {
    // console.error("Error in getVisitorById:", error)
    
    if (error.name === "CastError") {
      return res.status(400).json({ 
        message: "Invalid visitor ID format" 
      })
      // console.log("Error: Invalid visitor ID format")
    }
    
    if (error.message === "Visitor not found") {
      return res.status(404).json({ 
        message: "Visitor not found" 
      })
      // console.log("Error: Visitor not found in service")
    }
    
    res.status(500).json({ 
      message: error.message || "Failed to fetch visitor" 
    })
    // console.log("Error: Server error while fetching visitor by ID", error)
  }
}

export const createVisitor = async (req, res) => {
  try {
    const { body, file } = req
    
    if (!body.name || !body.email || !body.phone || !body.purpose || !body.host) {
      // console.log("Create visitor attempt missing required fields:", { 
      //   name: !!body.name, 
      //   email: !!body.email, 
      //   phone: !!body.phone, 
      //   purpose: !!body.purpose, 
      //   host: !!body.host 
      // })
      return res.status(400).json({ 
        success: false, 
        message: "All fields (name, email, phone, purpose, host) are required" 
      })
      // console.log("Error: Missing required fields for visitor creation")
    }
    
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/
   
   
    if (!emailRegex.test(body.email)) {
    
      // console.log("Invalid email format:", body.email)
      return res.status(400).json({ 
        success: false, 
        message: "Please provide a valid email address" 
      })
      // console.log("Error: Invalid email format")
    }
    
    
    if (!/^\d{10}$/.test(body.phone)) {
      // console.log("Invalid phone format:", body.phone)
      return res.status(400).json({ 
        success: false, 
        message: "Please provide a valid 10-digit phone number" 
      })
      // console.log("Error: Invalid phone format")
    }
    
    // console.log("Creating new visitor with email:", body.email)
   
   
    const visitor = await visitorService.createVisitor(body, file)
    
    if (!visitor) {
    
      // console.log("Visitor creation failed - service returned null")
      return res.status(500).json({ 
        success: false, 
        message: "Failed to create visitor due to service error" 
      })
      // console.log("Error: Visitor creation service returned null")
    }
    // console.log("Visitor created successfully:", visitor._id, "with email:", visitor.email)
    
    
    res.status(201).json({
      success: true,
      message: "Visitor created successfully",
      data: visitor,
    })
    // console.log("Create visitor response sent for ID:", visitor._id)
  
  } catch (error) {
    // console.error("Error in createVisitor:", error)
    

    if (error.message === "Visitor already registered with this email") {
      return res.status(409).json({ 
        success: false, 
        message: "A visitor with this email already exists",
        alreadyExists: true
      })
      // console.log("Error: Duplicate visitor email")
    }
    
    if (error.message === "Host not found") {
      return res.status(404).json({ 
        success: false, 
        message: "The specified host was not found" 
      })
      // console.log("Error: Host not found for visitor")
    }
    
    if (error.message === "Invalid host ID") {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid host ID format" 
      })
      // console.log("Error: Invalid host ID")
    }
    
    if (error.message === "Invalid file format" || error.message === "Photo upload failed") {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid photo format. Please upload a valid image file" 
      })
      // console.log("Error: Invalid photo upload")
    }
    
    if (error.name === "ValidationError") {
      
      return res.status(400).json({ 
        success: false, 
        message: "Validation error: " + error.message 
      })
      // console.log("Error: Validation error in visitor data")
    }
    
    res.status(500).json({ 
      success: false, 
      message: error.message || "Server error while creating visitor" 
    })
    // console.log("Error: Server error during visitor creation", error)
  }
}