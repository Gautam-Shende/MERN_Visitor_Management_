import Visitor from "../../models/Visitor.js"
import Appointment from "../../models/Appointment.js"
import Pass from "../../models/Pass.js"
import CheckLog from "../../models/CheckLog.js"

export const getVisitorReport = async (filters) => {
  const { name, phone, status, type } = filters
  const visitorQuery = {}
  const appointmentQuery = {}

  // Name filter
  if (name && name.trim()) {
    visitorQuery.name = { $regex: name, $options: "i" }
  }
  
  // Phone filter
  if (phone && phone.trim()) {
    visitorQuery.phone = phone
  }

  // Get all visitors first
  let visitors = await Visitor.find(visitorQuery).lean()
  
  if (!visitors.length) {
    return []
  }

  const visitorIds = visitors.map(v => v._id)

  // 🔥 Get appointments with status filter
  let appointmentFilter = { visitor: { $in: visitorIds } }
  
  // Apply appointment status filter (rejected/pending/approved)
  if (status && status !== 'all' && status !== 'checkin' && status !== 'checkout') {
    appointmentFilter.status = status
  }

  let appointments = await Appointment.find(appointmentFilter)
    .populate("visitor")
    .populate("host", "name email")
    .sort({ createdAt: -1 })
    .lean()

  // If no appointments found
  if (!appointments.length && status !== 'all' && status !== 'checkin' && status !== 'checkout') {
    return []
  }

  // Get unique visitor IDs from appointments
  let filteredVisitorIds = []
  if (status === 'checkin' || status === 'checkout') {
    // For checkin/checkout, we need all visitors initially
    filteredVisitorIds = visitorIds
  } else if (status && status !== 'all') {
    // For rejected/pending/approved, filter by appointment status
    filteredVisitorIds = [...new Set(appointments.map(a => a.visitor._id.toString()))]
  } else {
    // For 'all', include all visitors
    filteredVisitorIds = visitorIds
  }

  // Get passes and check logs for these visitors
  const passes = await Pass.find({ visitor: { $in: filteredVisitorIds } }).lean()
  const passIds = passes.map(p => p._id)
  const logs = await CheckLog.find({ pass: { $in: passIds } }).sort({ checkInTime: -1 }).lean()

  // Build final report
  let report = filteredVisitorIds.map(visitorId => {
    const visitor = visitors.find(v => v._id.toString() === visitorId.toString())
    if (!visitor) return null

    // Get visitor's appointments
    const visitorAppointments = appointments.filter(a => a.visitor._id.toString() === visitorId.toString())
    const latestAppointment = visitorAppointments.length > 0 ? visitorAppointments[0] : null

    // Get check-in/out status
    const visitorPasses = passes.filter(p => p.visitor.toString() === visitorId.toString())
    let checkInTime = null
    let checkOutTime = null
    
    for (const pass of visitorPasses) {
      const passLogs = logs.filter(l => l.pass.toString() === pass._id.toString())
      if (passLogs.length > 0) {
        const latestLog = passLogs[0]
        if (latestLog.checkInTime) checkInTime = latestLog.checkInTime
        if (latestLog.checkOutTime) checkOutTime = latestLog.checkOutTime
      }
    }

    return {
      ...visitor,
      appointmentStatus: latestAppointment?.status || 'no_appointment',
      appointmentDate: latestAppointment?.date || null,
      host: latestAppointment?.host || null,
      checkInTime: checkInTime,
      checkOutTime: checkOutTime
    }
  }).filter(v => v !== null)

  // 🔥 Apply checkin/checkout filter
  if (type === 'checkin') {
    report = report.filter(r => r.checkInTime !== null)
  } else if (type === 'checkout') {
    report = report.filter(r => r.checkOutTime !== null)
  }

  return report
}