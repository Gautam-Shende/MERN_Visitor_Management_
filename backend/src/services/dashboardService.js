
import Visitor from "../models/Visitor.js"
import Pass from "../models/Pass.js"

// import User from "../models/User.js"
import CheckLog from "../models/CheckLog.js"
import Appointment from "../models/Appointment.js"

export const getDashboardStats = async () => {
  console.log("Starting dashboard stats calculation...")

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const todayEnd = new Date()
  todayEnd.setHours(23, 59, 59, 999)

  // console.log("Date range:", todayStart, "to", todayEnd)

  //
  // console.log("Fetching visitor stats...")

  const totalVisitorsPromise = Visitor.countDocuments()
  const visitorsTodayPromise = Visitor.countDocuments({
    createdAt: { $gte: todayStart, $lte: todayEnd }
  })
  const pendingVisitorsPromise = 
  Visitor.countDocuments({ status: "pending" })

  const approvedVisitorsPromise = 
  Visitor.countDocuments({ status: "approved" })

  const rejectedVisitorsPromise =
   Visitor.countDocuments({ status: "rejected" })

  const [    totalVisitors,
    visitorsToday,    pendingVisitors,    approvedVisitors,
    rejectedVisitors
  ] = await Promise.all([
    totalVisitorsPromise,   visitorsTodayPromise,   pendingVisitorsPromise,   approvedVisitorsPromise,
    rejectedVisitorsPromise
  ])

  // console.log("Visitor stats done")

  // console.log("Fetching pass stats...")

  const activePassesPromise = Pass.countDocuments({ status: "active" })
  const insidePassesPromise = Pass.countDocuments({ status: "inside" })
  const expiredPassesPromise = Pass.countDocuments({ status: "expired" })
  const totalPassesPromise = Pass.countDocuments()

  const [
    activePasses,insidePasses,  expiredPasses,
    totalPasses
  ] = await Promise.all([
    activePassesPromise,insidePassesPromise,expiredPassesPromise,
    totalPassesPromise
  ])

  // console.log("Pass stats done")

  //  
  // console.log("Fetching check log stats...")

  const totalCheckInsPromise = CheckLog.countDocuments({
    checkInTime: { $ne: null }
  })

  const totalCheckOutsPromise = CheckLog.countDocuments({
    checkOutTime: { $ne: null }
  })

  const currentlyInsidePromise = CheckLog.countDocuments({
    checkInTime: { $ne: null },
    checkOutTime: null
  })

  const todayCheckInsPromise = CheckLog.countDocuments({
    checkInTime: { $gte: todayStart, $lte: todayEnd }
  })

  const [
    totalCheckIns,
    totalCheckOuts,
    currentlyInside,
    todayCheckIns
  ] = await Promise.all([totalCheckInsPromise,totalCheckOutsPromise,currentlyInsidePromise,todayCheckInsPromise
  ])

  // console.log("Check log stats done")

  //   
  // console.log("Fetching appointment stats...")

  const pendingAppointmentsPromise = Appointment.countDocuments({ status: "pending" })
 
  const approvedAppointmentsPromise = Appointment.countDocuments({ status: "approved" })
  const rejectedAppointmentsPromise = Appointment.countDocuments({ status: "rejected" })
  const totalAppointmentsPromise = Appointment.countDocuments()
  const todayAppointmentsPromise = Appointment.countDocuments({
    createdAt: { $gte: todayStart, $lte: todayEnd }
  })

  const [
    pendingAppointments,approvedAppointments,rejectedAppointments,totalAppointments,
    todayAppointments
  ] = await Promise.all([
    pendingAppointmentsPromise,approvedAppointmentsPromise,rejectedAppointmentsPromise,totalAppointmentsPromise,
    todayAppointmentsPromise
  ])

  // console.log("Appointment stats done")

  // console.log("Preparing final response...")

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
      totalCheckIns, totalCheckOuts, currentlyInside,todayCheckIns
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