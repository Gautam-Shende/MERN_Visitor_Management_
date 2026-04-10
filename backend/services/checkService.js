import Pass from "../models/Pass.js"
import CheckLog from "../models/CheckLog.js"

export const checkInVisitor = async (passId) => {
  const pass = await Pass.findById(passId).populate("visitor")
  
  if (!pass) {
    throw new Error("Pass not found")
  }
  
  if (pass.status === "expired") {
    throw new Error("Pass expired")
  }
  
  if (pass.status === "inside") {
    throw new Error("Visitor already checked in")
  }
  
  // Check if already checked in
  const existingLog = await CheckLog.findOne({ pass: pass._id, checkOutTime: null })
  if (existingLog) {
    throw new Error("Visitor already checked in")
  }
  
  const checkLog = new CheckLog({
    pass: pass._id,
    checkInTime: new Date()
  })
  
  await checkLog.save()
  
  pass.status = "inside"
  await pass.save()
  
  return { checkLog, visitorName: pass.visitor?.name || "Visitor" }
}

export const checkOutVisitor = async (passId) => {
  const pass = await Pass.findById(passId).populate("visitor")
  
  if (!pass) {
    throw new Error("Pass not found")
  }
  
  if (pass.status !== "inside") {
    throw new Error("Visitor not checked in")
  }
  
  const activeLog = await CheckLog.findOne({ pass: pass._id, checkOutTime: null })
  
  if (!activeLog) {
    throw new Error("No check-in record found")
  }
  
  activeLog.checkOutTime = new Date()
  await activeLog.save()
  
  pass.status = "expired"
  await pass.save()
  
  return { checkLog: activeLog, visitorName: pass.visitor?.name || "Visitor" }
}