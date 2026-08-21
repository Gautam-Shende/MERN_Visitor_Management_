import apiClient from "./apiClient"

// Fetch all passes
export const fetchPasses = async () => {
  const response = await apiClient.get("/pass")
  return response.data
}

// Fetch single pass by ID
export const fetchPassById = async (id) => {
  const response = await apiClient.get(`/pass/${id}`)
  return response.data
}

// Generate digital pass for an appointment
export const createPass = async (appointmentId) => {
  const response = await apiClient.post(`/pass/${appointmentId}`)
  return response.data
}

// Scan pass QR code for Check-in / Check-out
export const scanPass = async (qrData) => {
  const response = await apiClient.post("/pass/scan", typeof qrData === "string" ? { qrData } : qrData)
  return response.data
}

// Fetch check-in / check-out logs for a pass
export const fetchCheckLogsByPassId = async (passId) => {
  const response = await apiClient.get(`/pass/${passId}/checklogs`)
  return response.data
}

// Visitor: Fetch my passes
export const fetchVisitorPasses = async () => {
  const response = await apiClient.get("/visitor/passes")
  return response.data
}

// Visitor: Fetch pass by appointment ID
export const getVisitorPass = async (appointmentId) => {
  const response = await apiClient.get(`/visitor/pass/${appointmentId}`)
  return response.data
}
