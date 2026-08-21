import apiClient from "./apiClient"

// Fetch all appointments (Admin / Employee)
export const fetchAppointments = async () => {
  const response = await apiClient.get("/appointments")
  return response.data
}

// Fetch appointment by ID
export const fetchAppointmentById = async (id) => {
  const response = await apiClient.get(`/appointments/${id}`)
  return response.data
}

// Approve appointment
export const approveAppointment = async (id) => {
  const response = await apiClient.put(`/appointments/approve/${id}`)
  return response.data
}

// Reject appointment
export const rejectAppointment = async (id) => {
  const response = await apiClient.put(`/appointments/reject/${id}`)
  return response.data
}

// Fetch requested appointments (pending schedule approval)
export const fetchPendingRequests = async () => {
  const response = await apiClient.get("/appointments/requested")
  return response.data
}

// Convert visitor request into a scheduled appointment
export const convertRequestToAppointment = async (requestId, data) => {
  const response = await apiClient.put(`/appointments/${requestId}/convert`, data)
  return response.data
}

// Visitor: Request an appointment
export const requestForAppointment = async (requestData) => {
  const response = await apiClient.post("/visitor/appointments/request", requestData)
  return response.data
}

// Alias with lowercase 'f' for backward compatibility
export const requestforAppointment = requestForAppointment

// Visitor: Get my appointment requests
export const getMyAppointmentRequests = async () => {
  const response = await apiClient.get("/visitor/appointments/requests")
  return response.data
}

// Visitor: Fetch my appointments
export const fetchVisitorAppointments = async () => {
  const response = await apiClient.get("/visitor/appointments")
  return response.data
}
