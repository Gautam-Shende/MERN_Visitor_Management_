
import express from "express"

//
import {
  createAppointment, approveAppointment, rejectAppointment,
  getAppointments,
  getAppointmentById,
} from "../controllers/appointmentController.js"

// import { roleMiddleware } from "../middleware/roleMiddleware.js"

import { protect } from "../middleware/authMiddleware.js"
import { authorizeRoles } from "../middleware/roleMiddleware.js"

const router = express.Router();

// router.put("/api/appointments", 
//   protect, authorizeRoles("admin", "employee"),
//    createAppointment)

router.post("/api/appointments", 
  protect, authorizeRoles("admin", "employee"),
   createAppointment)

   //
router.get("/api/appointments", protect, 
  authorizeRoles("admin", "employee"), 
  getAppointments)

router.put("/api/appointments/approve/:id", protect,
  authorizeRoles("admin", "employee"), 
  approveAppointment)

router.put("/api/appointments/reject/:id", 
  protect, authorizeRoles("admin", "employee"),
   rejectAppointment)

// router.get("/api/appointments/:id", protect,authorizeRole("admin", "employee")
//    getAppointmentById)

router.get("/api/appointments/:id", protect,
   getAppointmentById)

export default router