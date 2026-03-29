
import Appointment from "../models/Appointment.js"
import Pass from "../models/Pass.js"

export const getVisitorAppointmentsService = async (visitorId) => {
  
  const appointments = await Appointment.find({ visitor: visitorId })
   .populate("host", "name email")
    .sort({ createdAt: -1 })
    .lean()

  if (!appointments || appointments.length === 0) {
    // console.log("Error: No appointments found for visitor")
    throw new Error("No appointments found")
  }

  const appointmentIds = appointments.map(a => a._id)

  const passes = await Pass.find({
    appointment: { $in: appointmentIds }
  }).select("appointment")

  const passAppointmentIds = new Set(
    passes.map(p => p.appointment.toString())
  )

  return appointments.map(a => ({
    ...a,
    passGenerated: passAppointmentIds.has(a._id.toString())
  }))
}


export const getVisitorDashboardService = async (visitorId) => {
  const appointments = await Appointment.find({ visitor: visitorId })
 
  const passes = await Pass.find({ visitor: visitorId })

  if (!appointments) {
    // console.log("Error: Failed to fetch appointments")
    throw new Error("Unable to fetch appointments")
  }

  return {
    totalAppointments: appointments.length,
    pending: appointments.filter(a => 
      a.status === "pending").length,

    approved: appointments.filter(a => 
      a.status === "approved").length,

    rejected: appointments.filter(a => 
      a.status === "rejected").length,

    passGenerated: passes.length
  }
}


export const getVisitorPassesService = async (visitorId) => {

  const passes = await Pass.find({ visitor: visitorId })
    .populate({
      path: "appointment",
      populate: { path: "host", select: "name email" }
    })
    .sort({ createdAt: -1 })

  // even if empty, returning array is fine
  return passes
}


export const getVisitorPassByAppointmentService = async (visitorId, appointmentId) => {

  const pass = await Pass.findOne({
    appointment: appointmentId,
    visitor: visitorId
  })
    .populate("visitor")
    .populate({
      path: "appointment",
      populate: { path: "host", select: "name email" }
    })

    // console.log(appointment)

  if (!pass) {
    // console.log("Error: Pass not found for given appointment")
    throw new Error("Pass not found")
  }

  // returning populated pass
  return pass
}