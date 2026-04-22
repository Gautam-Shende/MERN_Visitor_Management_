import Appointment from "../../models/Appointment.js"
import Pass from "../../models/Pass.js"

export const getVisitorAppointmentsService = async (visitorId) => {
  const appointments = await Appointment.find({ visitor: visitorId })
    .populate("host", "name email")
    .sort({ createdAt: -1 })

  const passes = await Pass.find().select("appointment")
  const passSet = new Set(passes.map(p => p.appointment.toString()))

  return appointments.map(a => ({
    ...a.toObject(),
    passGenerated: passSet.has(a._id.toString())
  }))
}

export const getVisitorDashboardService = async (visitorId) => {
  const appointments = await Appointment.find({ visitor: visitorId })
  const passes = await Pass.find({ visitor: visitorId })

  return {
    totalAppointments: appointments.length,
    requested: appointments.filter(a => a.status === "requested").length,
    pending: appointments.filter(a => a.status === "pending").length,
    approved: appointments.filter(a => a.status === "approved").length,
    rejected: appointments.filter(a => a.status === "rejected").length,
    
    totalPasses: passes.length,
    passGenerated: passes.length,
    activePasses: passes.filter(p => p.status === "active" || p.status === "approved").length,
    expiredPasses: passes.filter(p => p.status === "expired" || p.status === "completed").length,
    insidePasses: passes.filter(p => p.status === "inside" || p.isCheckedIn === true).length,
  }
}

export const getVisitorPassesService = async (visitorId) => {
  return await Pass.find({ visitor: visitorId })
    .populate({ path: "appointment", populate: { path: "host", select: "name email" } })
    .sort({ createdAt: -1 })
}

export const getVisitorPassByAppointmentService = async (visitorId, appointmentId) => {
  const pass = await Pass.findOne({ appointment: appointmentId, visitor: visitorId })
    .populate("visitor")
    .populate({ path: "appointment", populate: { path: "host", select: "name email" } })

  if (!pass) throw new Error("Pass not found")
  return pass
}
