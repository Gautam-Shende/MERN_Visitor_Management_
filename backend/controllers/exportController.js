import * as exportService from "../services/exportService.js"

export const exportVisitorsCSV = async (req, res) => {
  try {
    const { csvData, fileName } = await exportService.exportVisitorsCSV()
    res.setHeader("Content-Type", "text/csv")
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`)
    res.send(csvData)
  } catch (error) {
    console.log("CSV export error:", error.message)
    res.status(500).json({ error: "Failed to export CSV" })
  }
}

export const exportVisitorsExcel = async (req, res) => {
  try {
    const { workbook, fileName } = await exportService.exportVisitorsExcel()
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`)
    await workbook.xlsx.write(res)
    res.end()
  } catch (error) {
    console.log("Excel export error:", error.message)
    res.status(500).json({ error: "Failed to export Excel" })
  }
}