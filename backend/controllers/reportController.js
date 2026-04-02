import * as reportService from "../services/reportService.js"

export const getVisitorReport = async (req, res) => {
  try {
    const visitors = await reportService.getVisitorReport(req.query)
    res.status(200).json(visitors)
  } catch (error) {
    console.log("Report error:", error.message)
    res.status(500).json({ error: "Failed to generate report" })
  }
}