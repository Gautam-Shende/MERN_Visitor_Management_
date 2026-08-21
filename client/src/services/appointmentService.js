import api from "./api"

// Fetch all appointments (Admin / Employee)
export const fetchAppointments = async () => {
  const response = await api.get("/appointments")
  return response.data
}

// Fetch appointment by ID
export const fetchAppointmentById = async (id) => {
  const response = await api.get(`/appointments/${id}`)
  return response.data
}

// Approve appointment
export const approveAppointment = async (id) => {
  const response = await api.put(`/appointments/approve/${id}`)
  return response.data
}

// Reject appointment
export const rejectAppointment = async (id) => {
  const response = await api.put(`/appointments/reject/${id}`)
  return response.data
}

// Fetch requested appointments (pending schedule approval)
export const fetchPendingRequests = async () => {
  const response = await api.get("/appointments/requested")
  return response.data
}

// Convert visitor request into a scheduled appointment
export const convertRequestToAppointment = async (requestId, data) => {
  const response = await api.put(`/appointments/${requestId}/convert`, data)
  return response.data
}