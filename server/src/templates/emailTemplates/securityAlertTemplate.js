import { baseTemplate, createDetailsBlock } from "./baseTemplate.js"

export const securityAlertTemplate = (data) => {
  const details = {
    "⚠️ Alert Type": data.alertType,
    "📛 Visitor": data.visitorName,
    "🆔 Pass ID": data.passId,
    "⏰ Time": data.time,
    "📍 Location": data.location,
    "🔔 Reason": data.reason
  }
  
  const content = {
    headerTitle: "⚠️ SECURITY ALERT!",
    headerColor: "#f44336",
    headerColorDark: "#c62828",
    name: "Security Team",
    mainMessage: `🚨 Security alert triggered for ${data.visitorName}. Immediate attention required!`,
    detailsBlock: createDetailsBlock(details),
    buttonText: "View Details",
    buttonLink: `${data.frontendUrl}/admin/security`,
    buttonColor: "#f44336",
    companyName: data.companyName,
    footerNote: "Please investigate immediately. This is an automated security alert."
  }
  
  return baseTemplate(content)
}