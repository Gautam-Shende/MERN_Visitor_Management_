import express from "express"
import { upload } from "../middleware/uploadMiddleware.js"
import {
  registerVisitor,
  loginVisitor,
  getVisitorProfile,
} from "../controllers/authController.js"
import {
  requestAppointment,
  getMyRequests,
  getMyAppointments,
} from "../controllers/appointmentController.js"
import { getVisitorDashboard } from "../controllers/dashboardController.js"
import {
  getMyPasses,
  getPassByAppointment,
} from "../controllers/passController.js"
import { protectVisitor } from "../middleware/visitorAuthMiddleware.js"

const router = express.Router()

router.post("/register", upload.single("photo"), registerVisitor)
router.post("/login", loginVisitor)

router.get("/dashboard", protectVisitor, getVisitorDashboard)
router.get("/profile", protectVisitor, getVisitorProfile)

router.get("/appointments", protectVisitor, getMyAppointments)
router.post("/appointments/request", protectVisitor, requestAppointment)
router.get("/appointments/requests", protectVisitor, getMyRequests)

router.get("/passes", protectVisitor, getMyPasses)
router.get("/pass/:appointmentId", protectVisitor, getPassByAppointment)

export default router