
// import cloudinary form "cloudinary"
import axios from "axios"
import dotenv from "dotenv"

dotenv.config()

class EmailService {
  constructor() {
    this.serviceId = process.env.EMAILJS_SERVICE_ID
    this.templateId = process.env.EMAILJS_TEMPLATE_ID
    this.publicKey = process.env.EMAILJS_PUBLIC_KEY
    this.privateKey = process.env.EMAILJS_PRIVATE_KEY
  }

  async sendEmail(templateParams, toEmail) {
    try {

      // console.log("Sending email to:", toEmail)
      // console.log("Template params:", templateParams)

      const response = await axios.post(process.env.EMAILJS_API,
        {
          service_id: this.serviceId,
          template_id: this.templateId,
          user_id: this.publicKey,
          accessToken: this.privateKey,
          template_params: {
            ...templateParams,
            to: toEmail,
            to_email: toEmail,
          },
        }
      )

      // console.log("Email sent response:", response.data)

      return { success: true }

    } catch (error) {

      // console.log("Email error:", error.response?.data || error.message)

      return { success: false, error: error.response?.data }
    }
  }

  async sendRegistration(data) {

    const detailsBlock = `

            🆔 Registration ID: ${data.id} 
            📧 Email: ${data.email}

            📅 Registered on: ${new Date().toLocaleDateString()}
            📍 Time: ${new Date().toLocaleTimeString()}

            ✅ Status: Pending Approval

        `

    const params = {
      header_title: "Welcome to " + process.env.COMPANY_NAME + "! 🎉",
      header_color: "#4CAF50",
      name: data.name,
      main_message:
        "Thank you for registering! Your account has been created successfully.",
      details_block: detailsBlock,
      button_text: "Login to Dashboard",
      button_link: `${process.env.FRONTEND_URL}/visitor/login`,
      button_color: "#4CAF50",
      company_name: process.env.COMPANY_NAME,
      footer_note:
        "Please wait for admin approval. You'll receive another email once approved.",
    }

    // console.log("Registration email params:", params)

    return await this.sendEmail(params, data.email)
  }

  async sendAppointmentCreated(data) {

    const detailsBlock = `

📅 Appointment Request Created!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🆔 Appointment ID: ${data.id} 

📅 Requested Date: ${new Date(data.date).toLocaleDateString()} 
⏰ Requested Time: ${new Date(data.date).toLocaleTimeString()}

📍 Location: ${data.location || "Main Office"} 
👤 Host: ${data.hostName || "To be assigned"} 

🏷️ Status: ${data.status || "Pending Approval"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


📌 Next Steps:

1. Your appointment request submitted

2. Admin will review and approve or reject from your details

3. You'll receive another email after this process

4. After approval, your digital pass will generated

    `

    const params = {
      header_title: "📅 Appointment Request Submitted!",
      header_color: "#2196F3",
      name: data.visitorName,
      main_message:
        "Your appointment request has been successfully created. Please wait for admin approval.",
      details_block: detailsBlock,
      button_text: "Track Appointment",
      button_link: `${process.env.FRONTEND_URL}/visitor/login`,
      button_color: "#2196F3",
      company_name: process.env.COMPANY_NAME,
      footer_note:
        "You will receive an email once your appointment is approved or rejected.",
    }

    // console.log("Appointment created email:", params)

    return await this.sendEmail(params, data.visitorEmail)
  }

  async sendApproval(data) {

    const detailsBlock = `

            ✅ Appointment Status: Approved

            📅 Date: ${new Date(data.date).toLocaleDateString()} 
            ⏰ Time: ${new Date(data.date).toLocaleTimeString()}

            📍 Location: ${data.location || "Main Office"} 
            👤 Host: ${data.hostName || "Team Member"}

            🆔 Appointment ID: ${data.id || "N/A"}\n

            🕛 Your Pass will be Generatign soon...

        `

    const params = {
      header_title: "✓ Appointment Approved!",
      header_color: "#4CAF50",
      name: data.visitorName,
      main_message:
        "Your appointment has been approved. Here are the details:",
      details_block: detailsBlock,
      button_text: "View Appointments",
      button_link: `${process.env.FRONTEND_URL}/visitor/login`,
      button_color: "#4CAF50",
      company_name: process.env.COMPANY_NAME,
      footer_note:
        "Please arrive 10 minutes before your scheduled time.",
    }

    // console.log("Approval email:", params)

    return await this.sendEmail(params, data.visitorEmail)
  }

  async sendRejection(data) {

    const detailsBlock = `

            ❌ Status: Declined 

            📅 Requested Date: ${new Date(data.date).toLocaleDateString()} 
            ⏰ Requested Time: ${new Date(data.date).toLocaleTimeString()}

            💡 Reason: ${data.reason || "Schedule conflict"}

        `

    const params = {
      header_title: "⚠️ Appointment Update",
      header_color: "#f44336",
      name: data.visitorName,
      main_message:
        "We regret to inform you that your appointment has been declined.",
      details_block: detailsBlock,
      button_text: "Book New Appointment",
      button_link: `${process.env.FRONTEND_URL}/visitor/login`,
      button_color: "#FF9800",
      company_name: process.env.COMPANY_NAME,
      footer_note:
        "Sorry for the inconvenience. Please try another time slot.",
    }

    // console.log("Rejection email:", params)

    return await this.sendEmail(params, data.visitorEmail)
  }

