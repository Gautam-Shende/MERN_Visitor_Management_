import api from "./api"

// Fetch admin dashboard stats
export const fetchDashboardStats = async () => {
  const response = await api.get("/dashboard")
  return response.data
}