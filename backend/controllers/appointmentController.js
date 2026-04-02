import * as appointmentService from "../services/appointmentService.js"

export const createAppointment = async (req, res) => {
  const { visitorId, date } = req.body
  
  if (!visitorId || !date) {
    return res.status(400).json({ error: "Visitor ID and date are required" })
  }
  
  try {
    const appointment = await appointmentService.createAppointment(visitorId, date)
    res.status(201).json(appointment)
  } catch (error) {
    console.log("Error creating appointment:", error.message)
    res.status(500).json({ error: "Failed to create appointment" })
  }
}

export const approveAppointment = async (req, res) => {
  const { id } = req.params
  
  if (!id) {
    return res.status(400).json({ error: "Appointment ID required" })
  }
  
  try {
    const appointment = await appointmentService.approveAppointment(id)
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" })
    }
    res.status(200).json(appointment)
  } catch (error) {
    console.log("Error approving appointment:", error.message)
    res.status(500).json({ error: "Failed to approve appointment" })
  }
}

export const rejectAppointment = async (req, res) => {
  const { id } = req.params
  
  if (!id) {
    return res.status(400).json({ error: "Appointment ID required" })
  }
  
  try {
    const appointment = await appointmentService.rejectAppointment(id)
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" })
    }
    res.status(200).json(appointment)
  } catch (error) {
    console.log("Error rejecting appointment:", error.message)
    res.status(500).json({ error: "Failed to reject appointment" })
  }
}

export const getAppointments = async (req, res) => {
  try {
    const appointments = await appointmentService.getAllAppointments()
    res.status(200).json(appointments)
  } catch (error) {
    console.log("Error fetching appointments:", error.message)
    res.status(500).json({ error: "Failed to fetch appointments" })
  }
}

export const getAppointmentById = async (req, res) => {
  const { id } = req.params
  
  if (!id) {
    return res.status(400).json({ error: "Appointment ID required" })
  }
  
  try {
    const appointment = await appointmentService.getAppointmentById(id)
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" })
    }
    res.status(200).json(appointment)
  } catch (error) {
    console.log("Error fetching appointment:", error.message)
    res.status(500).json({ error: "Failed to fetch appointment" })
  }
}