
import * as reportService from "../services/reportService.js"

export const getVisitorReport = async (req, res) => {
  try {

    const visitors = await reportService.getVisitorReport(req.query);

    // console.log("visito Report. status code (200) Ok", visitor)
    res.status(200).json(visitors);
 
  } 
  catch (error) {
    // console.log("Report Not Genrating..., Server error (500)")
    res.status(500).json({
      message: error.message || "Report Not genrating...."
    })


  }
}