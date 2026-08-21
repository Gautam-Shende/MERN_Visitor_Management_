import Visitor from "../models/Visitor.js"
import Pass from "../models/Pass.js"
import CheckLog from "../models/CheckLog.js"
import Appointment from "../models/Appointment.js"
import { HTTP_STATUS } from "../constants.js"

// Get admin dashboard statistics
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalVisitors = await Visitor.countDocuments()

    const pendingVisitors = await Visitor.countDocuments({ status: "pending" })
    const approvedVisitors = await Visitor.countDocuments({ status: "approved" })
    const rejectedVisitors = await Visitor.countDocuments({ status: "rejected" })

    const totalPasses = await Pass.countDocuments()
    const activePasses = await Pass.countDocuments({ status: "active" })
    const insidePasses = await Pass.countDocuments({ status: "inside" })
    const expiredPasses = await Pass.countDocuments({ status: "expired" })

    const totalCheckIns = await CheckLog.countDocuments({ checkInTime: { $ne: null } })
    const totalCheckOuts = await CheckLog.countDocuments({ checkOutTime: { $ne: null } })

    const totalAppointments = await Appointment.countDocuments()
    const requestedAppointments = await Appointment.countDocuments({ status: "requested" })
    const pendingAppointments = await Appointment.countDocuments({ status: "pending" })
    const approvedAppointments = await Appointment.countDocuments({ status: "approved" })

    return res.status(HTTP_STATUS.OK).json({
      totalVisitors,
      pendingVisitors,
      approvedVisitors,
      rejectedVisitors,

      totalPasses,
      activePasses,
      insidePasses,
      expiredPasses,

      totalCheckIns,
      totalCheckOuts,

      totalAppointments,
      requestedAppointments,
      pendingAppointments,
      approvedAppointments,
    })
  } catch (error) {
    next(error)
  }
}

// Get visitor dashboard statistics
export const getVisitorDashboard = async (req, res, next) => {
  try {
    const visitorId = req.visitor._id
    const appointments = await Appointment.find({ visitor: visitorId })
    const passes = await Pass.find({ visitor: visitorId })

    return res.status(HTTP_STATUS.OK).json({
      totalAppointments: appointments.length,
      requested: appointments.filter((a) => a.status === "requested").length,
      pending: appointments.filter((a) => a.status === "pending").length,
      approved: appointments.filter((a) => a.status === "approved").length,
      rejected: appointments.filter((a) => a.status === "rejected").length,

      totalPasses: passes.length,
      passGenerated: passes.length,
      activePasses: passes.filter((p) => p.status === "active" || p.status === "approved").length,
      expiredPasses: passes.filter((p) => p.status === "expired" || p.status === "completed").length,
      insidePasses: passes.filter((p) => p.status === "inside" || p.isCheckedIn === true).length,
    })
  } catch (error) {
    next(error)
  }
}
