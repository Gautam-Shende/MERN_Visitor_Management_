
import * as visitorAppointmentService from "../../services/appointment/visitorAppointmentService.js"
import { HTTP_STATUS, MESSAGES } from "../../../constants.js"


export const getMyAppointments = async (req, res) => {
  const visitorId = req.visitor?._id
  if (!visitorId) { 
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MESSAGES.VISITOR_NOT_FOUND});
  }

  try {
    const appointments = await visitorAppointmentService.getVisitorAppointmentsService(visitorId)
    return res.status(HTTP_STATUS.OK).json(appointments)
  } catch (err) {
    // console.log({error: MESSAGES.APPOINTMENT_NOT_FETCHED})
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.APPOINTMENT_NOT_FETCHED })
  }
}

export const getVisitorDashboard = async (req, res) => {
  const visitorId = req.visitor?._id
  if (!visitorId) { 
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MESSAGES.VISITOR_NOT_FOUND }); 
  }

  try {
    const stats = await visitorAppointmentService.getVisitorDashboardService(visitorId)
    return res.status(HTTP_STATUS.OK).json(stats)
  } catch (err) {
    // console.log({ error: MESSAGES.DASHBOARD_ERROR })
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.DASHBOARD_ERROR })
  }
}

export const getMyPasses = async (req, res) => {

  const visitorId = req.visitor?._id

  if (!visitorId) { 
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MESSAGES.VISITOR_NOT_FOUND });
  }

  try {
    const passes = await visitorAppointmentService.getVisitorPassesService(visitorId)
    return res.status(HTTP_STATUS.OK).json(passes)
  } catch (err) {
    // console.log({ error: MESSAGES.PASS_NOT_FETCHED })
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.PASS_NOT_FETCHED })
  }
}

export const getPassByAppointment = async (req, res) => {
  const visitorId = req.visitor?._id
  const { appointmentId } = req.params

  if (!visitorId) { 
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: MESSAGES.VISITOR_NOT_FOUND });
  }

  if (!appointmentId) { 
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: MESSAGES.APPOINTMENT_ID_ERRORR });
  }

  try {
    const pass = await visitorAppointmentService.getVisitorPassByAppointmentService(visitorId, appointmentId)
    return res.status(HTTP_STATUS.OK).json(pass);
    
  } catch (err) {
    // console.log({ error: MESSAGES.PASS_NOT_FETCHED })
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.PASS_NOT_FETCHED })
  }
}
