import Appointment from "../models/Appointment.js"
import Visitor from "../models/Visitor.js"
import User from "../models/User.js"
import Pass from "../models/Pass.js"

export const createAppointment = async (visitorId, date) => {
  const visitor = await Visitor.findById(visitorId)
  if (!visitor) {
    throw new Error("Visitor not found")
  }
  
  // Find a host
  let hostId = visitor.host
  if (!hostId) {
    const defaultHost = await User.findOne({ role: "admin" })
    if (defaultHost) hostId = defaultHost._id
  }
  
  const appointment = new Appointment({
    visitor: visitorId,
    host: hostId,
    date: date,
    status: "pending"
  })
  
  await appointment.save()
  return appointment
}

export const approveAppointment = async (id) => {
  const appointment = await Appointment.findById(id).populate("visitor")
  
  if (!appointment) {
    throw new Error("Appointment not found")
  }
  
  appointment.status = "approved"
  await appointment.save()
  
  // Update visitor status
  await Visitor.findByIdAndUpdate(appointment.visitor._id, { status: "approved" })
  
  return appointment
}

export const rejectAppointment = async (id) => {
  const appointment = await Appointment.findById(id).populate("visitor")
  
  if (!appointment) {
    throw new Error("Appointment not found")
  }
  
  appointment.status = "rejected"
  await appointment.save()
  
  await Visitor.findByIdAndUpdate(appointment.visitor._id, { status: "rejected" })
  
  return appointment
}

export const getAllAppointments = async () => {
  const appointments = await Appointment.find()
    .populate("visitor")
    .populate("host", "name email")
    .sort({ createdAt: -1 })
  
  // Check which appointments have passes
  const passes = await Pass.find().select("appointment")
  const passIds = new Set(passes.map(p => p.appointment.toString()))
  
  return appointments.map(a => ({
    ...a.toObject(),
    passGenerated: passIds.has(a._id.toString())
  }))
}

export const getAppointmentById = async (id) => {
  const appointment = await Appointment.findById(id)
    .populate("visitor")
    .populate("host", "name email")
  
  if (!appointment) {
    throw new Error("Appointment not found")
  }
  
  return appointment
}

export const requestAppointmentService = async ({ visitorId, preferredDate, purpose, message }) => {
  // Validate date
  const requestDate = new Date(preferredDate)
  if (requestDate < new Date()) {
    throw new Error("Date must be in the future")
  }
  
  // Check for existing pending request
  const existingRequest = await Appointment.findOne({
    visitor: visitorId,
    status: "requested"
  })
  
  if (existingRequest) {
    throw new Error("You already have a pending request")
  }
  
  // Create new appointment request
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
  
  return appointmentRequest
}

// Add these functions to your existing appointmentService.js file

export const getRequestedAppointmentsService = async () => {
  const requests = await Appointment.find({ status: "requested" })
    .populate("visitor", "name email phone")
    .sort({ createdAt: -1 })
  
  return requests
}

export const getRequestedAppointmentsCountService = async () => {
  const count = await Appointment.countDocuments({ status: "requested" })
  return count
}

export const convertRequestToAppointmentService = async (requestId, employeeId, { date, hostId }) => {
  // Find the request
  const request = await Appointment.findById(requestId)
  
  if (!request) {
    throw new Error("Request not found")
  }
  
  if (request.status !== "requested") {
    throw new Error("This request has already been processed")
  }
  
  // Update the request to scheduled appointment (NOT approved yet)
  request.status = "pending"  // ← CHANGE: "approved" se "pending" karo
  request.date = new Date(date)
  request.host = hostId || employeeId
  request.scheduledBy = employeeId
  request.scheduledAt = new Date()
  
  await request.save()
  
  // Populate visitor details
  await request.populate("visitor", "name email phone")
  await request.populate("host", "name email")
  
  return request
}

// Admin approves scheduled appointment
export const adminApproveAppointment = async (appointmentId, adminId) => {
  const appointment = await Appointment.findById(appointmentId).populate("visitor")
  
  if (!appointment) {
    throw new Error("Appointment not found")
  }
  
  if (appointment.status !== "pending" && appointment.status !== "scheduled") {
    throw new Error("Appointment cannot be approved")
  }
  
  appointment.status = "approved"
  appointment.approvedBy = adminId
  appointment.approvedAt = new Date()
  
  await appointment.save()
  
  // Update visitor status
  await Visitor.findByIdAndUpdate(appointment.visitor._id, { status: "approved" })
  
  return appointment
}

// Admin rejects scheduled appointment
export const adminRejectAppointment = async (appointmentId, adminId, reason) => {
  const appointment = await Appointment.findById(appointmentId).populate("visitor")
  
  if (!appointment) {
    throw new Error("Appointment not found")
  }
  
  if (appointment.status !== "pending" && appointment.status !== "scheduled") {
    throw new Error("Appointment cannot be rejected")
  }
  
  appointment.status = "rejected"
  appointment.approvedBy = adminId
  appointment.approvedAt = new Date()
  appointment.rejectionReason = reason || "No reason provided"
  
  await appointment.save()
  
  await Visitor.findByIdAndUpdate(appointment.visitor._id, { status: "rejected" })
  
  return appointment
}

// Get pending appointments (for admin to review)
export const getPendingAppointmentsForAdmin = async () => {
  const appointments = await Appointment.find({ 
    status: { $in: ["pending", "scheduled"] }
  })
    .populate("visitor", "name email phone")
    .populate("host", "name email")
    .populate("scheduledBy", "name email")
    .sort({ scheduledAt: -1 })
  
  return appointments
}