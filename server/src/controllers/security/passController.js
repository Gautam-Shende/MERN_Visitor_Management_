
import { HTTP_STATUS, MESSAGES } from "../../../constants.js"
import * as passService from "../../services/security/passService.js"

// Generate Pass Controller
export const generatePass = async (req, res) => {
  const { id } = req.params

  if (!id) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: MESSAGES.APPOINTMENT_ID_ERROR })
  }

  try {
    const pass = await passService.generatePass(id)
    return res.status(HTTP_STATUS.CREATED).json({ message: MESSAGES.PASS_GENERATED, pass })
  } catch (err) {
    if (err.message === MESSAGES.APPOINTMENT_NOT_FOUND) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: err.message })
    }
    if (err.message === MESSAGES.APPOINTMENT_NOT_APPROVED) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Appointment not approved" })
    }
    if (err.message === MESSAGES.PASS_ALREADY_EXISTS) {
      return res.status(HTTP_STATUS.CONFLICT).json({ message: MESSAGES.PASS_ALREADY_EXISTS })
    }

    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.SERVER_ERROR })
  }
}

// Scan Pass Controller
export const scanPass = async (req, res) => {
  const { qrData } = req.body

  if (!qrData) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: MESSAGES.PASS_QR_REQUIRED })
  }

  try {
    const result = await passService.scanPass(qrData)
    return res.status(HTTP_STATUS.OK).json(result)
  } catch (err) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message || MESSAGES.PASS_QR_INVALID })
  }
}

// Get All Passes Controller
export const getPasses = async (req, res) => {
  try {
    const passes = await passService.getAllPasses()
    return res.status(HTTP_STATUS.OK).json(passes)
  } catch (err) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.PASS_NOT_FETCHED })
  }
}

// Get Pass By ID Controller
export const getPassById = async (req, res) => {
  const { id } = req.params

  if (!id) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: MESSAGES.PASS_ID_REQUIRED })
  }

  try {
    const pass = await passService.getPassById(id)

    if (!pass) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: MESSAGES.PASS_NOT_FOUND })
    }

    return res.status(HTTP_STATUS.OK).json(pass)
  } catch (err) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({ message: MESSAGES.PASS_NOT_FOUND })
  }
}

// Get Check Logs By Pass ID Controller
export const getCheckLogsByPassId = async (req, res) => {
  const { passId } = req.params

  if (!passId) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: MESSAGES.PASS_ID_REQUIRED })
  }

  try {
    const logs = await passService.getCheckLogsByPassId(passId)
    return res.status(HTTP_STATUS.OK).json(logs)
  } catch (err) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.PASS_NOT_FETCHED })
  }
}

