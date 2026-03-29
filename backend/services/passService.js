import mongoose from "mongoose"
import Pass from "../models/Pass.js"

import { generatePassPDF } from "../utils/pdfGenerator.js"
import Appointment from "../models/Appointment.js"
// import Visitor from "../models"
import QRCode from "qrcode"
import streamifier from "streamifier"

import CheckLog from "../models/CheckLog.js"
import cloudinary from "../utils/cloudinary.js"

import emailService from "../utils/emailService.js"


export const generatePass = async (appointmentId) => {
  try {

    // console.log("Generating pass for appointment:", appointmentId)

    const appointment = await Appointment.findById(appointmentId)
      .populate("visitor")
      .populate("host", "name email")

    if (!appointment) {
      // console.log("Appointment not found")
      throw new Error("Appointment not found")
    }

    if (appointment.status !== "approved") {
      // console.log("Appointment not approved")
      throw new Error("Appointment not approved")
    }

    const existingPass = await Pass.findOne({ appointment: appointment._id })

    if (existingPass) {
      // console.log("Pass already generated")
      throw new Error("Pass already generated")
    }

    const pass = await Pass.create({
      visitor: appointment.visitor._id,
      appointment: appointment._id,
      status: "active"
    })

    // console.log("Pass created:", pass._id)

    const qrData = `PASS:${pass._id}`

    const qrBuffer = await QRCode.toBuffer(qrData, {
      type: "png",
      width: 300,
      errorCorrectionLevel: "H"
    })

    let qrUpload = null

    try {

      qrUpload = await new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
          {
            folder: `visitors/${pass.visitor}/qrcodes`,
            resource_type: "image",
            public_id: `qr_${pass._id}`
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        )

        streamifier.createReadStream(qrBuffer).pipe(stream)

      })

    } catch (err) {

      // console.log("QR Upload Error:", err)

      throw new Error("Failed to upload QR code: " + err.message)
    }

    let pdfBuffer

    try {

      pdfBuffer = await generatePassPDF({
        company_name: process.env.COMPANY_NAME || "VisitorFlow",
        visitor_name: appointment.visitor.name,
        visitor_email: appointment.visitor.email,
        visitor_phone: appointment.visitor.phone || "Not provided",

        visit_date: new Date(appointment.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric"
        }),

        visit_time: new Date(appointment.date).toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit"
        }),

        host_name: appointment.host?.name || "Admin Team",
        qr_code: qrUpload.secure_url,
        pass_id: pass._id.toString(),
        generated_date: new Date().toLocaleString()
      })

    } catch (err) {

      // console.log("PDF Generation Error:", err)

      throw new Error("Failed to generate PDF: " + err.message)
    }

    let pdfUpload = null

    try {

      pdfUpload = await cloudinary.uploader.upload(
        `data:application/pdf;base64,${pdfBuffer.toString("base64")}`,
        {
          folder: `visitors/${pass.visitor}/passes`,
          resource_type: "raw",
          public_id: `pass_${pass._id}`
        }
      )

    } catch (err) {

      // console.log("PDF Upload Error:", err)

      throw new Error("Failed to upload PDF: " + err.message)
    }

    pass.qrCode = qrUpload.secure_url
    pass.qrPublicId = qrUpload.public_id

    pass.pdfPath = pdfUpload.secure_url
    pass.pdfPublicId = pdfUpload.public_id

    await pass.save()

    try {

      await emailService.sendPass({
        visitorName: appointment.visitor.name,
        visitorEmail: appointment.visitor.email,
        id: pass._id,
        type: "Visitor Pass",
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        qrCodeUrl: pass.qrCode,
        downloadUrl: pass.pdfPath + appointment.visitor.name
      })

    } catch (err) {

      // console.log("Email Error:", err)

      throw new Error(err.message)
    }

    // console.log("Pass generated successfully for:", appointment.visitor.name)

    return pass

  } catch (error) {

    // console.log("Pass generation failed:", error.message)

    throw error
  }
}


export const scanPass = async (qrData) => {

  // console.log("Received qrData:", qrData)
  // console.log("qrData type:", typeof qrData)

  let qrString = ""

  if (typeof qrData === "string") {

    qrString = qrData.trim()

  } else if (qrData && typeof qrData === "object") {

    if (qrData.qrData) {

      qrString = String(qrData.qrData).trim()

    } else if (qrData.data) {

      qrString = String(qrData.data).trim()

    } else {

      qrString = JSON.stringify(qrData)
    }

  } else if (qrData) {

    qrString = String(qrData).trim()
  }

  // console.log("After conversion - qrString:", qrString)

  if (!qrString) {

    // console.log("QR data is empty")

    throw new Error("QR data is required")
  }

  let passId = ""

  if (qrString.startsWith("PASS:")) {

    passId = qrString.replace("PASS:", "").trim()

    // console.log("Extracted passId:", passId)

  } else if (qrString.includes("/")) {

    const parts = qrString.split("/")

    passId = parts[parts.length - 1]

    // console.log("Extracted passId from URL:", passId)

  } else {

    passId = qrString

    // console.log("Using qrString as passId:", passId)
  }

  if (!mongoose.Types.ObjectId.isValid(passId)) {

    // console.log("Invalid ObjectId format:", passId)

    throw new Error("Invalid Pass ID format")
  }

  // console.log("Valid ObjectId, searching pass")

  const pass = await Pass.findById(passId)

  if (!pass) {

    // console.log("Pass not found for ID:", passId)

    throw new Error("Pass not found")
  }

  // console.log("Pass found:", pass._id)

  return pass
}


export const getAllPasses = async () => {

  // console.log("Fetching all passes")

  return await Pass.find()
    .populate("visitor", "name email phone photo")
    .populate({
      path: "appointment",
      select: "date host",
      populate: { path: "host", select: "name email" }
    })
    .sort({ createdAt: -1 })
}


export const getPassById = async (id) => {

  // console.log("Fetching pass by id:", id)

  const pass = await Pass.findById(id)
    .populate("visitor")
    .populate({
      path: "appointment",
      populate: { path: "host", select: "name email" }
    })

  if (!pass) {

    // console.log("Pass not found")

    throw new Error("Pass not found")
  }

  return pass
}


export const getCheckLogsByPassId = async (passId) => {

  // console.log("Fetching logs for pass:", passId)

  if (!passId) {

    // console.log("Pass ID is required")

    throw new Error("Pass ID is required")
  }

  return await CheckLog.find({ pass: passId }).sort({ checkInTime: -1 })
}