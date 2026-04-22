import { baseTemplate, createDetailsBlock } from "./baseTemplate.js"

export const appointmentRejectionTemplate = (data) => {
  const details = {
    "❌ Status": "Declined",
    "📅 Requested Date": data.requestedDate,
    "⏰ Requested Time": data.requestedTime,
    "💡 Reason": data.reason || "Schedule conflict"
  }
  
  const content = {
    headerTitle: "⚠️ Appointment Update",
    headerColor: "#f44336",
    headerColorDark: "#c62828",
    name: data.visitorName,
    mainMessage: "We regret to inform you that your appointment has been declined.",
    detailsBlock: createDetailsBlock(details),
    buttonText: "Book New Appointment",
    buttonLink: `${data.frontendUrl}/visitor/login`,
    buttonColor: "#FF9800",
    companyName: data.companyName,
    footerNote: "Sorry for the inconvenience. Please try another time slot."
  }
  
  return baseTemplate(content)
}