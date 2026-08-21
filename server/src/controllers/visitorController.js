import Visitor from "../models/Visitor.js"
import { HTTP_STATUS, MESSAGES } from "../constants.js"

// Get all visitors (Admin / Employee)
export const getVisitors = async (req, res, next) => {
  try {
    const { limit, sort } = req.query
    let query = Visitor.find().select("-password")

    if (sort) {
      query = query.sort(sort)
    } else {
      query = query.sort({ createdAt: -1 })
    }

    if (limit) {
      query = query.limit(parseInt(limit, 10))
    }

    const visitors = await query
    return res.status(HTTP_STATUS.OK).json(visitors)
  } catch (error) {
    next(error)
  }
}

// Get single visitor by ID
export const getVisitorById = async (req, res, next) => {
  try {
    const { id } = req.params
    const visitor = await Visitor.findById(id).select("-password")

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
