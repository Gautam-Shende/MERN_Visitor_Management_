import * as dashboardService from "../../services/admin/adminDashboardService.js"
import { HTTP_STATUS, MESSAGES } from "../../../constants.js"

export const getDashboardStats = async (req, res) => {
  try {
    const stats = await dashboardService.getDashboardStats()
    return res.status(HTTP_STATUS.OK).json(stats)
  } catch (err) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.DASHBOARD_ERROR })
  }
}