  async sendPass(data) {

    const detailsBlock = `

            🎫 Pass ID: ${data.id} 

            📛 Visitor: ${data.visitorName}

            🏷️ Type: ${data.type || "Visitor Pass"}

            📅 Valid From: ${new Date(data.validFrom).toLocaleDateString()} 
            📅 Valid Until: ${new Date(data.validUntil).toLocaleDateString()}

            ⏰ Time: ${new Date().toLocaleTimeString()} 

            🔑 QR Code: Scan at entry

        `

    const params = {
      header_title: "🎫 Your Digital Pass is Ready!",
      header_color: "#2196F3",
      name: data.visitorName,
      main_message:
        "Your access pass has been generated successfully.",
      details_block: detailsBlock,
      button_text: "Download Pass",
      button_link: data.downloadUrl,
      button_color: "#2196F3",
      company_name: process.env.COMPANY_NAME,
      footer_note: "Please show this pass at the entrance.",
    }

    if (data.qrCodeUrl) {
      params.details_block += `

📱 QR Code: ${data.qrCodeUrl}`
    }

    // console.log("Pass email:", params)

    return await this.sendEmail(params, data.visitorEmail)
  }

  async sendCheckIn(data) {

    const detailsBlock = `

            ✅ Check-in Status: SUCCESSFUL 

            📛 Visitor Name: ${data.visitorName} 
            🆔 Pass ID: ${data.passId} 

            📅 Check-in Date: ${data.checkInDate} 
            ⏰ Check-in Time: ${data.checkInTime} 

            📍 Location: ${data.location || "Main Entrance"} 
            🏢 Host: ${data.hostName || "Security Team"}

        `

    const params = {
      header_title: "✅ Check-in Successful!",
      header_color: "#4CAF50",
      name: data.visitorName,
      main_message:
        "You have successfully checked in. Welcome to the premises!",
      details_block: detailsBlock,
      button_text: "View Visit History",
      button_link: `${process.env.FRONTEND_URL}/visitor/login`,
      button_color: "#4CAF50",
      company_name: process.env.COMPANY_NAME,
      footer_note:
        "Please carry your ID with you at all times. When leaving, don't forget to check out.",
    }

    // console.log("Check-in email:", params)

    return await this.sendEmail(params, data.visitorEmail)
  }

  async sendCheckOut(data) {

    const duration = this.calculateDuration(
      data.checkInTime,
      data.checkOutTime
    )

    const detailsBlock = `

            ✅ Check-out Status: SUCCESSFUL

            📛 Visitor Name: ${data.visitorName} 
            🆔 Pass ID: ${data.passId}

            📅 Check-in Date: ${data.checkInDate} 
            ⏰ Check-in Time: ${data.checkInTime}

            📅 Check-out Date: ${data.checkOutDate} 
            ⏰ Check-out Time: ${data.checkOutTime}

            ⏱️ Total Duration: ${duration}

            📍 Location: ${data.location || "Main Entrance"}

        `

    const params = {
      header_title: "👋 Check-out Successful!",
      header_color: "#FF9800",
      name: data.visitorName,
      main_message:
        "Thank you for your visit! You have successfully checked out.",
      details_block: detailsBlock,
      button_text: "View Visit Summary",
      button_link: `${process.env.FRONTEND_URL}/visitor/history`,
      button_color: "#FF9800",
      company_name: process.env.COMPANY_NAME,
      footer_note:
        "We hope you had a great experience. Visit again soon!",
    }

    // console.log("Check-out email:", params)

    return await this.sendEmail(params, data.visitorEmail)
  }

  async sendSecurityAlert(data) {

    const detailsBlock = `

            ⚠️ Alert Type: ${data.alertType} 

            📛 Visitor: ${data.visitorName} 
            🆔 Pass ID: ${data.passId} 

            ⏰ Time: ${data.time} 
            📍 Location: ${data.location} 

            🔔 Reason: ${data.reason}

        `

    const params = {
      header_title: "⚠️ Security Alert!",
      header_color: "#f44336",
      name: "Security Team",
      main_message: `Security alert triggered for ${data.visitorName}.`,
      details_block: detailsBlock,
      button_text: "View Details",
      button_link: `${process.env.FRONTEND_URL}/admin/security`,
      button_color: "#f44336",
      company_name: process.env.COMPANY_NAME,
      footer_note: "Please investigate immediately.",
    }

    // console.log("Security alert email:", params)

    return await this.sendEmail(params, process.env.SECURITY_EMAIL)
  }

  calculateDuration(checkInTime, checkOutTime) {

    const checkIn = new Date(checkInTime)
    const checkOut = new Date(checkOutTime)

    const diffMs = checkOut - checkIn
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 60) {
      return `${diffMins} minutes`
    } else {
      const hours = Math.floor(diffMins / 60)
      const mins = diffMins % 60

      return `${hours} hour${hours > 1 ? "s" : ""} ${mins > 0 ? `${mins} min` : ""}`
    }
  }

  formatDateTime(date) {

    return {
      date: new Date(date).toLocaleDateString(),
      time: new Date(date).toLocaleTimeString(),
    }
  }
}

export default new EmailService()