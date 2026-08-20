
import { HTTP_STATUS, MESSAGES } from "../../../constants.js"
import * as visitorService from "../../services/auth/visitorService.js"

// Get all visitors controller
export const getVisitors = async (req, res) => {
  try {
    const visitors = await visitorService.getAllVisitors()
    return res.status(HTTP_STATUS.OK).json(visitors)
  } catch (err) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.VISITOR_NOT_FOUND })
  }
}

// Get visitor by ID controller
export const getVisitorById = async (req, res) => {
  const { id } = req.params

  if (!id) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: MESSAGES.VISITOR_ID_REQUIRED })
  }

  try {
    const visitor = await visitorService.getVisitorById(id)

    if (!visitor) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: MESSAGES.VISITOR_NOT_FOUND })
    }
    return res.status(HTTP_STATUS.OK).json(visitor)
  } catch (err) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({ message: MESSAGES.VISITOR_NOT_FOUND })
  }
}

