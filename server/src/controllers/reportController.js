import Visitor from "../models/Visitor.js"
import Appointment from "../models/Appointment.js"
import Pass from "../models/Pass.js"
import CheckLog from "../models/CheckLog.js"
import { Parser } from "json2csv"
import ExcelJS from "exceljs"
import { HTTP_STATUS } from "../constants.js"

// Get visitor report data based on filters
export const getVisitorReport = async (req, res, next) => {
  try {
    const { name, phone, status, type } = req.query
    const visitorQuery = {}

    if (name && name.trim()) {
      visitorQuery.name = { $regex: name, $options: "i" }
    }

    if (phone && phone.trim()) {
      visitorQuery.phone = phone
    }

    const visitors = await Visitor.find(visitorQuery).lean()
    if (!visitors.length) {
      return res.status(HTTP_STATUS.OK).json([])
    }

    const visitorIds = visitors.map((v) => v._id)
    const appointmentFilter = { visitor: { $in: visitorIds } }

    if (status && status !== "all" && status !== "checkin" && status !== "checkout") {
      appointmentFilter.status = status
    }

    const appointments = await Appointment.find(appointmentFilter)
      .populate("visitor")
      .populate("host", "name email")
      .sort({ createdAt: -1 })
      .lean()

    if (!appointments.length && status !== "all" && status !== "checkin" && status !== "checkout") {
      return res.status(HTTP_STATUS.OK).json([])
    }

    let filteredVisitorIds = []
    if (status === "checkin" || status === "checkout") {
      filteredVisitorIds = visitorIds
    } else if (status && status !== "all") {
      filteredVisitorIds = [...new Set(appointments.map((a) => a.visitor._id.toString()))]
    } else {
      filteredVisitorIds = visitorIds
    }

    const passes = await Pass.find({ visitor: { $in: filteredVisitorIds } }).lean()
    const passIds = passes.map((p) => p._id)
    const logs = await CheckLog.find({ pass: { $in: passIds } }).sort({ checkInTime: -1 }).lean()

    let report = filteredVisitorIds
      .map((visitorId) => {
        const visitor = visitors.find((v) => v._id.toString() === visitorId.toString())
        if (!visitor) return null

        const visitorAppointments = appointments.filter((a) => a.visitor._id.toString() === visitorId.toString())
        const latestAppointment = visitorAppointments.length > 0 ? visitorAppointments[0] : null

        const visitorPasses = passes.filter((p) => p.visitor.toString() === visitorId.toString())
        let checkInTime = null
        let checkOutTime = null

        for (const pass of visitorPasses) {
          const passLogs = logs.filter((l) => l.pass.toString() === pass._id.toString())
          if (passLogs.length > 0) {
            const latestLog = passLogs[0]
            if (latestLog.checkInTime) checkInTime = latestLog.checkInTime
            if (latestLog.checkOutTime) checkOutTime = latestLog.checkOutTime
          }
        }

        return {
          ...visitor,
          appointmentStatus: latestAppointment?.status || "no_appointment",
          appointmentDate: latestAppointment?.date || null,
          host: latestAppointment?.host || null,
          checkInTime,
          checkOutTime,
        }
      })
      .filter((v) => v !== null)

    if (type === "checkin") {
      report = report.filter((r) => r.checkInTime !== null)
    } else if (type === "checkout") {
      report = report.filter((r) => r.checkOutTime !== null)
    }

    return res.status(HTTP_STATUS.OK).json(report)
  } catch (error) {
    next(error)
  }
}

// Helper to build visitor row data for exports
const buildVisitorExportRows = async (visitorId) => {
  const visitors = await Visitor.find({ _id: visitorId })
    .populate("host", "name")
    .lean()
  const ids = visitors.map((v) => v._id)

  const passes = await Pass.find({ visitor: { $in: ids } }).lean()
  const logs = await CheckLog.find({ pass: { $in: passes.map((p) => p._id) } }).lean()

  return visitors.map((v) => {
    const pass = passes.find((p) => p.visitor.toString() === v._id.toString())
    const log = pass ? logs.find((l) => l.pass.toString() === pass._id.toString()) : null

    return {
      name: v.name,
      email: v.email,
      phone: v.phone,
      host: v.host?.name || "-",
      status: v.status,
      checkInTime: log?.checkInTime ? new Date(log.checkInTime).toLocaleString() : "-",
      checkOutTime: log?.checkOutTime ? new Date(log.checkOutTime).toLocaleString() : "-",
    }
  })
}

// Export visitors CSV
export const exportVisitorsCSV = async (req, res, next) => {
  try {
    const { visitorId } = req.params
    const rows = await buildVisitorExportRows(visitorId)

    const fields = [
      { label: "Name", value: "name" },
      { label: "Email", value: "email" },
      { label: "Phone", value: "phone" },
      { label: "Host", value: "host" },
      { label: "Check In", value: "checkInTime" },
      { label: "Check Out", value: "checkOutTime" },
      { label: "Status", value: "status" },
    ]

    const csv = new Parser({ fields }).parse(rows)

    res.header("Content-Type", "text/csv")
    res.attachment("visitors_report.csv")
    return res.send(csv)
  } catch (error) {
    next(error)
  }
}

// Export visitors Excel
export const exportVisitorsExcel = async (req, res, next) => {
  try {
    const { visitorId } = req.params
    const rows = await buildVisitorExportRows(visitorId)

    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet("Visitors")

    sheet.columns = [
      { header: "Name", key: "name", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Phone", key: "phone", width: 18 },
      { header: "Host", key: "host", width: 20 },
      { header: "Check In", key: "checkInTime", width: 25 },
      { header: "Check Out", key: "checkOutTime", width: 25 },
      { header: "Status", key: "status", width: 15 },
    ]

    rows.forEach((row) => sheet.addRow(row))

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    res.setHeader("Content-Disposition", "attachment; filename=visitors_report.xlsx")

    await workbook.xlsx.write(res)
    return res.end()
  } catch (error) {
    next(error)
  }
}
