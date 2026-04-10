import * as visitorAppointmentService from "../services/visitorAppointmentService.js"

export const getMyAppointments = async (req, res) => {
  const visitorId = req.visitor?._id
  
  if (!visitorId) {
    return res.status(401).json({ error: "Unauthorized" })
  }
  
  try {
    const appointments = await visitorAppointmentService.getVisitorAppointmentsService(visitorId)
    res.status(200).json(appointments)
  } catch (error) {
    console.log("Error fetching appointments:", error.message)
    res.status(500).json({ error: "Failed to fetch appointments" })
  }
}

export const getVisitorDashboard = async (req, res) => {
  const visitorId = req.visitor?._id
  
  if (!visitorId) {
    return res.status(401).json({ error: "Unauthorized" })
  }
  
  try {
    const stats = await visitorAppointmentService.getVisitorDashboardService(visitorId)
    res.status(200).json(stats)
  } catch (error) {
    console.log("Dashboard error:", error.message)
    res.status(500).json({ error: "Failed to load dashboard" })
  }
}

export const getMyPasses = async (req, res) => {
  const visitorId = req.visitor?._id
  
  if (!visitorId) {
    return res.status(401).json({ error: "Unauthorized" })
  }
  
  try {
    const passes = await visitorAppointmentService.getVisitorPassesService(visitorId)
    res.status(200).json(passes)
  } catch (error) {
    console.log("Error fetching passes:", error.message)
    res.status(500).json({ error: "Failed to fetch passes" })
  }
}

export const getPassByAppointment = async (req, res) => {
  const visitorId = req.visitor?._id
  const { appointmentId } = req.params
  
  if (!visitorId) {
    return res.status(401).json({ error: "Unauthorized" })
  }
  
  if (!appointmentId) {
    return res.status(400).json({ error: "Appointment ID required" })
  }
  
  try {
    const pass = await visitorAppointmentService.getVisitorPassByAppointmentService(
      visitorId,
      appointmentId
    )
    res.status(200).json(pass)
  } catch (error) {
    console.log("Error fetching pass:", error.message)
    res.status(500).json({ error: "Failed to fetch pass" })
  }
}