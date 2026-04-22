import Visitor from "../../models/Visitor.js"
import Pass from "../../models/Pass.js"
import CheckLog from "../../models/CheckLog.js"
import Appointment from "../../models/Appointment.js"

export const getDashboardStats = async () => {
  const dayStart = new Date()
  dayStart.setHours(0, 0, 0, 0)

  const dayEnd = new Date()
  dayEnd.setHours(23, 59, 59, 999)

  const [
    totalVisitors,
    visitorsToday,
    pendingVisitors,
    approvedVisitors,
    rejectedVisitors
  ] = await Promise.all([
    Visitor.countDocuments(),
    Visitor.countDocuments({ createdAt: { $gte: dayStart, $lte: dayEnd } }),
    Visitor.countDocuments({ status: "pending" }),
    Visitor.countDocuments({ status: "approved" }),
    Visitor.countDocuments({ status: "rejected" })
  ])

  const [activePasses, insidePasses, expiredPasses, totalPasses] = await Promise.all([
    Pass.countDocuments({ status: "active" }),
    Pass.countDocuments({ status: "inside" }),
    Pass.countDocuments({ status: "expired" }),
    Pass.countDocuments()
  ])

  const [totalCheckIns, totalCheckOuts, currentlyInside, todayCheckIns, todayCheckOuts] = await Promise.all([
    CheckLog.countDocuments({ checkInTime: { $ne: null } }),
    CheckLog.countDocuments({ checkOutTime: { $ne: null } }),
    CheckLog.countDocuments({ checkInTime: { $ne: null }, checkOutTime: null }),
    CheckLog.countDocuments({ checkInTime: { $gte: dayStart, $lte: dayEnd } }),
    CheckLog.countDocuments({ checkOutTime: { $gte: dayStart, $lte: dayEnd } })  
  ])

  const [
    pendingAppointments,
    approvedAppointments,
    rejectedAppointments,
    totalAppointments,
    todayAppointments
  ] = await Promise.all([
    Appointment.countDocuments({ status: "pending" }),
    Appointment.countDocuments({ status: "approved" }),
    Appointment.countDocuments({ status: "rejected" }),
    Appointment.countDocuments(),
    Appointment.countDocuments({ createdAt: { $gte: dayStart, $lte: dayEnd } })
  ])

  return {
    visitors: {
      total: totalVisitors,
      today: visitorsToday,
      pending: pendingVisitors,
      approved: approvedVisitors,
      rejected: rejectedVisitors
    },
    passes: {
      active: activePasses,
      inside: insidePasses,
      expired: expiredPasses,
      total: totalPasses
    },
    checkLogs: {
      totalCheckIns,
      totalCheckOuts,
      currentlyInside,
      todayCheckIns,
      todayCheckOuts  
    },
    appointments: {
      pending: pendingAppointments,
      approved: approvedAppointments,
      rejected: rejectedAppointments,
      total: totalAppointments,
      today: todayAppointments
    },
    generatedAt: new Date().toISOString()
  }
}