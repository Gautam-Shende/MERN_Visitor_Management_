import api from "./api"

const downloadFileFromBlob = (fileBlob, fileName) => {
  if (!fileBlob) return;

  const fileUrl = window.URL.createObjectURL(fileBlob)

  const anchor = document.createElement("a")

  anchor.href = fileUrl

  anchor.download = fileName

  document.body.appendChild(anchor)

  anchor.click()

  anchor.remove()

  window.URL.revokeObjectURL(fileUrl);
}

export const exportToCSV = async (visitorId) => {
  const response = await api.get(`/export/csv/${visitorId}`, {
    responseType: "blob",
  });

  downloadFileFromBlob(response.data, "visitor_report.csv");
}

export const exportToExcel = async (visitorId) => {
  const response = await api.get(`/export/excel/${visitorId}`, {
    responseType: "blob",
  });

  downloadFileFromBlob(response.data, "visitor_report.xlsx");
}
