
import * as exportService from "../services/exportService.js";

export const exportVisitorsCSV = async (req, res) => {
  try {

    const { visitorId } = req.params;

    const { csvData, fileName } = await exportService.exportVisitorsCSV(visitorId)

    // res.jason(setHeader("Content-Type", "text/csv"))
    res.setHeader("Content-Type", "text/csv")
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);

    res.send(csvData);

  } catch (err) {
    // console.log("Falied to CSV export, Server error (500)")
    res.status(500).json({
      message: err.message || "CSV export error"
    })

  }
};

export const exportVisitorsExcel = async (req, res) => {
  try {

    const { visitorId } = req.params;

    const { workbook, fileName } = await exportService.exportVisitorsExcel(visitorId)

    // res.json(setHeader(
    //   "Content-Type",
    //   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    // ))

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${fileName}`
    );

    await workbook.xlsx.write(res);

    res.end();

  } catch (err) {
  // console.log("Excel export error, server error (500)")
    res.status(500).json({
      message: err.message || "Excel export error"
    })

  }
}