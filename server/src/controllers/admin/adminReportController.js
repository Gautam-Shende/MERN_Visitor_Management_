import * as reportService from "../../services/admin/adminReportService.js"
import { HTTP_STATUS, MESSAGES } from "../../../constants.js"


export const getVisitorReport = async (req, res) => {
  try {
    const report = await reportService.getVisitorReport(req.query)
    return res.status(HTTP_STATUS.OK).json(report)
  } catch (err) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.REPORT_ERROR })
  }
}
