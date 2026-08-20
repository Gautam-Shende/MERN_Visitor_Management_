
import Visitor from "../../models/Visitor.js"
import Pass from "../../models/Pass.js"
import CheckLog from "../../models/CheckLog.js"
import { Parser } from "json2csv"
import ExcelJS from "exceljs"

// Build data rows for visitor export
const buildVisitorRows = async (visitorId) => {
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

// Generate CSV export data
export const exportVisitorsCSV = async (visitorId) => {
  const rows = await buildVisitorRows(visitorId)

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
  return { csvData: csv, fileName: "visitors_report.csv" }
}

// Generate Excel export workbook
export const exportVisitorsExcel = async (visitorId) => {
  const rows = await buildVisitorRows(visitorId)

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

  return { workbook, fileName: "visitors_report.xlsx" }
}

