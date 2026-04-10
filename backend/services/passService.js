import mongoose from "mongoose"
import Pass from "../models/Pass.js"
import Appointment from "../models/Appointment.js"
import CheckLog from "../models/CheckLog.js"

export const generatePass = async (appointmentId) => {
  const appointment = await Appointment.findById(appointmentId)
    .populate("visitor")
    .populate("host", "name email")
  
  if (!appointment) {
    throw new Error("Appointment not found")
  }
  
  if (appointment.status !== "approved") {
    throw new Error("Appointment not approved")
  }
  
  const existingPass = await Pass.findOne({ appointment: appointment._id })
  
  if (existingPass) {
    throw new Error("Pass already generated")
  }
  
  const pass = new Pass({
    visitor: appointment.visitor._id,
    appointment: appointment._id,
    status: "active"
  })
  
  await pass.save()
  
  // TODO: Generate QR and PDF here (can be separate function)
  // For now, return basic pass
  
  return pass
}

export const scanPass = async (qrData) => {
  let passId = qrData
  
  // Handle different QR formats
  if (qrData.startsWith("PASS:")) {
    passId = qrData.replace("PASS:", "")
  }
  
  if (!mongoose.Types.ObjectId.isValid(passId)) {
    throw new Error("Invalid pass ID")
  }
  
  const pass = await Pass.findById(passId).populate("visitor", "name email")
  
  if (!pass) {
    throw new Error("Pass not found")
  }
  
  return pass
}

export const getAllPasses = async () => {
  return await Pass.find()
    .populate("visitor", "name email phone")
    .populate({
      path: "appointment",
      populate: { path: "host", select: "name email" }
    })
    .sort({ createdAt: -1 })
}

export const getPassById = async (id) => {
  const pass = await Pass.findById(id)
    .populate("visitor")
    .populate({
      path: "appointment",
      populate: { path: "host", select: "name email" }
    })
  
  if (!pass) {
    throw new Error("Pass not found")
  }
  
  return pass
}

export const getCheckLogsByPassId = async (passId) => {
  return await CheckLog.find({ pass: passId }).sort({ checkInTime: -1 })
}