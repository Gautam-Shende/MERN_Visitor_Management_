
import * as visitorAppointmentService from "../services/visitorAppointmentService.js"

export const getMyAppointments = async (req, res) => {
  try {
    const visitorId = req.visitor?._id
    
    if (!visitorId) {
     
      // console.log("Get appointments attempt - no visitor ID in request")
      return res.status(401).json({ 
        message: "Unauthorized. Please log in again" 
      })
      // console.log("Error: Missing visitor ID")
    }
    
    // console.log("Fetching appointments for visitor ID:", visitorId)
    
    
    const appointments = await visitorAppointmentService.getVisitorAppointmentsService(visitorId)
    
    if (!appointments) {
      // console.log("No appointments found for visitor:", visitorId)
      return res.status(200).json({ 
        message: "No appointments found", 
        appointments: [] 
      })
      // console.log("Info: No appointments available")
    }
    
    if (appointments.length === 0) {
     
      // console.log("Visitor has no appointments:", visitorId)
      return res.status(200).json({ 
        message: "No appointments booked yet",
        appointments: [] 
      })
      // console.log("Info: Empty appointments list")
    }
    
    // console.log(`Fetched ${appointments.length} appointments for visitor`)
   
   
    res.status(200).json(appointments)
    // console.log("Appointments response sent successfully for visitor:", visitorId)
  
  } catch (error) {
    // console.error("Error in getMyAppointments controller:", error)
    
    if (error.message === "Visitor not found") {
      return res.status(404).json({ 
        message: "Visitor profile not found" 
      })
      // console.log("Error: Visitor not found")
    }
    
    if (error.message === "Invalid visitor ID") {
      return res.status(400).json({ 
        message: "Invalid visitor ID format" 
      })
      // console.log("Error: Invalid visitor ID")
    }
    
    res.status(500).json({ 
      message: error.message || "Failed to fetch appointments" 
    })
    // console.log("Error: Server error while fetching appointments", error)
  }
}

export const getVisitorDashboard = async (req, res) => {
  try {
    const visitorId = req.visitor?._id
    
    if (!visitorId) {
      // console.log("Get dashboard attempt - no visitor ID in request")
      
      return res.status(401).json({ 
        message: "Unauthorized. Please log in again" 
      })
      // console.log("Error: Missing visitor ID")
    }
    
    // console.log("Fetching dashboard stats for visitor ID:", visitorId)
    
    const stats = await visitorAppointmentService.getVisitorDashboardService(visitorId)
    
    if (!stats) {
     
      // console.log("No dashboard data found for visitor:", visitorId)
      return res.status(404).json({ 
        message: "Dashboard data not available" 
      })
      // console.log("Error: Dashboard data not found")
    }
    
    // console.log("Dashboard stats fetched successfully for visitor:", visitorId)
    
    
    res.status(200).json(stats)
    // console.log("Dashboard response sent successfully")
  
  } 
  catch (error) {
    // console.error("Error in getVisitorDashboard controller:", error)
    
    if (error.message === "Visitor not found") {
    
      return res.status(404).json({ 
        message: "Visitor profile not found" 
      })
      // console.log("Error: Visitor not found")
    }
    
    if (error.message === "No data available") {
    
      return res.status(200).json({ 
        message: "No dashboard data available yet",
        stats: {
          totalAppointments: 0,
          upcomingAppointments: 0,
          completedVisits: 0,
          activePasses: 0
        }
      })
      // console.log("Info: No dashboard data available")
    }
    
    res.status(500).json({ 
      message: error.message || "Failed to fetch dashboard statistics" 
    })
    // console.log("Error: Server error while fetching dashboard", error)
  }
}

