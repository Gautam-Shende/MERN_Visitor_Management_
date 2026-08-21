import Appointment from "../models/Appointment.js"
import Visitor from "../models/Visitor.js"
import Pass from "../models/Pass.js"
import emailService from "../utils/emailService.js"
import { HTTP_STATUS, MESSAGES, APPOINTMENT_STATUS } from "../constants.js"

// Fetch all appointments (Admin / Employee)
export const getAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find()
      .populate("visitor")
      .populate("host", "name email")
      .sort({ createdAt: -1 })

    const passes = await Pass.find().select("appointment")
    const passSet = new Set(passes.map((p) => p.appointment.toString()))

    const result = appointments.map((a) => ({
      ...a.toObject(),
      passGenerated: passSet.has(a._id.toString()),
    }))

    return res.status(HTTP_STATUS.OK).json(result)
  } catch (error) {
    next(error)
  }
}

// Get single appointment by ID
export const getAppointmentById = async (req, res, next) => {
  try {
    const { id } = req.params
    const appointment = await Appointment.findById(id)
      .populate("visitor")
      .populate("host", "name email")

    if (!appointment) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: MESSAGES.APPOINTMENT_NOT_FOUND,
      })
    }

    return res.status(HTTP_STATUS.OK).json(appointment)
  } catch (error) {
    next(error)
  }
}

// Approve an appointment
export const approveAppointment = async (req, res, next) => {
  try {
    const { id } = req.params
    const appointment = await Appointment.findById(id)
      .populate("visitor")
      .populate("host", "name email")

    if (!appointment) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: MESSAGES.APPOINTMENT_NOT_FOUND,
      })
    }

    appointment.status = APPOINTMENT_STATUS.APPROVED
    await appointment.save()

    if (appointment.visitor) {
      await Visitor.findByIdAndUpdate(appointment.visitor._id, { status: "approved" })
    }

    try {
      await emailService.sendApproval({
        id: appointment._id,
        visitorName: appointment.visitor?.name,
        visitorEmail: appointment.visitor?.email,
        date: appointment.date,
        hostName: appointment.host?.name || "Admin",
        location: "Main Office",
      })
    } catch (err) {
      console.error("Approval email failed:", err.message)
    }

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.APPOINTMENT_APPROVED,
      appointment,
    })
  } catch (error) {
    next(error)
  }
}

// Reject an appointment
export const rejectAppointment = async (req, res, next) => {
  try {
    const { id } = req.params
    const appointment = await Appointment.findById(id)
      .populate("visitor")
      .populate("host", "name email")

    if (!appointment) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: MESSAGES.APPOINTMENT_NOT_FOUND,
      })
    }

    appointment.status = APPOINTMENT_STATUS.REJECTED
    await appointment.save()

    if (appointment.visitor) {
      await Visitor.findByIdAndUpdate(appointment.visitor._id, { status: "rejected" })
    }

    try {
      await emailService.sendRejection({
        visitorName: appointment.visitor?.name,
        visitorEmail: appointment.visitor?.email,
        date: appointment.date,
        reason: "Appointment rejected by admin",
      })
    } catch (err) {
      console.error("Rejection email failed:", err.message)
    }

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: MESSAGES.APPOINTMENT_REJECTED,
      appointment,
    })
  } catch (error) {
    next(error)
  }
}

// Get all appointments with status 'requested'
export const getRequestedAppointments = async (req, res, next) => {
  try {
    const requests = await Appointment.find({ status: APPOINTMENT_STATUS.REQUESTED })
      .populate("visitor", "name email phone photo")
      .sort({ createdAt: -1 })

    return res.status(HTTP_STATUS.OK).json(requests)
  } catch (error) {
    next(error)
  }
}

// Convert visitor request into a scheduled appointment
export const convertRequestToAppointment = async (req, res, next) => {
  try {
    const { id } = req.params
    const { date, hostId } = req.body

    const request = await Appointment.findById(id)
      .populate("visitor")
      .populate("host", "name email")

    if (!request) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: "Request not found",
      })
    }

    if (request.status !== APPOINTMENT_STATUS.REQUESTED) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "This request has already been processed",
      })
    }

    const employeeId = req.user._id
    request.status = APPOINTMENT_STATUS.PENDING
    request.date = new Date(date)
    request.host = hostId || employeeId
    request.scheduledBy = employeeId
    request.scheduledAt = new Date()

    await request.save()
    await request.populate("visitor", "name email phone")
    await request.populate("host", "name email")

    if (request.visitor) {
      await Visitor.findByIdAndUpdate(request.visitor._id, { status: "pending" })
    }

    try {
      await emailService.sendAppointmentCreated({
        id: request._id,
        visitorName: request.visitor?.name,
        visitorEmail: request.visitor?.email,
        date: request.date,
        hostName: request.host?.name || "To be assigned",
        location: "Main Office",
        message: request.message || "Your appointment has been scheduled. Waiting for admin approval.",
      })
    } catch (err) {
      console.error("Schedule email failed:", err.message)
    }

    return res.status(HTTP_STATUS.OK).json(request)
  } catch (error) {
    next(error)
  }
}

// Visitor: Request an appointment
export const requestAppointment = async (req, res, next) => {
  try {
    const visitorId = req.visitor._id
    const { preferredDate, purpose, message } = req.body

    const reqDate = new Date(preferredDate)
    if (reqDate < new Date()) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "Date must be in the future",
      })
    }

    const visitor = await Visitor.findById(visitorId)
    if (!visitor) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        success: false,
        message: MESSAGES.VISITOR_NOT_FOUND,
      })
    }

    const existingRequest = await Appointment.findOne({ visitor: visitorId, status: APPOINTMENT_STATUS.REQUESTED })
    if (existingRequest) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: "You already have a pending appointment request",
      })
    }

    const appointment = await Appointment.create({
      visitor: visitorId,
      preferredDate: reqDate,
      status: APPOINTMENT_STATUS.REQUESTED,
      requestedByVisitor: true,
      purpose: purpose || "Meeting",
      message: message || "",
      date: null,
      host: null,
    })

    visitor.status = "requested"
    await visitor.save()

    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: MESSAGES.APPOINTMENT_REQUEST_SUCCESS,
      appointment,
    })
  } catch (error) {
    next(error)
  }
}

// Visitor: Get my appointment requests
export const getMyRequests = async (req, res, next) => {
  try {
    const visitorId = req.visitor._id
    const requests = await Appointment.find({ visitor: visitorId, requestedByVisitor: true })
      .populate("host", "name email")
      .sort({ createdAt: -1 })

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data: requests,
    })
  } catch (error) {
    next(error)
  }
}

// Visitor: Get my appointments
export const getMyAppointments = async (req, res, next) => {
  try {
    const visitorId = req.visitor._id
    const appointments = await Appointment.find({ visitor: visitorId })
      .populate("host", "name email")
      .sort({ createdAt: -1 })

    const passes = await Pass.find({ visitor: visitorId }).select("appointment")
    const passSet = new Set(passes.map((p) => p.appointment.toString()))

    const result = appointments.map((a) => ({
      ...a.toObject(),
      passGenerated: passSet.has(a._id.toString()),
    }))

    return res.status(HTTP_STATUS.OK).json(result)
  } catch (error) {
    next(error)
  }
}
