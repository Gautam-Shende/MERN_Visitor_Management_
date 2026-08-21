import mongoose from "mongoose"
import Pass from "../models/Pass.js"
import Appointment from "../models/Appointment.js"
import CheckLog from "../models/CheckLog.js"
import emailService from "../utils/emailService.js"
import { generatePassPDF } from "../utils/pdfGenerator.js"
import generateQRCode from "../utils/qrGenerator.js"
import cloudinary from "../config/Cloudinary/cloudinary.js"
import { HTTP_STATUS, MESSAGES, PASS_STATUS } from "../constants.js"

// Helper function to upload PDF buffer to Cloudinary
const uploadPDFToCloud = async (pdfBuffer, passId) => {
  const base64PDF = pdfBuffer.toString("base64")
  const dataURI = `data:application/pdf;base64,${base64PDF}`

  const res = await cloudinary.uploader.upload(dataURI, {
    folder: "visitor-passes/pdfs",
    public_id: `pass_${passId}`,
    resource_type: "raw",
    overwrite: true,
  })

  return { url: res.secure_url, publicId: res.public_id }
}

// Generate pass for an approved appointment
export const generatePass = async (req, res, next) => {
  try {
    const appointmentId = req.params.id
    const appointment = await Appointment.findById(appointmentId)
      .populate("visitor")
      .populate("host", "name email")

    if (!appointment) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: MESSAGES.APPOINTMENT_NOT_FOUND,
      })
    }

    if (appointment.status !== "approved") {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Appointment not approved",
      })
    }

    const existing = await Pass.findOne({ appointment: appointment._id })
    if (existing) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        message: MESSAGES.PASS_ALREADY_EXISTS,
      })
    }

    const pass = new Pass({
      visitor: appointment.visitor._id,
      appointment: appointment._id,
      status: PASS_STATUS.ACTIVE,
    })

    await pass.save()

    // Generate QR Code
    const qrResult = await generateQRCode(pass._id)
    if (qrResult) {
      pass.qrCode = qrResult.cloudinaryUrl
      pass.qrPublicId = qrResult.cloudinaryPublicId
    }

    // Generate PDF Pass
    try {
      const pdfBuffer = await generatePassPDF({
        company_name: process.env.COMPANY_NAME || "Visitor Management System",
        visitor_name: appointment.visitor.name,
        visitor_email: appointment.visitor.email,
        visitor_phone: appointment.visitor.phone || "N/A",
        visit_date: new Date(appointment.date).toLocaleDateString(),
        visit_time: new Date(appointment.date).toLocaleTimeString(),
        host_name: appointment.host?.name || "Admin",
        qr_code: pass.qrCode,
        pass_id: pass._id,
        generated_date: new Date().toLocaleString(),
      })

      const saved = await uploadPDFToCloud(pdfBuffer, pass._id)
      pass.pdfPath = saved.url
      pass.pdfPublicId = saved.publicId
    } catch (err) {
      console.error("PDF generation failed:", err.message)
    }

    await pass.save()

    // Send Pass Email
    try {
      await emailService.sendPass({
        id: pass._id,
        visitorName: appointment.visitor.name,
        visitorEmail: appointment.visitor.email,
        validFrom: new Date(),
        validUntil: appointment.date,
        downloadUrl: pass.pdfPath || null,
        qrCodeUrl: pass.qrCode,
      })
    } catch (err) {
      console.error("Pass email failed:", err.message)
    }

    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: MESSAGES.PASS_GENERATED,
      pass,
    })
  } catch (error) {
    next(error)
  }
}

