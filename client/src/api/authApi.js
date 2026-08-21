import apiClient from "./apiClient"

// User Login (Admin, Employee, Security)
export const login = async (email, password) => {
  const response = await apiClient.post("/auth/login", { email, password })
  return response.data
}

// Get current user details
export const getMe = async () => {
  const response = await apiClient.get("/auth/me")
  return response.data
}

// Visitor Login
export const loginVisitor = async (email, password) => {
  const response = await apiClient.post("/visitor/login", { email, password })
  return response.data
}

// Visitor Registration (supports photo file upload)
export const registerVisitor = async (formData) => {
  const response = await apiClient.post("/visitor/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return response.data
}

// Get Visitor Profile
export const getVisitorProfile = async () => {
  const response = await apiClient.get("/visitor/profile")
  return response.data
}

// Fetch all users (employees / admins)
export const fetchUsers = async () => {
  const response = await apiClient.get("/users")
  return response.data
}