export const getMyPasses = async (req, res) => {
  try {
    const visitorId = req.visitor?._id
    
    if (!visitorId) {
      
      // console.log("Get passes attempt - no visitor ID in request")
      return res.status(401).json({ 
        message: "Unauthorized. Please log in again" 
      })
      // console.log("Error: Missing visitor ID")
    }
    
    // console.log("Fetching passes for visitor ID:", visitorId)
    
    
    const passes = await visitorAppointmentService.getVisitorPassesService(visitorId)
    
    if (!passes) {
      // console.log("No passes found for visitor:", visitorId)
      
      return res.status(200).json({ 
        message: "No passes found", 
        passes: [] 
      })
      // console.log("Info: No passes available")
    }
    
    if (passes.length === 0) {
      
      // console.log("Visitor has no passes:", visitorId)
      return res.status(200).json({ 
        message: "No active or past passes",
        passes: [] 
      })
      // console.log("Info: Empty passes list")
    }
    
    // console.log(`Fetched ${passes.length} passes for visitor`)
    
    
    res.status(200).json(passes)
    // console.log("Passes response sent successfully for visitor:", visitorId)
  }
   catch (error) {
    // console.error("Error in getMyPasses controller:", error)
    
    if (error.message === "Visitor not found") {
      return res.status(404).json({ 
        message: "Visitor profile not found" 
      })
      // console.log("Error: Visitor not found")
    }
    
    res.status(500).json({ 
      message: error.message || "Failed to fetch passes" 
    })
    // console.log("Error: Server error while fetching passes", error)
  }
}

export const getPassByAppointment = async (req, res) => {
  try {
    const visitorId = req.visitor?._id
    const { appointmentId } = req.params
    
    if (!visitorId) {
      // console.log("Get pass by appointment attempt - no visitor ID in request")
      return res.status(401).json({ 
        message: "Unauthorized. Please log in again" 
      })
      // console.log("Error: Missing visitor ID")
    }
    
    if (!appointmentId) {
      // console.log("Get pass by appointment attempt missing appointment ID")
      return res.status(400).json({ 
        message: "Appointment ID is required" 
      })
      // console.log("Error: Missing appointment ID")
    }
    
    // console.log("Fetching pass for appointment ID:", appointmentId, "visitor:", visitorId)
    const pass = await visitorAppointmentService.getVisitorPassByAppointmentService(
      visitorId,
      appointmentId
    )
    
    if (!pass) {
     
      // console.log("No pass found for appointment:", appointmentId)
      return res.status(404).json({ 
        message: "No pass found for this appointment" 
      })
      // console.log("Error: Pass not found for appointment")
    }
    
    // console.log("Pass found for appointment:", appointmentId)
    
    res.status(200).json(pass)
    // console.log("Pass response sent successfully for appointment:", appointmentId)
  } 
  
  catch (error) {
    // console.error("Error in getPassByAppointment controller:", error)
    
    if (error.message === "Visitor not found") {
      return res.status(404).json({ 
        message: "Visitor profile not found" 
      })
      // console.log("Error: Visitor not found")
    }
    
    if (error.message === "Appointment not found") {
      return res.status(404).json({ 
        message: "Appointment not found" 
      })
      // console.log("Error: Appointment not found")
    }
    
    if (error.message === "Unauthorized access to this appointment") {
      
      return res.status(403).json({ 
        message: "You are not authorized to view this pass",
        unauthorized: true
      })
      
      // console.log("Error: Unauthorized access attempt")
    }
    
    if (error.message === "Pass not generated for this appointment") {
      return res.status(404).json({ 
        message: "Pass has not been generated yet for this appointment",
        notGenerated: true
      })
      // console.log("Error: Pass not generated")
    }
    
    if (error.message === "Invalid appointment ID") {
     
      return res.status(400).json({ 
        message: "Invalid appointment ID format" 
      })
      // console.log("Error: Invalid appointment ID format")
    }
    
    if (error.name === "CastError") {
    
      return res.status(400).json({ 
        message: "Invalid appointment ID format" 
      })
      // console.log("Error: Cast error in appointment ID")
    }
    
    res.status(500).json({ 
      message: error.message || "Failed to fetch pass" 
    })
    // console.log("Error: Server error while fetching pass by appointment", error)
  }
}