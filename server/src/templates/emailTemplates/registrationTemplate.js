import { baseTemplate, createDetailsBlock } from "./baseTemplate.js"

export const registrationTemplate = (data) => {
  const details = {
    "🆔 Registration ID": data.id,
    "📧 Email": data.email,
    "📅 Registered Date": data.registeredDate,
    "⏰ Registered Time": data.registeredTime,
    "✅ Status": "Pending Approval"
  }
  
  const content = {
    headerTitle: "🎉 Welcome to " + (data.companyName || "Our Company") + "!",
    headerColor: "#4CAF50",
    headerColorDark: "#2E7D32",
    name: data.name,
    mainMessage: "Thank you for registering! Your account has been created successfully.",
    detailsBlock: createDetailsBlock(details),
   
    buttonText: "Login to Dashboard",
    buttonLink: `${data.frontendUrl}/visitor/login`,
    buttonColor: "#4CAF50",
   
    companyName: data.companyName,
    footerNote: "Please wait for admin approval. You'll receive another email once approved."
  }
  
  return baseTemplate(content)
}