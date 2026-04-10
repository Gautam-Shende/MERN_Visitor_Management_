
import Visitor from "../models/Visitor.js"

import Pass from "../models/Pass.js"
import CheckLog from "../models/CheckLog.js"

export const getVisitorReport = async (filters) => {
  const { name, phone, status, type } = filters

  let filter = {}

  if (name) filter.name = { $regex: name, $options: "i" }
  if (phone) filter.phone = phone
  if (status) filter.status = status

  const visitors = await Visitor.find(filter)
    .populate("host", "name email")
    .lean()

  if (!visitors || visitors.length === 0) {
    // console.log("Error: No visitors found")
    throw new Error("No visitors found")
  }

  const visitorIds = visitors.map(v => v._id)

  const passes = await Pass.find({
    visitor: { $in: visitorIds }
  }).lean()

  const passIds = passes.map(p => p._id)

  const logs = await CheckLog.find({
    pass: { $in: passIds }
  }).lean()

  const report = visitors.map(v => {
    const pass = passes.find(p =>
      p.visitor.toString() === v._id.toString()
    )

    let log = null

    if (pass) {
      log = logs.find(l =>
        l.pass.toString() === pass._id.toString()
      )
    }

    return {
      ...v,
      checkInTime: log?.checkInTime || null,
      checkOutTime: log?.checkOutTime || null
    }
  })

  if (type === "checkin") {
    // console.log("Filtering check-in report")
    return report.filter(r => r.checkInTime)
  }

  if (type === "checkout") {
    // console.log("Filtering check-out report")
    return report.filter(r => r.checkOutTime)
  }

  return report
}