// Scan pass for check-in or check-out
export const scanPass = async (req, res, next) => {
  try {
    const { qrData } = req.body
    if (!qrData) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: MESSAGES.PASS_QR_REQUIRED,
      })
    }

    const passId = qrData.startsWith("PASS:") ? qrData.replace("PASS:", "") : qrData

    if (!mongoose.Types.ObjectId.isValid(passId)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: MESSAGES.PASS_QR_INVALID,
      })
    }

    const pass = await Pass.findById(passId).populate("visitor", "name email phone")
    if (!pass) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: MESSAGES.PASS_NOT_FOUND,
      })
    }

    if (pass.status === PASS_STATUS.EXPIRED) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "This pass has already expired. Please contact security.",
      })
    }

    const activeLog = await CheckLog.findOne({ pass: pass._id, checkOutTime: null })
    let result = {}

    if (activeLog) {
      // Check-out
      activeLog.checkOutTime = new Date()
      await activeLog.save()

      pass.status = PASS_STATUS.EXPIRED
      await pass.save()

      const diffMs = activeLog.checkOutTime - activeLog.checkInTime
      const totalMins = Math.floor(diffMs / 60000)
      const hrs = Math.floor(totalMins / 60)
      const mins = totalMins % 60
      const duration = hrs > 0 ? `${hrs}h ${mins}m` : `${totalMins} minutes`

      result = {
        action: "checkout",
        visitorName: pass.visitor?.name,
        visitorEmail: pass.visitor?.email,
        checkInTime: activeLog.checkInTime,
        checkOutTime: activeLog.checkOutTime,
        duration,
        message: `${pass.visitor?.name} checked out. Pass expired.`,
      }

      try {
        await emailService.sendCheckOut({
          visitorName: pass.visitor?.name,
          visitorEmail: pass.visitor?.email,
          passId: pass._id,
          checkInTime: activeLog.checkInTime,
          checkOutTime: activeLog.checkOutTime,
          location: "Main Entrance",
          duration,
        })
      } catch (err) {
        console.error("Checkout email failed:", err.message)
      }
    } else {
      // Check-in
      const checkLog = new CheckLog({ pass: pass._id, checkInTime: new Date() })
      await checkLog.save()

      pass.status = PASS_STATUS.INSIDE
      await pass.save()

      result = {
        action: "checkin",
        visitorName: pass.visitor?.name,
        visitorEmail: pass.visitor?.email,
        checkInTime: checkLog.checkInTime,
        message: `${pass.visitor?.name} checked in. Welcome!`,
      }

      try {
        await emailService.sendCheckIn({
          visitorName: pass.visitor?.name,
          visitorEmail: pass.visitor?.email,
          passId: pass._id,
          checkInTime: checkLog.checkInTime,
          location: "Main Entrance",
        })
      } catch (err) {
        console.error("Checkin email failed:", err.message)
      }
    }

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      ...result,
      passId: pass._id,
      status: pass.status,
      visitor: pass.visitor,
    })
  } catch (error) {
    next(error)
  }
}

// Get all passes
export const getPasses = async (req, res, next) => {
  try {
    const passes = await Pass.find()
      .populate("visitor", "name email phone photo")
      .populate({ path: "appointment", populate: { path: "host", select: "name email" } })
      .sort({ createdAt: -1 })

    return res.status(HTTP_STATUS.OK).json(passes)
  } catch (error) {
    next(error)
  }
}

// Get single pass by ID
export const getPassById = async (req, res, next) => {
  try {
    const { id } = req.params
    const pass = await Pass.findById(id)
      .populate("visitor")
      .populate({ path: "appointment", populate: { path: "host", select: "name email" } })

    if (!pass) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: MESSAGES.PASS_NOT_FOUND,
      })
    }

    return res.status(HTTP_STATUS.OK).json(pass)
  } catch (error) {
    next(error)
  }
}

// Get check logs by pass ID
export const getCheckLogsByPassId = async (req, res, next) => {
  try {
    const { passId } = req.params
    const logs = await CheckLog.find({ pass: passId }).sort({ checkInTime: -1 })

    return res.status(HTTP_STATUS.OK).json(logs)
  } catch (error) {
    next(error)
  }
}

// Visitor: Get my passes
export const getMyPasses = async (req, res, next) => {
  try {
    const visitorId = req.visitor._id
    const passes = await Pass.find({ visitor: visitorId })
      .populate({ path: "appointment", populate: { path: "host", select: "name email" } })
      .sort({ createdAt: -1 })

    return res.status(HTTP_STATUS.OK).json(passes)
  } catch (error) {
    next(error)
  }
}

// Visitor: Get pass by appointment ID
export const getPassByAppointment = async (req, res, next) => {
  try {
    const visitorId = req.visitor._id
    const { appointmentId } = req.params

    const pass = await Pass.findOne({ appointment: appointmentId, visitor: visitorId })
      .populate("visitor")
      .populate({ path: "appointment", populate: { path: "host", select: "name email" } })

    if (!pass) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: MESSAGES.PASS_NOT_FOUND,
      })
    }

    return res.status(HTTP_STATUS.OK).json(pass)
  } catch (error) {
    next(error)
  }
}
