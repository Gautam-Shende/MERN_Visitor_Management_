import api from "./api"

// Fetch all passes
export const fetchPasses = async () => {
  const response = await api.get("/pass")
  return response.data
}

// Fetch single pass by ID
export const fetchPassById = async (id) => {
  const response = await api.get(`/pass/${id}`)
  return response.data
}

// Generate digital pass for an appointment
export const createPass = async (appointmentId) => {
  const response = await api.post(`/pass/${appointmentId}`)
  return response.data
}

// Scan pass QR code for Check-in / Check-out
export const scanPass = async (qrData) => {
  const response = await api.post("/pass/scan", typeof qrData === "string" ? { qrData } : qrData)
  return response.data
}

// Fetch check-in / check-out logs for a pass
export const fetchCheckLogsByPassId = async (passId) => {
  const response = await api.get(`/pass/${passId}/checklogs`)
  return response.data
}