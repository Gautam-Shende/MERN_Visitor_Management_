import Visitor from "../../models/Visitor.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import Appointment from "../../models/Appointment.js"
import { MESSAGES } from "../../../constants.js"

// Helper function to sign JWT for visitors
const makeToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" })
}

// Register visitor
export const registerVisitorService = async (visitorData, file) => {
  const { name, email, phone, purpose, password } = visitorData

  const existingVisitor = await Visitor.findOne({ email })
  if (existingVisitor) {
    throw new Error("Visitor already registered with this email")
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const photoUrl = file ? file.path : null

  const visitor = new Visitor({
    name,
    email,
    phone,
    purpose,
    password: hashedPassword,
    photo: photoUrl,
    status: "pending",
  })

  await visitor.save()
  const token = makeToken(visitor._id)

  return {
    token,
    visitor: {
      _id: visitor._id,
      id: visitor._id,
      name: visitor.name,
      email: visitor.email,
      phone: visitor.phone,
      purpose: visitor.purpose,
      photo: visitor.photo,
      status: visitor.status,
    },
  }
}

// Login visitor
export const loginVisitorService = async (email, password) => {
  const sanitizedEmail = email ? email.toLowerCase().trim() : ""
  const visitor = await Visitor.findOne({ email: sanitizedEmail })
  if (!visitor) {
    throw new Error(MESSAGES.VISITOR_NOT_FOUND)
  }

  const isMatch = await bcrypt.compare(password, visitor.password)
  if (!isMatch) {
    throw new Error(MESSAGES.LOGIN_FAILED)
  }

  const token = makeToken(visitor._id)

  return {
    token,
    visitor: {
      _id: visitor._id,
      id: visitor._id,
      name: visitor.name,
      email: visitor.email,
      phone: visitor.phone,
      purpose: visitor.purpose,
      photo: visitor.photo,
      status: visitor.status,
    },
  }
}

// Get visitor profile
export const getVisitorProfileService = async (visitorId) => {
  const visitor = await Visitor.findById(visitorId).select("-password")
  if (!visitor) {
    throw new Error(MESSAGES.VISITOR_NOT_FOUND)
  }
  return visitor
}

// Request appointment by visitor
export const requestAppointmentService = async ({ visitorId, preferredDate, purpose, message }) => {
  const reqDate = new Date(preferredDate)
  if (reqDate < new Date()) {
    throw new Error("Date must be in the future")
  }

  const visitor = await Visitor.findById(visitorId)
  if (!visitor) {
    throw new Error("Visitor not found")
  }

  const existingRequest = await Appointment.findOne({ visitor: visitorId, status: "requested" })
  if (existingRequest) {
    throw new Error("You already have a pending request")
  }

  const appointment = await Appointment.create({
    visitor: visitorId,
    preferredDate: reqDate,
    status: "requested",
    requestedByVisitor: true,
    purpose,
    message: message || "",
    date: null,
    host: null,
  })

  visitor.status = "requested"
  await visitor.save()

  return appointment
}

// Get appointment requests for visitor
export const getMyRequestsService = async (visitorId) => {
  return await Appointment.find({ visitor: visitorId, requestedByVisitor: true })
    .populate("host", "name email")
    .sort({ createdAt: -1 })
}

