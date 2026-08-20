
import express from "express"
import { upload } from "../middleware/uploadMiddleware.js"
import {
  registerVisitor,
  loginVisitor,
  getVisitorProfile,
  requestAppointment,
  getMyRequests,
} from "../controllers/auth/visitorAuthController.js"
import {
  getMyAppointments,
  getVisitorDashboard,
  getMyPasses,
  getPassByAppointment,
} from "../controllers/appointment/visitorAppointmentController.js"
import { protectVisitor } from "../middleware/visitorAuthMiddleware.js"

const router = express.Router()

router.post("/api/visitor/register", upload.single("photo"), registerVisitor)
router.post("/api/visitor/login", loginVisitor)

router.get("/api/visitor/dashboard", protectVisitor, getVisitorDashboard)
router.get("/api/visitor/profile", protectVisitor, getVisitorProfile)

router.get("/api/visitor/appointments", protectVisitor, getMyAppointments)

router.post("/api/visitor/appointments/request", protectVisitor, requestAppointment)
router.get("/api/visitor/appointments/requests", protectVisitor, getMyRequests)

router.get("/api/visitor/passes", protectVisitor, getMyPasses)
router.get("/api/visitor/pass/:appointmentId", protectVisitor, getPassByAppointment)

export default router