
import { baseTemplate, createDetailsBlock } from "./baseTemplate.js"

export const appointmentApprovalTemplate = (data) => {
  
  const details = {
    "✅ Status": "Approved",
    "📅 Date": data.date,
    "⏰ Time": data.time,
    // "📍 Location": "Main Office",
    "📍 Location": data.location || "Main Office",
    "👤 Host": data.hostName,
    "🆔 Appointment ID": data.id,
    "🕛 Next Step": "Your pass will be generated soon"
  }
  
  const content = {
    headerTitle: "✓ Appointment Approved!",
    headerColor: "#4CAF50",
    headerColorDark: "#2E7D32",
    name: data.visitorName,
    mainMessage: "Great news! Your appointment has been approved. Here are the details:",
    detailsBlock: createDetailsBlock(details),
    
    buttonText: "View Appointments",
    buttonLink: `${data.frontendUrl}/visitor/login`,
    buttonColor: "#4CAF50",
    
    companyName: data.companyName,
    footerNote: "Please arrive 10 minutes before your scheduled time."
  }
  
  return baseTemplate(content)
}