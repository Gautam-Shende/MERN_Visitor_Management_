import { baseTemplate, createDetailsBlock } from "./baseTemplate.js"

export const passGeneratedTemplate = (data) => {
  const details = {
    "🎫 Pass ID": data.id,
    "📛 Visitor": data.visitorName,
    "🏷️ Type": data.type || "Visitor Pass",
    "📅 Valid From": data.validFrom,
    "📅 Valid Until": data.validUntil,
    "🔑 QR Code": "Scan at entrance"
  }
  
  let qrSection = ''
  if (data.qrCodeUrl) {
    qrSection = `
      <div style="text-align: center; margin-top: 20px;">
        <img src="${data.qrCodeUrl}" alt="QR Code" style="width: 150px; height: 150px; border-radius: 10px;">
        <p style="font-size: 12px; color: #666; margin-top: 8px;">Scan this QR code at the entrance</p>
      </div>
    `
  }
  
  const content = {
    headerTitle: "🎫 Your Digital Pass is Ready!",
    headerColor: "#9C27B0",
    headerColorDark: "#6A1B9A",
    name: data.visitorName,
    mainMessage: "Your access pass has been generated successfully. Please find the details below:",
    detailsBlock: createDetailsBlock(details) + qrSection,
    buttonText: "Download Pass",
    buttonLink: data.downloadUrl || `${data.frontendUrl}/visitor/passes`,
    buttonColor: "#9C27B0",
    companyName: data.companyName,
    footerNote: "Please show this pass at the entrance. This pass is valid for one-time entry."
  }
  
  return baseTemplate(content)
}