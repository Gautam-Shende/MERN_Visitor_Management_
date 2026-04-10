import * as checkService from "../services/checkService.js"

export const checkInVisitor = async (req, res) => {
  const { passId } = req.body
  
  if (!passId) {
    return res.status(400).json({ error: "Pass ID required" })
  }
  
  try {
    const result = await checkService.checkInVisitor(passId)
    res.status(200).json({
      message: `${result.visitorName} checked in`,
      checkLog: result.checkLog
    })
  } catch (error) {
    console.log("Check-in error:", error.message)
    
    if (error.message === "Pass not found") {
      return res.status(404).json({ error: "Invalid pass" })
    }
    if (error.message === "Visitor already checked in") {
      return res.status(400).json({ error: "Already checked in" })
    }
    res.status(500).json({ error: "Server error" })
  }
}

export const checkOutVisitor = async (req, res) => {
  const { passId } = req.body
  
  if (!passId) {
    return res.status(400).json({ error: "Pass ID required" })
  }
  
  try {
    const result = await checkService.checkOutVisitor(passId)
    res.status(200).json({
      message: `${result.visitorName} checked out`,
      checkLog: result.checkLog
    })
  } catch (error) {
    console.log("Check-out error:", error.message)
    
    if (error.message === "Pass not found") {
      return res.status(404).json({ error: "Invalid pass" })
    }
    if (error.message === "Visitor not checked in") {
      return res.status(400).json({ error: "Not checked in" })
    }
    res.status(500).json({ error: "Server error" })
  }
}