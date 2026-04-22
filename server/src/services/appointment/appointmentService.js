import Appointment from "../../models/Appointment.js"
import Visitor from "../../models/Visitor.js"
import Pass from "../../models/Pass.js"
import emailService from "../../utils/emailService.js"

export const approveAppointment = async (id) => {
  const appointment = await Appointment.findById(id)
    .populate("visitor")
    .populate("host", "name email")

  if (!appointment) throw new Error("Appointment not found")

  appointment.status = "approved"
  await appointment.save()

  await Visitor.findByIdAndUpdate(appointment.visitor._id, { status: "approved" })

  try {
    await emailService.sendApproval({
      id: appointment._id,
      visitorName: appointment.visitor.name,
      visitorEmail: appointment.visitor.email,
      date: appointment.date,
      hostName: appointment.host?.name || "Admin",
      location: "Main Office"
    })
  } catch (err) {
    console.error("Approval email failed:", err.message)
  }

  return appointment
}

export const rejectAppointment = async (id) => {
  const appointment = await Appointment.findById(id)
    .populate("visitor")
    .populate("host", "name email")

  if (!appointment) throw new Error("Appointment not found")

  appointment.status = "rejected"
  await appointment.save()

  await Visitor.findByIdAndUpdate(appointment.visitor._id, { status: "rejected" })

  try {
    await emailService.sendRejection({
      visitorName: appointment.visitor.name,
      visitorEmail: appointment.visitor.email,
      date: appointment.date,
      reason: "Appointment rejected by admin"
    })
  } catch (err) {
    console.error("Rejection email failed:", err.message)
  }

  return appointment
}

export const getAllAppointments = async () => {
  const appointments = await Appointment.find()
    .populate("visitor")
    .populate("host", "name email")
    .sort({ createdAt: -1 })

  const passes = await Pass.find().select("appointment")
  const passSet = new Set(passes.map(p => p.appointment.toString()))

  return appointments.map(a => ({
    ...a.toObject(),
    passGenerated: passSet.has(a._id.toString())
  }))
}

export const getAppointmentById = async (id) => {
  const appointment = await Appointment.findById(id)
    .populate("visitor")
    .populate("host", "name email")

  if (!appointment) throw new Error("Appointment not found")
  return appointment
}

export const getRequestedAppointmentsService = async () => {
  return await Appointment.find({ status: "requested" })
    .populate("visitor", "name email phone photo")
    .sort({ createdAt: -1 })
}

export const convertRequestToAppointmentService = async (requestId, employeeId, { date, hostId }) => {
  const request = await Appointment.findById(requestId)
    .populate("visitor")
    .populate("host", "name email")

  if (!request) throw new Error("Request not found")
  if (request.status !== "requested") throw new Error("This request has already been processed")

  request.status = "pending"
  request.date = new Date(date)
  request.host = hostId || employeeId
  request.scheduledBy = employeeId
  request.scheduledAt = new Date()

  await request.save()
  await request.populate("visitor", "name email phone")
  await request.populate("host", "name email")

  const visitor = await Visitor.findById(request.visitor._id)
  if (visitor) {
    visitor.status = "pending"
    await visitor.save()
  }

  try {
    await emailService.sendAppointmentCreated({
      id: request._id,
      visitorName: request.visitor.name,
      visitorEmail: request.visitor.email,
      date: request.date,
      hostName: request.host?.name || "To be assigned",
      location: "Main Office",
      message: request.message || "Your appointment has been scheduled. Waiting for admin approval."
    })
  } catch (err) {
    console.error("Schedule email failed:", err.message)
  }

  return request
}

export const getMyRequestsService = async (visitorId) => {
  return await Appointment.find({ visitor: visitorId, requestedByVisitor: true })
    .populate("host", "name email")
    .sort({ createdAt: -1 })
}
