
import nodemailer from "nodemailer"
import dotenv from "dotenv"

// templates./passtemlates for html
import { registrationTemplate } from "../templates/emailTemplates/registrationTemplate.js"
import { appointmentRequestTemplate } from "../templates/emailTemplates/appointmentRequestTemplate.js"
import { appointmentApprovalTemplate } from "../templates/emailTemplates/appointmentApprovalTemplate.js"
import { appointmentRejectionTemplate } from "../templates/emailTemplates/appointmentRejectionTemplate.js"

import { passGeneratedTemplate } from "../templates/emailTemplates/passGeneratedTemplate.js"
import { checkInTemplate } from "../templates/emailTemplates/checkInTemplate.js"
import { checkOutTemplate } from "../templates/emailTemplates/checkOutTemplate.js"
import { securityAlertTemplate } from "../templates/emailTemplates/securityAlertTemplate.js"

dotenv.config()

// using .env files variables
//   EMAIL_HOST=smtp.gmail.com
//   EMAIL_PORT=587
//   EMAIL_USER=gmail@gmail.com
//   EMAIL_PASS=gmail-app-password  
//   EMAIL_FROM=gmail@gmail.com

// To create a Gmail App Password:
//   1. first Go to Google Account > Security > 2-Step Verification
//   2. Scroll down to "App passwords"
//   3. Generate one for "Mail" and paste it in EMAIL_PASS


const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

transporter.verify((error) => {
  if (error) {
    console.error("Nodemailer error:", error.message)
  } else {
    console.log("Nodemailer ready")
  }
})

// build nodemailer emailservice constructor data loading
class EmailService {
  constructor() {
    this.companyName =process.env.COMPANY_NAME || "Visitor Management System"
    this.frontendUrl = process.env.FRONTEND_URL || "http://localhost:4000"
    this.fromEmail =process.env.EMAIL_FROM || process.env.EMAIL_USER
  }

  // default nodemailer sendemail funciton for sending messages
  async sendEmail(to, subject, html) {
    try {
      const info = await transporter.sendMail({
        from: `"${this.companyName}" <${this.fromEmail}>`,
        to, // to user's mail
        subject, // subject, message
        html, // html template style data
      })
      // console.log(`Email sent to ${to}: ${info.messageId}`)
      return { success: true, messageId: info.messageId }
    } catch (err) {
      // console.error("Email error:", err.message)
      return { success: false, error: err.message }
    }
  }

  formatDate(date) {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  formatTime(date) {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  calculateDuration(checkInTime, checkOutTime) {
    if (!checkInTime || !checkOutTime){
       return "N/A"
    }
   
    // the calculation fo diffrence btwn check in checkouts
    const diffMins = Math.floor((new Date(checkOutTime) - new Date(checkInTime)) / 60000)
    if (diffMins < 0) {
      return "Invalid"
    }

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? "s" : ""}`
    }

    const hours = Math.floor(diffMins / 60)
    const mins = diffMins % 60
    return `${hours} hour${hours > 1 ? "s" : ""}${mins > 0 ? ` ${mins} min` : ""}`
  }

  // email's messages funcitons for diffrent type of messages
  async sendRegistration(data) {
    const html = registrationTemplate({
      id: data.id,
      name: data.name,
      email: data.email,
      registeredDate: this.formatDate(new Date()),
      registeredTime: this.formatTime(new Date()),
      companyName: this.companyName,
      frontendUrl: this.frontendUrl,
    })
    return this.sendEmail(data.email, `Welcome to ${this.companyName}!`, html)
  }

  async sendAppointmentCreated(data) {
    const html = appointmentRequestTemplate({

      id: data.id,
      visitorName: data.visitorName,
      requestedDate: this.formatDate(data.date),
      requestedTime: this.formatTime(data.date),
      location: data.location || "Main Office",
      hostName: data.hostName || "To be assigned",
      message: data.message || "-",
      companyName: this.companyName,
      frontendUrl: this.frontendUrl,

    })

    return this.sendEmail(data.visitorEmail, "Appointment Request Submitted", html)
  }

  async sendApproval(data) {
    const html = appointmentApprovalTemplate({
      id: data.id,
      visitorName: data.visitorName,
      date: this.formatDate(data.date),
      time: this.formatTime(data.date),
      location: data.location || "Main Office",
      hostName: data.hostName,
      companyName: this.companyName,
      frontendUrl: this.frontendUrl,
    })

    return this.sendEmail(data.visitorEmail, "Appointment Approved", html)
  }

  async sendRejection(data) {
    const html = appointmentRejectionTemplate({
      
      visitorName: data.visitorName,
      requestedDate: this.formatDate(data.date),
      requestedTime: this.formatTime(data.date),
      reason: data.reason || "Schedule conflict",
      companyName: this.companyName,
      frontendUrl: this.frontendUrl,
  })

    return this.sendEmail(data.visitorEmail, "Appointment Update", html)
  }

  async sendPass(data) {
    const html = passGeneratedTemplate({
      id: data.id,
      visitorName: data.visitorName,
      type: data.type || "Visitor Pass",
      validFrom: this.formatDate(data.validFrom),
      validUntil: this.formatDate(data.validUntil),
      qrCodeUrl: data.qrCodeUrl,
      downloadUrl: data.downloadUrl,
      companyName: this.companyName,
      frontendUrl: this.frontendUrl,

    })

    return this.sendEmail(data.visitorEmail, "Your Digital Pass is Ready", html)
  }

  async sendCheckIn(data) {
    const html = checkInTemplate({
      visitorName: data.visitorName,
      passId: data.passId,
      checkInDate: this.formatDate(data.checkInTime),
      checkInTime: this.formatTime(data.checkInTime),
      location: data.location || "Main Entrance",
      hostName: data.hostName || "Security Team",
      companyName: this.companyName,
      frontendUrl: this.frontendUrl,
    })

    return this.sendEmail(data.visitorEmail, "Check-in Successful", html)
  }

  async sendCheckOut(data) {
    const html = checkOutTemplate({
      
      visitorName: data.visitorName,
      passId: data.passId,
      checkInDate: this.formatDate(data.checkInTime),
      checkInTime: this.formatTime(data.checkInTime),
      checkOutDate: this.formatDate(data.checkOutTime),
      checkOutTime: this.formatTime(data.checkOutTime),
      duration: this.calculateDuration(data.checkInTime, data.checkOutTime),
      location: data.location || "Main Entrance",
      companyName: this.companyName,
      frontendUrl: this.frontendUrl,
    })

    return this.sendEmail(data.visitorEmail, "Check-out Successful", html)
  }

  async sendSecurityAlert(data) {
    const html = securityAlertTemplate({
      
      alertType: data.alertType,
      visitorName: data.visitorName,
      passId: data.passId,
      time: this.formatTime(new Date()),
      location: data.location,
      reason: data.reason,
      companyName: this.companyName,
      frontendUrl: this.frontendUrl,
    })

    const securityEmail = process.env.SECURITY_EMAIL || "security@example.com"
    
    return this.sendEmail(securityEmail, "SECURITY ALERT", html)
  }
}

export default new EmailService()
