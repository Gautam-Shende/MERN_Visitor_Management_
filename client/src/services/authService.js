import api from "./api"

// User Login (Admin, Employee, Security)
export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password })
  return response.data
}

// Get current user details
export const getMe = async () => {
  const response = await api.get("/auth/me")
  return response.data
}