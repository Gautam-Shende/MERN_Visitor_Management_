import * as dashboardService from "../services/dashboardService.js"

export const getDashboardStats = async (req, res) => {
  try {
    const stats = await dashboardService.getDashboardStats()
    res.status(200).json(stats)
  } catch (error) {
    console.log("Dashboard error:", error.message)
    res.status(500).json({ error: "Failed to load dashboard" })
  }
}