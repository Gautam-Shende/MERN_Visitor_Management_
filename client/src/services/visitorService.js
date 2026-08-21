import api from "./api"

// Fetch all visitors
export const fetchVisitors = async () => {
  const response = await api.get("/visitors")
  return response.data
}

// Fetch single visitor by ID
export const fetchVisitorById = async (id) => {
  const response = await api.get(`/visitors/${id}`)
  return response.data
}

// Fetch recent visitors with limit
export const fetchRecentVisitors = async (limit = 5) => {
  try {
    const response = await api.get(`/visitors?limit=${limit}&sort=-createdAt`)
    return response.data
  } catch (error) {
    const allVisitors = await fetchVisitors()
    return allVisitors
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit)
  }
}