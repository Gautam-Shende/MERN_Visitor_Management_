
import * as appointmentService from "../../services/appointment/appointmentService.js"
import { HTTP_STATUS, MESSAGES } from "../../../constants.js"

// Approve appointment controller
export const approveAppointment = async (req, res) => {
  const { id } = req.params

  if (!id) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: MESSAGES.APPOINTMENT_ID_ERROR })
  }

  try {
    const appointment = await appointmentService.approveAppointment(id)

    if (!appointment) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: MESSAGES.APPOINTMENT_NOT_FOUND })
    }
    return res.status(HTTP_STATUS.OK).json(appointment)
  } catch (err) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.APPOINTMENT_NOT_APPROVED })
  }
}

// Reject appointment controller
export const rejectAppointment = async (req, res) => {
  const { id } = req.params

  if (!id) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: MESSAGES.APPOINTMENT_ID_ERROR })
  }

  try {
    const appointment = await appointmentService.rejectAppointment(id)

    if (!appointment) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: MESSAGES.APPOINTMENT_NOT_FOUND })
    }

    return res.status(HTTP_STATUS.OK).json(appointment)
  } catch (err) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.APPOINTMENT_NOT_REJECTED })
  }
}

// Get all appointments controller
export const getAppointments = async (req, res) => {
  try {
    const appointments = await appointmentService.getAllAppointments()
    return res.status(HTTP_STATUS.OK).json(appointments)
  } catch (err) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.APPOINTMENT_NOT_FOUND })
  }
}

// Get appointment by ID controller
export const getAppointmentById = async (req, res) => {
  const { id } = req.params

  if (!id) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: MESSAGES.APPOINTMENT_ID_ERROR })
  }

  try {
    const appointment = await appointmentService.getAppointmentById(id)
    if (!appointment) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: MESSAGES.APPOINTMENT_NOT_FOUND })
    }
    return res.status(HTTP_STATUS.OK).json(appointment)
  } catch (err) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({ message: MESSAGES.APPOINTMENT_NOT_FOUND })
  }
}

// Get requested appointments controller
export const getRequestedAppointments = async (req, res) => {
  try {
    const requests = await appointmentService.getRequestedAppointmentsService()
    return res.status(HTTP_STATUS.OK).json({ success: true, data: requests })
  } catch (err) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to fetch requests" })
  }
}

// Convert visitor request to scheduled appointment controller
export const convertRequestToAppointment = async (req, res) => {
  const { id } = req.params
  const { date, hostId } = req.body
  const employeeId = req.user?._id

  if (!date) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: "Appointment date is required" })
  }

  try {
    const appointment = await appointmentService.convertRequestToAppointmentService(
      id,
      employeeId,
      { date, hostId }
    )
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.APPOINTMENT_CONFIRMED,
      data: appointment,
    })
  } catch (err) {
    if (err.message === "Request not found") {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: err.message })
    }
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, message: err.message || "Failed to confirm appointment" })
  }
}

