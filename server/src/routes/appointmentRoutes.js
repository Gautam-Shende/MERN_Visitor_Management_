
import express from "express"
import {
  approveAppointment,
  rejectAppointment,
  getAppointments,
  getAppointmentById,
  getRequestedAppointments,
  convertRequestToAppointment,
} from "../controllers/appointment/appointmentController.js"
import { protect } from "../middleware/authMiddleware.js"
import { authorizeRoles } from "../middleware/roleMiddleware.js"

const router = express.Router()

router.get("/api/appointments/requested", protect, authorizeRoles("employee", "admin"), getRequestedAppointments)
router.put("/api/appointments/:id/convert", protect, authorizeRoles("employee", "admin"), convertRequestToAppointment)

router.get("/api/appointments", protect, authorizeRoles("admin", "employee"), getAppointments)
router.get("/api/appointments/:id", protect, getAppointmentById)
router.put("/api/appointments/approve/:id", protect, authorizeRoles("admin", "employee"), approveAppointment)
router.put("/api/appointments/reject/:id", protect, authorizeRoles("admin", "employee"), rejectAppointment)


export default router