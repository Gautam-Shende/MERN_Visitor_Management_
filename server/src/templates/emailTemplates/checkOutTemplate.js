import { baseTemplate, createDetailsBlock } from "./baseTemplate.js"

export const checkOutTemplate = (data) => {
  const details = {
    "✅ Status": "SUCCESSFUL",
    "📛 Visitor Name": data.visitorName,
    "🆔 Pass ID": data.passId,
    "📅 Check-in Date": data.checkInDate,
    "⏰ Check-in Time": data.checkInTime,
    "📅 Check-out Date": data.checkOutDate,
    "⏰ Check-out Time": data.checkOutTime,
    "⏱️ Total Duration": data.duration,
    "📍 Location": data.location || "Main Entrance"
  }
  
  const content = {
    headerTitle: "👋 Check-out Successful!",
    headerColor: "#FF9800",
    headerColorDark: "#E65100",
    name: data.visitorName,
    mainMessage: "Thank you for your visit! You have successfully checked out.",
    detailsBlock: createDetailsBlock(details),
    buttonText: "View Visit Summary",
    buttonLink: `${data.frontendUrl}/visitor/history`,
    buttonColor: "#FF9800",
    companyName: data.companyName,
    footerNote: "We hope you had a great experience. Visit again soon!"
  }
  
  return baseTemplate(content)
}