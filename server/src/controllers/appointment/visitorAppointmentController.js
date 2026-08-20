
import * as visitorAppointmentService from "../../services/appointment/visitorAppointmentService.js"
import { HTTP_STATUS, MESSAGES } from "../../../constants.js"

// Get appointments for authenticated visitor controller
export const getMyAppointments = async (req, res) => {
  const visitorId = req.visitor?._id
  if (!visitorId) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MESSAGES.VISITOR_NOT_FOUND })
  }

  try {
    const appointments = await visitorAppointmentService.getVisitorAppointmentsService(visitorId)
    return res.status(HTTP_STATUS.OK).json(appointments)
  } catch (err) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.APPOINTMENT_NOT_FETCHED })
  }
}

// Get dashboard stats for authenticated visitor controller
export const getVisitorDashboard = async (req, res) => {
  const visitorId = req.visitor?._id
  if (!visitorId) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MESSAGES.VISITOR_NOT_FOUND })
  }

  try {
    const stats = await visitorAppointmentService.getVisitorDashboardService(visitorId)
    return res.status(HTTP_STATUS.OK).json(stats)
  } catch (err) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.DASHBOARD_ERROR })
  }
}

// Get passes for authenticated visitor controller
export const getMyPasses = async (req, res) => {
  const visitorId = req.visitor?._id

  if (!visitorId) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MESSAGES.VISITOR_NOT_FOUND })
  }

  try {
    const passes = await visitorAppointmentService.getVisitorPassesService(visitorId)
    return res.status(HTTP_STATUS.OK).json(passes)
  } catch (err) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.PASS_NOT_FETCHED })
  }
}

// Get pass by appointment ID controller
export const getPassByAppointment = async (req, res) => {
  const visitorId = req.visitor?._id
  const { appointmentId } = req.params

  if (!visitorId) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MESSAGES.VISITOR_NOT_FOUND })
  }

  if (!appointmentId) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: MESSAGES.APPOINTMENT_ID_ERROR })
  }

  try {
    const pass = await visitorAppointmentService.getVisitorPassByAppointmentService(visitorId, appointmentId)
    return res.status(HTTP_STATUS.OK).json(pass)
  } catch (err) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.PASS_NOT_FETCHED })
  }
}

