import * as dashboardService from "../services/dashboardService.js"

export const getDashboardStats = async (req, res) => {
  try {
    const stats = await dashboardService.getDashboardStats();
    
    // console.log("Dashboard.., status (200) Ok", status)
    res.status(200).json(stats);

  } 
  catch (err) {
    // console.error("getDashboardStats error:", err.message);
    res.status(500).json({ message: "Dashboard is Not Loading" });
  }
}