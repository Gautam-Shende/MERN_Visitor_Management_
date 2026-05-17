import Visitor from "../../models/Visitor.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import Appointment from "../../models/Appointment.js";
import emailService from "../../utils/emailService.js";

import { MESSAGES } from "../../../constants.js"

const makeToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" })
}

export const registerVisitorService = async (visitorData, file) => {
  const { name, email, phone, purpose, password } = visitorData
  
  const existingVisitor = await Visitor.findOne({ email })
  
  if (existingVisitor) {
    throw new Error("Visitor already registered with this email")
  }
  
  const hashedPassword = await bcrypt.hash(password, 10)
  
  let photoUrl = null
  if (file) {
    photoUrl = file.path
  }
  
  const visitor = new Visitor({
    name,
    email,
    phone,
    purpose,
    password: hashedPassword,
    photo: photoUrl,
    status: "pending"
  })
  
  await visitor.save()
  
  const token = makeToken(visitor._id)
  
  return {
    token,
    visitor: {
      id: visitor._id,
      name: visitor.name,
      email: visitor.email,
      phone: visitor.phone,
      purpose: visitor.purpose,
      photo: visitor.photo,
      status: visitor.status
    }
  }
}

export const loginVisitorService = async (email, password) => {
  const visitor = await Visitor.findOne({ email })
  if (!visitor) throw new Error(MESSAGES.VISITOR_NOT_FOUND)

  const match = await bcrypt.compare(password, visitor.password)
  if (!match) throw new Error(MESSAGES.LOGIN_FAILED)

  const token = makeToken(visitor._id)

  return {
    token,
    visitor: {
      id: visitor._id,
      name: visitor.name,
      email: visitor.email,
      phone: visitor.phone,
      purpose: visitor.purpose,
      photo: visitor.photo,
      status: visitor.status
    }
  }
}

export const getVisitorProfileService = async (visitorId) => {
  const visitor = await Visitor.findById(visitorId).select("-password")
  if (!visitor) throw new Error(MESSAGES.VISITOR_NOT_FOUND)
  return visitor
}

export const requestAppointmentService = async ({ visitorId, preferredDate, purpose, message }) => {
  const reqDate = new Date(preferredDate)
  if (reqDate < new Date()) throw new Error("Date must be in the future")

  const visitor = await Visitor.findById(visitorId)
  if (!visitor) throw new Error("Visitor not found")

  // Check existing pending request
  const already = await Appointment.findOne({ visitor: visitorId, status: "requested" })
  if (already) throw new Error("You already have a pending request")

  const appointment = await Appointment.create({
    visitor: visitorId,
    preferredDate: reqDate,
    status: "requested",
    requestedByVisitor: true,
    purpose,
    message: message || "",
    date: null,
    host: null
  })

  visitor.status = "requested"
  await visitor.save()

  // console.log(`${visitor.status}`)

  return appointment
}


export const getMyRequestsService = async (visitorId) => {
  return await Appointment.find({ visitor: visitorId, requestedByVisitor: true })
    .populate("host", "name email")
    .sort({ createdAt: -1 })
}
