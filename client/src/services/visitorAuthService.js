import api from "./api"

// Visitor Login
export const loginVisitor = async (email, password) => {
  const response = await api.post("/visitor/login", { email, password })
  return response.data
}

// Visitor Registration (supports photo file upload)
export const registerVisitor = async (formData) => {
  const response = await api.post("/visitor/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return response.data
}

// Get Visitor Profile
export const getVisitorProfile = async () => {
  const response = await api.get("/visitor/profile")
  return response.data
}

// Fetch visitor dashboard stats
export const fetchVisitorDashboard = async () => {
  const response = await api.get("/visitor/dashboard")
  return response.data
}

// Visitor: Request an appointment
export const requestForAppointment = async (requestData) => {
  const response = await api.post("/visitor/appointments/request", requestData)
  return response.data
}

export const requestforAppointment = requestForAppointment

// Visitor: Get my appointment requests
export const getMyAppointmentRequests = async () => {
  const response = await api.get("/visitor/appointments/requests")
  return response.data
}

// Visitor: Fetch my appointments
export const fetchVisitorAppointments = async () => {
  const response = await api.get("/visitor/appointments")
  return response.data
}

// Visitor: Fetch my passes
export const fetchVisitorPasses = async () => {
  const response = await api.get("/visitor/passes")
  return response.data
}

// Visitor: Fetch pass by appointment ID
export const getVisitorPass = async (appointmentId) => {
  const response = await api.get(`/visitor/pass/${appointmentId}`)
  return response.data
}