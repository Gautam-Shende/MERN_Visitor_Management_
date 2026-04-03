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

// Get all requested appointments (for employee)
export const getRequestedAppointments = async (req, res) => {
  try {
    const requests = await appointmentService.getRequestedAppointmentsService()  // ← FIXED
    
    res.status(200).json({
      success: true,
      data: requests
    })
    
  } catch (error) {
    console.error("Error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch requests"
    })
  }
}

// Get count for badge
export const getRequestedAppointmentsCount = async (req, res) => {
  try {
    const count = await appointmentService.getRequestedAppointmentsCountService()  // ← FIXED
    
    res.status(200).json({
      success: true,
      count: count
    })
    
  } catch (error) {
    console.error("Error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch count"
    })
  }
}

// Employee converts request to appointment
export const convertRequestToAppointment = async (req, res) => {
  try {
    const { id } = req.params
    const { date, hostId } = req.body
    const employeeId = req.user?._id
    
    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Appointment date is required"
      })
    }
    
    const appointment = await appointmentService.convertRequestToAppointmentService(id, employeeId, { date, hostId })  // ← FIXED
    
    res.status(200).json({
      success: true,
      message: "Appointment confirmed successfully",
      data: appointment
    })
    
  } catch (error) {
    if (error.message === "Request not found") {
      return res.status(404).json({
        success: false,
        message: error.message
      })
    }
    
    res.status(500).json({
      success: false,
      message: error.message || "Failed to confirm appointment"
    })
  }
}

// Admin approves appointment
export const adminApprove = async (req, res) => {
  const { id } = req.params
  const adminId = req.user?._id
  
  if (!id) {
    return res.status(400).json({ error: "Appointment ID required" })
  }
  
  try {
    const appointment = await appointmentService.adminApproveAppointment(id, adminId)
    res.status(200).json({
      success: true,
      message: "Appointment approved successfully",
      data: appointment
    })
  } catch (error) {
    console.log("Error approving appointment:", error.message)
    res.status(500).json({ error: error.message })
  }
}

// Admin rejects appointment
export const adminReject = async (req, res) => {
  const { id } = req.params
  const { reason } = req.body
  const adminId = req.user?._id
  
  if (!id) {
    return res.status(400).json({ error: "Appointment ID required" })
  }
  
  try {
    const appointment = await appointmentService.adminRejectAppointment(id, adminId, reason)
    res.status(200).json({
      success: true,
      message: "Appointment rejected",
      data: appointment
    })
  } catch (error) {
    console.log("Error rejecting appointment:", error.message)
    res.status(500).json({ error: error.message })
  }
}

// Get pending appointments for admin
export const getPendingAppointments = async (req, res) => {
  try {
    const appointments = await appointmentService.getPendingAppointmentsForAdmin()
    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    })
  } catch (error) {
    console.log("Error fetching pending appointments:", error.message)
    res.status(500).json({ error: "Failed to fetch appointments" })
  }
}