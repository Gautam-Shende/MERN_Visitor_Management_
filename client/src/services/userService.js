import api from "./api"

// Fetch all users (employees / admins)
export const fetchUsers = async () => {
  const response = await api.get("/users")
  return response.data
}