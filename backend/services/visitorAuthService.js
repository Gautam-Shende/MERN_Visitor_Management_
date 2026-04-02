import Visitor from "../models/Visitor.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const generateToken = (id) => {
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
      status: visitor.status
    }
  }
}

export const loginVisitorService = async (email, password) => {
  const visitor = await Visitor.findOne({ email })
  
  if (!visitor) {
    throw new Error("Invalid email or password")
  }
  
  const isMatch = await bcrypt.compare(password, visitor.password)
  
  if (!isMatch) {
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
      status: visitor.status
    }
  }
}

export const getVisitorProfileService = async (visitorId) => {
  const visitor = await Visitor.findById(visitorId).select("-password")
  
  if (!visitor) {
    throw new Error("Visitor not found")
  }
  
  return visitor
}

export const updateVisitorProfileService = async (visitorId, updateData, file) => {
  const visitor = await Visitor.findById(visitorId)
  
  if (!visitor) {
    throw new Error("Visitor not found")
  }
  
  if (updateData.name) visitor.name = updateData.name
  if (updateData.phone) visitor.phone = updateData.phone
  if (file) visitor.photo = file.path
  
  await visitor.save()
  
  return {
    id: visitor._id,
    name: visitor.name,
    email: visitor.email,
    phone: visitor.phone,
    photo: visitor.photo
  }
}