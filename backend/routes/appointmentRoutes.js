import express from "express"
import {
  createAppointment,
  approveAppointment,
  rejectAppointment,
  getAppointments,
  getAppointmentById,
  getRequestedAppointments,
  getRequestedAppointmentsCount,
  convertRequestToAppointment ,
  adminApprove,
  adminReject,
  getPendingAppointments
} from "../controllers/appointmentController.js"
import { protect } from "../middleware/authMiddleware.js"
import { authorizeRoles } from "../middleware/roleMiddleware.js"

const router = express.Router();

// ============ SPECIFIC ROUTES PEHLE (JO :id USE NAHI KARTE) ============

// Employee - Get requested appointments (SPECIFIC - pehle likho)
router.get("/api/appointments/requested",
  protect,
  authorizeRoles("employee", "admin"),
  getRequestedAppointments
)

// Employee - Get count for badge (SPECIFIC - pehle likho)
router.get("/api/appointments/requested/count",
  protect,
  authorizeRoles("employee", "admin"),
  getRequestedAppointmentsCount
)

// Employee - Convert request to appointment (SPECIFIC - pehle likho)
router.put("/api/appointments/:id/convert",
  protect,
  authorizeRoles("employee", "admin"),
  convertRequestToAppointment
)

// ============ GENERAL ROUTES BAAD ME (JO :id USE KARTE HAIN) ============

// Get all appointments
router.get("/api/appointments", 
  protect, 
  authorizeRoles("admin", "employee"), 
  getAppointments
)

// Get appointment by ID (GENERAL - baad me likho)
router.get("/api/appointments/:id", 
  protect,
  getAppointmentById
)

// Create appointment
router.post("/api/appointments", 
  protect, 
  authorizeRoles("admin", "employee"),
  createAppointment
)

// Approve appointment
router.put("/api/appointments/approve/:id", 
  protect,
  authorizeRoles("admin", "employee"), 
  approveAppointment
)

// Reject appointment
router.put("/api/appointments/reject/:id", 
  protect, 
  authorizeRoles("admin", "employee"),
  rejectAppointment
)

// ============ ADMIN ROUTES ============

// Get pending appointments for admin review
router.get("/api/admin/appointments/pending",
  protect,
  authorizeRoles("admin"),
  getPendingAppointments
)

// Admin approves appointment
router.put("/api/admin/appointments/:id/approve",
  protect,
  authorizeRoles("admin"),
  adminApprove
)

// Admin rejects appointment
router.put("/api/admin/appointments/:id/reject",
  protect,
  authorizeRoles("admin"),
  adminReject
)

export default router