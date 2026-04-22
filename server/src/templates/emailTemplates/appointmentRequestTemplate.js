import { baseTemplate, createDetailsBlock } from "./baseTemplate.js"

export const appointmentRequestTemplate = (data) => {
  const details = {
    "🆔 Appointment ID": data.id,
    "📅 Requested Date": data.requestedDate,
    "⏰ Requested Time": data.requestedTime,
    "📍 Location": data.location || "Main Office",
    "👤 Host": data.hostName || "To be assigned",
    "🏷️ Status": "Pending Approval",
    "💬 Message": data.message || "-"
  }
  
  const content = {
    headerTitle: "📅 Appointment Request Submitted!",
    headerColor: "#2196F3",
    headerColorDark: "#0b5e7e",
    name: data.visitorName,
    mainMessage: "Your appointment request has been successfully created. Please wait for admin approval.",
    detailsBlock: createDetailsBlock(details),
    buttonText: "Track Appointment",
    buttonLink: `${data.frontendUrl}/visitor/login`,
    buttonColor: "#2196F3",
    companyName: data.companyName,
    footerNote: "You will receive an email once your appointment is approved or rejected."
  }
  
  return baseTemplate(content)
}