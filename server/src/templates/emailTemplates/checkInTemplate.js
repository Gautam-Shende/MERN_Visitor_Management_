import { baseTemplate, createDetailsBlock } from "./baseTemplate.js"

export const checkInTemplate = (data) => {
  const details = {
    "✅ Status": "SUCCESSFUL",
    "📛 Visitor Name": data.visitorName,
    "🆔 Pass ID": data.passId,
    "📅 Check-in Date": data.checkInDate,
    "⏰ Check-in Time": data.checkInTime,
    "📍 Location": data.location || "Main Entrance",
    "🏢 Host": data.hostName || "Security Team"
  }
  
  const content = {
    headerTitle: "✅ Check-in Successful!",
    headerColor: "#4CAF50",
    headerColorDark: "#2E7D32",
    name: data.visitorName,
    mainMessage: "You have successfully checked in. Welcome to the premises!",
    detailsBlock: createDetailsBlock(details),
    buttonText: "View Visit History",
    buttonLink: `${data.frontendUrl}/visitor/login`,
    buttonColor: "#4CAF50",
    companyName: data.companyName,
    footerNote: "Please carry your ID with you at all times. When leaving, don't forget to check out."
  }
  
  return baseTemplate(content)
}