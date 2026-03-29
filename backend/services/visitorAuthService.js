
import Visitor from "../models/Visitor.js"
import bcrypt from "bcryptjs"
//
import jwt from "jsonwebtoken"
// import { sendEmail } from "../utils/emailService.js";
import emailService from "../utils/emailService.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" })
}

export const registerVisitorService = async (visitorData, file) => {
  const { name, email, phone, purpose, password } = visitorData

  const existingVisitor = await Visitor.findOne({ email })
 
  if (existingVisitor) {
    // console.log("Visitor already registered with email:", email)
    throw new Error("Visitor already registered with this email")
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  let photoUrl = null
  if (file) {
    photoUrl = file.path
    // console.log("Photo uploaded successfully:", photoUrl)
  }

  const visitor = await Visitor.create({
    name,
    email,
    phone,
    purpose,
    password: hashedPassword,
    photo: photoUrl,
    status: "pending",
  })

   // email message
   await emailService.sendRegistration({
        name: visitor.name,
        email: visitor.email,
        id: visitor._id
    });

  const token = generateToken(visitor._id)

  return {
    token,
    visitor: {
      id: visitor._id,
      name: visitor.name,
      email: visitor.email,
      phone: visitor.phone,
      purpose: visitor.purpose,
      photo: visitor.photo,
      status: visitor.status,
      role: "visitor",
      createdAt: visitor.createdAt,
    },
  }
}

export const loginVisitorService = async (email, password) => {
  
  const visitor = await Visitor.findOne({ email })
  if (!visitor) {
    // console.log("Login failed - email not found:", email)
    throw new Error("Invalid email or password")
  }

  const isMatch = await bcrypt.compare(password, visitor.password)
  
  if (!isMatch) {
    // console.log("Login failed - incorrect password for email:", email)
    throw new Error("Invalid email or password")
  }

  const token = generateToken(visitor._id)

  return {
    token,
    visitor: {
      id: visitor._id,
      name: visitor.name,
      email: visitor.email,
      phone: visitor.phone,
      purpose: visitor.purpose,
      photo: visitor.photo,
      status: visitor.status,
      role: "visitor",
    },
  }
}

export const getVisitorProfileService = async (visitorId) => {

  const visitor = await Visitor.findById(visitorId).select("-password")

  if (!visitor) {
    // console.log("Visitor profile not found for ID:", visitorId)
    throw new Error("Visitor not found")
  }
  return visitor
}

export const updateVisitorProfileService = async (visitorId, updateData, file) => {

  const visitor = await Visitor.findById(visitorId)
  
  if (!visitor) {
    // console.log("Visitor not found for update....", visitorId)
    throw new Error("Visitor not found")
  }

  if (updateData.name) visitor.name = updateData.name
  if (updateData.phone) visitor.phone = updateData.phone
  if (file) {
    visitor.photo = file.path
    // console.log("Updated visitor photo:", file.path)
  }

  await visitor.save()
  // console.log("Visitor profile updated successfully for ID:", visitorId)

  return {
    id: visitor._id,
    name: visitor.name,
    email: visitor.email,
    phone: visitor.phone,
    photo: visitor.photo,
  }
}