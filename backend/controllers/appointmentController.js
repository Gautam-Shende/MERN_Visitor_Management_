// backend/controllers/appointmentController.js
import * as appointmentService from "../services/appointmentService.js"

export const createAppointment = async (req, res) => {
  try {
    const { visitorId, date } = req.body
    
    if (!visitorId || !date) {
      return res.status(400).json({ 
        success: false,
        message: "Visitor ID and date are required" 
      })
    }
    
    const appointment = await appointmentService.createAppointment(visitorId, date)
    
    res.status(201).json({ 
      success: true,
      message: "Appointment created successfully", 
      data: appointment 
    })

  } catch (err) {
    if (err.message === "Visitor not found") {
      return res.status(404).json({ success: false, message: err.message })
    }
    
    if (err.message === "Invalid date") {
      return res.status(400).json({ success: false, message: err.message })
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Failed to create appointment" 
    })
  }
}

export const approveAppointment = async (req, res) => {
  try {
    const { id } = req.params
    
    if (!id) {
      return res.status(400).json({ 
        success: false,
        message: "Appointment ID is required" 
      })
    }
    
    const appointment = await appointmentService.approveAppointment(id)
    
    if (!appointment) {
      return res.status(404).json({ 
        success: false,
        message: "Appointment not found" 
      })
    }
    
    res.status(200).json({ 
      success: true,
      message: "Appointment approved successfully", 
      data: appointment 
    })
    
  } catch (err) {
    if (err.message === "Appointment not found") {
      return res.status(404).json({ success: false, message: err.message })
    }
    
    if (err.message === "Appointment already processed") {
      return res.status(400).json({ success: false, message: err.message })
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Failed to approve appointment" 
    })
  }
}

export const rejectAppointment = async (req, res) => {
  try {
    const { id } = req.params
    
    if (!id) {
      return res.status(400).json({ 
        success: false,
        message: "Appointment ID is required" 
      })
    }
    
    const appointment = await appointmentService.rejectAppointment(id)
    
    if (!appointment) {
      return res.status(404).json({ 
        success: false,
        message: "Appointment not found" 
      })
    }
    
    res.status(200).json({ 
      success: true,
      message: "Appointment rejected successfully", 
      data: appointment 
    })
    
  } catch (err) {
    if (err.message === "Appointment not found") {
      return res.status(404).json({ success: false, message: err.message })
    }

    if (err.message === "Appointment already processed") {
      return res.status(400).json({ success: false, message: err.message })
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Failed to reject appointment" 
    })
  }
}

export const getAppointments = async (req, res) => {
  try {
    const { status, visitorId, date } = req.query
    
    const appointments = await appointmentService.getAllAppointments({ status, visitorId, date })
    
    res.status(200).json({ 
      success: true,
      count: appointments.length,
      data: appointments 
    })

  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch appointments" 
    })
  }
}

export const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params
    
    if (!id) {
      return res.status(400).json({ 
        success: false,
        message: "Appointment ID is required" 
      })
    }
    
    const appointment = await appointmentService.getAppointmentById(id)
    
    if (!appointment) {
      return res.status(404).json({ 
        success: false,
        message: "Appointment not found" 
      })
    }
    
    res.status(200).json({ 
      success: true,
      data: appointment 
    })

  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid appointment ID format" 
      })
    }
    
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch appointment" 
    })
  }
}