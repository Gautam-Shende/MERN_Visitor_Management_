import express from "express"
import {
  approveAppointment,
  rejectAppointment,
  getAppointments,
  getAppointmentById,
  getRequestedAppointments,
  convertRequestToAppointment,
} from "../controllers/appointmentController.js"
import { protect } from "../middleware/authMiddleware.js"
import { authorizeRoles } from "../middleware/roleMiddleware.js"

const router = express.Router()

router.get("/requested", protect, authorizeRoles("employee", "admin"), getRequestedAppointments)
router.put("/:id/convert", protect, authorizeRoles("employee", "admin"), convertRequestToAppointment)

router.get("/", protect, authorizeRoles("admin", "employee"), getAppointments)
router.get("/:id", protect, getAppointmentById)
router.put("/approve/:id", protect, authorizeRoles("admin", "employee"), approveAppointment)
router.put("/reject/:id", protect, authorizeRoles("admin", "employee"), rejectAppointment)

export default router