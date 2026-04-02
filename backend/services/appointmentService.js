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

// Get all requested appointments
export const getRequestedAppointmentsService = async () => {
  const requests = await Appointment.find({
    status: "requested",
    requestedByVisitor: true
  })
  .populate("visitor", "name email phone photo purpose")
  .sort({ createdAt: -1 })
  
  return requests
}

// Get count for badge
export const getRequestedAppointmentsCountService = async () => {
  const count = await Appointment.countDocuments({
    status: "requested",
    requestedByVisitor: true
  })
  return count
}

// Convert request to actual appointment (employee confirms)
export const convertRequestToAppointmentService = async (requestId, employeeId, appointmentData) => {
  const { date, hostId } = appointmentData
  
  const request = await Appointment.findById(requestId).populate("visitor")
  
  if (!request) {
    throw new Error("Request not found")
  }
  
  if (request.status !== "requested") {
    throw new Error("This request has already been processed")
  }
  
  // Update the same appointment
  request.date = new Date(date)
  request.host = hostId || employeeId
  request.status = "pending"  // Now pending for admin approval
  request.requestedByVisitor = false
  await request.save()
  
  await request.populate("host", "name email")
  
  return request
}