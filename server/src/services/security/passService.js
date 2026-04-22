
import mongoose from "mongoose"

import Pass from "../../models/Pass.js"
import Appointment from "../../models/Appointment.js"
import CheckLog from "../../models/CheckLog.js"


// import { storage } from "../../middleware/uploadMiddleware.js"
import emailService from "../../utils/emailService.js"
import { generatePassPDF } from "../../utils/pdfGenerator.js"
import generateQRCode from "../../utils/qrGenerator.js"

import cloudinary from "../../config/Cloudinary/cloudinary.js"

// this added for downloading pass ,having some problem facing with cloudinary 
const uploadPDFToCloud = async (pdfBuffer, passId) => {
  const base64PDF = pdfBuffer.toString("base64")
  // data file location addedd
  const dataURI = `data:application/pdf;base64,${base64PDF}`

  const res = await cloudinary.uploader.upload(dataURI, {
    folder: "visitor-passes/pdfs",
    public_id: `pass_${passId}`,
    resource_type: "raw",
    overwrite: true,
  })

  return { url: res.secure_url, publicId: res.public_id }
}

export const generatePass = async (appointmentId) => {
  const appointment = await Appointment.findById(appointmentId)
    .populate("visitor")
    .populate("host", "name email")

  if (!appointment) {
    throw new Error("Appointment not found") 
  }
  if (appointment.status !== "approved") {
    throw new Error("Appointment not approved")
  }

  // const existing = await Pass.findbtId({ appointment._id })
  const existing = await Pass.findOne({ appointment: appointment._id })
  if (existing) {
    throw new Error("Pass already generated")
  }

  const pass = new Pass({
    visitor: appointment.visitor._id,
    appointment: appointment._id,
    status: "active",
  })

  await pass.save()

  const qrResult = await generateQRCode(pass._id)
  if (qrResult) {
    pass.qrCode = qrResult.cloudinaryUrl
    pass.qrPublicId = qrResult.cloudinaryPublicId
  }

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

  return pass
}

export const scanPass = async (qrData) => {
  const passId = qrData.startsWith("PASS:") ? qrData.replace("PASS:", "") : qrData

  if (!mongoose.Types.ObjectId.isValid(passId)) throw new Error("Invalid pass ID")

  const pass = await Pass.findById(passId).populate("visitor", "name email phone")
  if (!pass) {
    throw new Error("Pass not found")
  }

  if (pass.status === "expired") {
    throw new Error("This pass has already expired. Please contact security.")
  }

  const activeLog = await CheckLog.findOne({ pass: pass._id, checkOutTime: null })
  let result = {}

  if (activeLog) {
    activeLog.checkOutTime = new Date()
    await activeLog.save()

    pass.status = "expired"
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
      // console.error("Checkout email failed:", err.message);
      throw new Error("CheckOut email failed:", err.message)
    }
  } else {
    const checkLog = new CheckLog({ pass: pass._id, checkInTime: new Date() })
    
    await checkLog.save()

    pass.status = "inside"
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
      // console.error("Checkin email failed:", err.message)
      throw new Error("Checkin email failed:", err.message)

    }
  }

  return {
    ...result,
    passId: pass._id,
    status: pass.status,
    visitor: pass.visitor,
  }
}

export const getAllPasses = async () => {
  // fetch with all data
  return await Pass.find()
    .populate("visitor", "name email phone photo")
    .populate({ path: "appointment", populate: { path: "host", select: "name email" } })
    .sort({ createdAt: -1 })
}

export const getPassById = async (id) => {
  const pass = await Pass.findById(id)
    .populate("visitor")
    .populate({ path: "appointment", populate: { path: "host", select: "name email" } })

  if (!pass) {
    throw new Error("Pass not found")
  }
    return pass;
}

export const getCheckLogsByPassId = async (passId) => {
  return await CheckLog.find({ pass: passId }).sort({ checkInTime: -1 })
}
