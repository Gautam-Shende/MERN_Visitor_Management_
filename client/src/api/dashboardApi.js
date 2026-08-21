import apiClient from "./apiClient"

// Fetch admin dashboard stats
export const fetchDashboardStats = async () => {
  const response = await apiClient.get("/dashboard")
  return response.data
}

// Fetch visitor dashboard stats
export const fetchVisitorDashboard = async () => {
  const response = await apiClient.get("/visitor/dashboard")
  return response.data
}
