import api from "./api"

// Helper to trigger file download from blob response
const downloadFileFromBlob = (fileBlob, fileName) => {
  if (!fileBlob) return
  const fileUrl = window.URL.createObjectURL(fileBlob)
  const anchor = document.createElement("a")
  anchor.href = fileUrl
  anchor.download = fileName
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.URL.revokeObjectURL(fileUrl)
}

// Export visitor details to CSV
export const exportToCSV = async (visitorId) => {
  const response = await api.get(`/export/csv/${visitorId}`, {
    responseType: "blob",
  })
  downloadFileFromBlob(response.data, "visitor_report.csv")
}

// Export visitor details to Excel
export const exportToExcel = async (visitorId) => {
  const response = await api.get(`/export/excel/${visitorId}`, {
    responseType: "blob",
  })
  downloadFileFromBlob(response.data, "visitor_report.xlsx")
}
