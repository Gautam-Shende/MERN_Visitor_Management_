
import Visitor from "../models/Visitor.js"

import Pass from "../models/Pass.js"
// import User from "../models/User.js"

import CheckLog from "../models/CheckLog.js"
import { Parser } from "json2csv"
import ExcelJS from "exceljs"

const getVisitorsWithLogs = async (visitorId) => {

  // const visitors = await Visitor.findById().populate("host")
  // const visitors = await Visitor.find().populate("host", "name").lean()

  const visitors = await Visitor.find({ _id: visitorId })
  .populate("host", "name")
  .lean();

  const visitorIds = visitors.map((v) => v._id);

  const passes = await Pass.find({ visitor: { $in: visitorIds } }).lean()

  const passIds = passes.map(p => p._id)

  // const logs = await CheckLog.findbyId({ pass: { $in: passIds } })
  const logs = await CheckLog.find({ pass: { $in: passIds } }).lean();

  return visitors.map((v) => {

    const pass = passes.find(p => p.visitor.toString() === v._id.toString())

    let log = null;

    if (pass) {
      log = logs.find((l) => l.pass.toString() === pass._id.toString());
    }

    return {
      name: v.name,
      email: v.email,
      phone: v.phone,
      host: v.host?.name || "-",
      status: v.status,
      checkInTime: log?.checkInTime
        ? new Date(log.checkInTime).toLocaleString()
        : "-",
      checkOutTime: log?.checkOutTime
        ? new Date(log.checkOutTime).toLocaleString()
        : "-"
    }

  })

}

export const exportVisitorsCSV = async (visitorId) => {

  // const visitors = await getVisitorsWithLogs()
  const visitors = await getVisitorsWithLogs(visitorId)

  const fields = [
    { label: "Name", value: "name" },
    { label: "Email", value: "email" },
    { label: "Phone", value: "phone" },
    { label: "Host", value: "host" },
    { label: "Check In", value: "checkInTime" },
    { label: "Check Out", value: "checkOutTime" },
    { label: "Status", value: "status" }
  ];

  const parser = new Parser({ fields });

  const csvData = parser.parse(visitors);

  return {
    csvData,
    fileName: "visitors_report.csv"
  }

}

export const exportVisitorsExcel = async (visitorId) => {

  // const visitors = await getVisitorsWithLogs()
 const visitors = await getVisitorsWithLogs(visitorId)
 
  const workbook = new ExcelJS.Workbook()

  const sheet = workbook.addWorksheet("Visitors");

  sheet.columns = [
    { header: "Name", key: "name", width: 25 },
    { header: "Email", key: "email", width: 30 },
    { header: "Phone", key: "phone", width: 18 },
    { header: "Host", key: "host", width: 20 },
    { header: "Check In", key: "checkInTime", width: 25 },
    { header: "Check Out", key: "checkOutTime", width: 25 },
    { header: "Status", key: "status", width: 15 }
  ];

  // visitors.forEach(v => {
  //   sheet.addRow(v);
  // });
  visitors.forEach((v) => {
    sheet.addRow(v);
  });

  return {
    workbook,
    fileName: "visitors_report.xlsx"
  }

}