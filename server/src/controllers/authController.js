import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import User from "../models/User.js"
import Visitor from "../models/Visitor.js"
import { HTTP_STATUS, MESSAGES } from "../constants.js"

// Helper function to sign JWT tokens
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" })
}

// User login controller (Admin, Employee, Security)
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: MESSAGES.LOGIN_ERROR,
      })
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: MESSAGES.LOGIN_FAILED,
      })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: MESSAGES.LOGIN_FAILED,
      })
    }

    const token = generateToken(user._id)

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      token,
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    next(error)
  }
}

// Get authenticated user profile
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password")
    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: MESSAGES.USER_NOT_FOUND,
      })
    }

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      user,
    })
  } catch (error) {
    next(error)
  }
}

// Register visitor controller
export const registerVisitor = async (req, res, next) => {
  try {
    const { name, email, phone, purpose, password } = req.body

    if (!name || !email || !phone || !purpose || !password) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: MESSAGES.VISITOR_REGISTER_ERROR,
      })
    }

    const existingVisitor = await Visitor.findOne({ email: email.toLowerCase().trim() })
    if (existingVisitor) {
      return res.status(HTTP_STATUS.CONFLICT).json({
        success: false,
        message: MESSAGES.EMAIL_EXISTS,
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const photoUrl = req.file ? req.file.path : null

    const visitor = new Visitor({
      name,
      email: email.toLowerCase().trim(),
      phone,
      purpose,
      password: hashedPassword,
      photo: photoUrl,
      status: "pending",
    })

    await visitor.save()
    const token = generateToken(visitor._id)

    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
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
    })
  } catch (error) {
    next(error)
  }
}

// Visitor login controller
export const loginVisitor = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: MESSAGES.LOGIN_ERROR,
      })
    }

    const visitor = await Visitor.findOne({ email: email.toLowerCase().trim() })
    if (!visitor) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: MESSAGES.VISITOR_NOT_FOUND,
      })
    }

    const isMatch = await bcrypt.compare(password, visitor.password)
    if (!isMatch) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        message: MESSAGES.LOGIN_FAILED,
      })
    }

    const token = generateToken(visitor._id)

    return res.status(HTTP_STATUS.OK).json({
      success: true,
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
    })
  } catch (error) {
    next(error)
  }
}

// Get visitor profile
export const getVisitorProfile = async (req, res, next) => {
  try {
    const visitor = await Visitor.findById(req.visitor._id).select("-password")
    if (!visitor) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: MESSAGES.VISITOR_NOT_FOUND,
      })
    }

    return res.status(HTTP_STATUS.OK).json(visitor)
  } catch (error) {
    next(error)
  }
}
