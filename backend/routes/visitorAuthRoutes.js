
import express from "express"

// import { authorizeRoles } from "../middleware/roleMiddleware.js"
import { upload } from "../middleware/uploadMiddleware.js";

import {
  registerVisitor,loginVisitor,getVisitorProfile,
  updateVisitorProfile,
  requestAppointment,      // NEW
  getMyRequests       
} from "../controllers/visitorAuthController.js"

import {
  getMyAppointments, getVisitorDashboard,getMyPasses,
  getPassByAppointment,
} from "../controllers/visitorAppointmentController.js"

import { protectVisitor } from "../middleware/visitorAuthMiddleware.js"

const router = express.Router();

// router.post("/api/visitor/register", upload.single("photo"),authorizeRole("visitor"), registerVisitor)

router.post("/api/visitor/register", 
  upload.single("photo"), registerVisitor)

router.post("/api/visitor/login", 
  loginVisitor)

router.get("/api/visitor/profile", protectVisitor, 
  getVisitorProfile)

// Visitor submits appointment request
router.post("/api/visitor/appointments/request",
  protectVisitor,
  requestAppointment
)

// Visitor gets their requests
router.get("/api/visitor/appointments/requests",
  protectVisitor,
  getMyRequests
)


// router.post("/api/visitor/profile", 
//   upload.single("photo"), updateVisitorProfile)

router.put("/api/visitor/profile", 
  upload.single("photo"), updateVisitorProfile)

router.get("/api/visitor/dashboard", protectVisitor, 
  getVisitorDashboard)

router.get("/api/visitor/appointments", protectVisitor,
   getMyAppointments)

router.get("/api/visitor/passes", protectVisitor, 
  getMyPasses)

router.get("/api/visitor/pass/:appointmentId", protectVisitor, getPassByAppointment)

export default router;