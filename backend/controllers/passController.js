import * as passService from "../services/passService.js"

export const generatePass = async (req, res) => {
  const { id } = req.params
  
  if (!id) {
    return res.status(400).json({ error: "Appointment ID required" })
  }
  
  try {
    const pass = await passService.generatePass(id)
    res.status(201).json({ message: "Pass generated", pass })
  } catch (error) {
    console.log("Pass generation error:", error.message)
    
    if (error.message === "Appointment not found") {
      return res.status(404).json({ error: "Appointment not found" })
    }
    if (error.message === "Appointment not approved") {
      return res.status(403).json({ error: "Appointment not approved yet" })
    }
    if (error.message === "Pass already generated") {
      return res.status(409).json({ error: "Pass already exists" })
    }
    res.status(500).json({ error: "Server error" })
  }
}

export const scanPass = async (req, res) => {
  const { qrData } = req.body
  
  if (!qrData) {
    return res.status(400).json({ error: "QR data required" })
  }
  
  try {
    const pass = await passService.scanPass(qrData)
    res.status(200).json({
      passId: pass._id,
      status: pass.status,
      visitor: pass.visitor
    })
  } catch (error) {
    console.log("Scan error:", error.message)
    res.status(400).json({ error: "Invalid QR code" })
  }
}

export const getPasses = async (req, res) => {
  try {
    const passes = await passService.getAllPasses()
    res.status(200).json(passes)
  } catch (error) {
    console.log("Error fetching passes:", error.message)
    res.status(500).json({ error: "Failed to fetch passes" })
  }
}

export const getPassById = async (req, res) => {
  const { id } = req.params
  
  if (!id) {
    return res.status(400).json({ error: "Pass ID required" })
  }
  
  try {
    const pass = await passService.getPassById(id)
    if (!pass) {
      return res.status(404).json({ error: "Pass not found" })
    }
    res.status(200).json(pass)
  } catch (error) {
    console.log("Error fetching pass:", error.message)
    res.status(500).json({ error: "Failed to fetch pass" })
  }
}

export const getCheckLogsByPassId = async (req, res) => {
  const { passId } = req.params
  
  if (!passId) {
    return res.status(400).json({ error: "Pass ID required" })
  }
  
  try {
    const logs = await passService.getCheckLogsByPassId(passId)
    res.status(200).json(logs)
  } catch (error) {
    console.log("Error fetching logs:", error.message)
    res.status(500).json({ error: "Failed to fetch logs" })
  }
}