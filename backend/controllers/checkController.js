

import * as checkService from "../services/checkService.js"

export const checkInVisitor = async (req, res) => {
  try {
    const { passId } = req.body
    
    if (!passId) {
    
      // console.log("Check-in attempt missing passId")
      return res.status(400).json({ 
        message: "Pass ID is required for check-in" 
      })
      // console.log("Error: Missing passId")
    }
    
  //  const result = await checkService.checkInVisitor(passId); // ✅ Email sent from service
   
    const result = await checkService.checkInVisitor(passId)
    
    if (!result || !result.visitorName || !result.checkLog) {
    
      // console.log("Check-in service returned incomplete result:", result)
      return res.status(500).json({ 
        message: "Invalid response from check-in service" 
      })
      // console.log("Error: Incomplete check-in result")
    }
    
    // console.log("Check-in successful for:", result.visitorName)
   
    res.status(200).json({
      success: true,
      message: `${result.visitorName} successfully checked in`,
      checkLog: result.checkLog,
    })
    // console.log("Check-in response sent successfully for passId:", passId)
  
  } catch (err) {
    // console.error("Error in checkInVisitor controller:", err)
    
    if (err.message === "Pass not found") {
     
      return res.status(404).json({ 
        message: "Invalid pass ID. Please check and try again" 
      })
      // console.log("Error: Pass not found for check-in")
    }
    
    if (err.message === "Visitor already checked in") {
     
      return res.status(409).json({ 
        message: "Visitor is already checked in",
        alreadyCheckedIn: true
      })
      // console.log("Error: Visitor already checked in")
    }
    
    if (err.message === "Invalid pass status") {
    
      return res.status(400).json({ 
        message: "This pass cannot be used for check-in at this time" 
      })
      // console.log("Error: Invalid pass status for check-in")
    }
    
    if (err.message === "Pass expired") {
    
      return res.status(410).json({ 
        message: "This pass has expired. Please contact the host" 
      })
      // console.log("Error: Pass expired")
    }
    
    res.status(500).json({ 
      message: err.message || "Server error occurred during check-in" 
    })
    // console.log("Error: Server error during check-in", err)
  }
}

export const checkOutVisitor = async (req, res) => {
  try {
    const { passId } = req.body
    
    if (!passId) {
     
      // console.log("Check-out attempt missing passId")
  
      return res.status(400).json({ 
        message: "Pass ID is required for check-out" 
      })
      // console.log("Error: Missing passId")
    }
    
    // console.log("Attempting check-out for passId:", passId)
    
    const result = await checkService.checkOutVisitor(passId)
    
    if (!result || !result.visitorName || !result.checkLog) {
    
      // console.log("Check-out service returned incomplete result:", result)
      return res.status(500).json({ 
        message: "Invalid response from check-out service" 
      })
      // console.log("Error: Incomplete check-out result")
    }
     // console.log("Check-out successful for:", result.visitorName)
    
    res.status(200).json({
      success: true,
      message: `${result.visitorName} successfully checked out`,
      checkLog: result.checkLog,
      summary: result.summary,
    })
    // console.log("Check-out response sent successfully for passId:", passId)
  
  } catch (err) {
    // console.error("Error in checkOutVisitor controller:", err)
    
    if (err.message === "Pass not found") {
     
      return res.status(404).json({ 
        message: "Invalid pass ID. Please check and try again" 
      })
      // console.log("Error: Pass not found for check-out")
    }
    
    if (err.message === "Visitor not checked in") {
     
      return res.status(400).json({ 
        message: "Visitor is not currently checked in",
        notCheckedIn: true
      })
      // console.log("Error: Visitor not checked in")
    }
    
    if (err.message === "Already checked out") {
     
      return res.status(409).json({ 
        message: "Visitor has already been checked out",
        alreadyCheckedOut: true
      })
      // console.log("Error: Visitor already checked out")
    }
    
    if (err.message === "Invalid check-out time") {
     
      return res.status(400).json({ 
        message: "Invalid check-out time. Check-out must be after check-in" 
      })
      // console.log("Error: Invalid check-out time")
    }
    
    if (err.message === "Maximum check-in duration exceeded") {
    
      return res.status(400).json({ 
        message: "Check-in duration exceeded maximum allowed time",
        requiresApproval: true
      })
      // console.log("Error: Maximum check-in duration exceeded")
    }
    
    res.status(500).json({ 
      message: err.message || "Server error occurred during check-out" 
    })
    // console.log("Error: Server error during check-out", err)
  }
}