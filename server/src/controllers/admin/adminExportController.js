
import * as exportService from "../../services/admin/adminExportService.js"
import { HTTP_STATUS, MESSAGES } from "../../../constants.js"

// Export Visitors CSV Controller
export const exportVisitorsCSV = async (req, res) => {
  try {
    const { visitorId } = req.params
    const { csvData, fileName } = await exportService.exportVisitorsCSV(visitorId)

    res.setHeader("Content-Type", "text/csv")
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`)
    return res.send(csvData)
  } catch (err) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.EXPORT_ERROR })
  }
}

// Export Visitors Excel Controller
export const exportVisitorsExcel = async (req, res) => {
  try {
    const { visitorId } = req.params
    const { workbook, fileName } = await exportService.exportVisitorsExcel(visitorId)

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`)

    await workbook.xlsx.write(res)
    return res.end()
  } catch (err) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.EXPORT_ERROR })
  }
}

