import * as appointmentService from "../services/appointmentService.js"

export const createAppointment = async (req, res) => {
  try {
    const { visitorId, date } = req.body
    
    if (!visitorId || !date) {
      // console.log("Missing required fields:", { visitorId, date })
      return res.status(400).json({ message: "Visitor ID and date are required" })
    }
    
    const appointment = await appointmentService.createAppointment(visitorId, date)
    // console.log("Appointment created successfully:", appointment._id)
    
    res.status(201).json({ 
      message: "Appointment created successfully", 
      appointment 
    })

  } catch (err) {
    // console.error("Error in createAppointment:", err)
    
    if (err.message === "Visitor not found") {

      // console.log('Visitor not found', err.message)
      return res.status(404).json({ message: err.message })
    }

    if (err.message === "Invalid date") {
      
      // console.log("Invalid date....400", err.message)
      return res.status(400).json({ message: err.message })
    }
    
    res.status(500).json({ message: err.message || "Server error" })
  }
}

export const approveAppointment = async (req, res) => {
  try {
    const { id } = req.params
    
    if (!id) {
     
      // console.log("No appointment ID provided")
      return res.status(400).json({ message: "Appointment ID is required" })
    }
    
    const appointment = await appointmentService.approveAppointment(id)
    
    if (!appointment) {
    
      // console.log("Appointment not found for approval:", id)
      return res.status(404).json({ message: "Appointment not found" })
    }
    
    // console.log("Appointment approved successfully:", id)
   
    res.status(200).json({ 
      message: "Appointment approved successfully", 
      appointment 
    })
  } catch (err) {
    // console.error("Error in approveAppointment:", err)
    
    if (err.message === "Appointment not found") {
     
      // console.log("Appointment not found....404 status", err.message)
      return res.status(404).json({ message: err.message })
    }
    
    
    if (err.message === "Appointment already processed") {
      
      // console.log("Appointment already process...404",err.message)
      return res.status(404).json({ message: err.message })
    }
    
    res.status(500).json({ message: err.message || "Approval failed" })
  }
}

export const rejectAppointment = async (req, res) => {
  try {
    const { id } = req.params
    
    if (!id) {
      
      // console.log("No appointment ID provided")
      return res.status(400).json({ message: "Appointment ID is required" })
    }
    
    // const appointment = appointmentService.rejectAppointment.findById(Appointment._id)
    const appointment = await appointmentService.rejectAppointment(id)
    
    if (!appointment) {
     
      // console.log("Appointment not found for rejection:", id)
      return res.status(404).json({ message: "Appointment not found" })
    }
    
    // console.log("Appointment rejected successfully:", id)
    res.status(200).json({ 
      message: "Appointment rejected successfully", 
      appointment 
    })
  } catch (err) {
    // console.error("Error in rejectAppointment:", err)
    
    if (err.message === "Appointment not found") {
      
      // console.log("Error 404 Not found...",err.message)
      return res.status(404).json({ message: err.message })
    }

    if (err.message === "Appointment already processed") {
        
      // console.log("Error 404 Not found...",err.message)
      return res.status(401).json({ message: err.message })
    }
    
    res.status(500).json({ message: err.message || "Rejection failed" })
  }
}

export const getAppointments = async (req, res) => {
  try {

    const { status, visitorId, date } = req.query
    
    let data
    if (status || visitorId || date) {
      data = await appointmentService.getAllAppointments()
     
      // console.log("Fetching appointments with filters:", { status, visitorId, date })
    } else {
      data = await appointmentService.getAllAppointments()
    }
    
    if (!data || data.length === 0) {
      
      // console.log("No appointments found")
      return res.status(200).json({ message: "No appointments found", appointments: [] })
    }
    
    // console.log(`Fetched ${data.length} appointments`)
    res.status(200).json(data)

  } catch (err) {
   
    // console.error("Error in getAppointments:", err)
    res.status(500).json({ message: err.message || "Failed to fetch appointments" })
  }
}

export const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params
    
    if (!id) {
      
      // console.log("No appointment ID provided")
      return res.status(400).json({ message: "Appointment ID is required" })
    }
    
    const appointment = await appointmentService.getAppointmentById(id)
    
    if (!appointment) {
      
      // console.log("Appointment not found with ID:", id)
      return res.status(404).json({ message: "Appointment not found" })
    }
    
    // console.log("Appointment found:", appointment._id)
    res.status(200).json(appointment)

  } catch (err) {
    // console.error("Error in getAppointmentById:", err)
    
    if (err.message === "Appointment not found") {
      
      // console.log("Appointment not found...404", err.message)
      return res.status(404).json({ message: err.message })
    }
    if (err.name === "CastError") {

      // console.log("Invalid Id...400")
      return res.status(400).json({ message: "Invalid appointment ID format" })
    }
    
    res.status(500).json({ message: err.message || "Failed to fetch appointment" })
  }
}