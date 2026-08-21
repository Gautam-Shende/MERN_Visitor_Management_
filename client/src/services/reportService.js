import api from "./api"

// Fetch visitor report based on filter parameters
export const fetchVisitorReport = async (params) => {
  const response = await api.get("/reports/visitors", { params })
  return response.data
}