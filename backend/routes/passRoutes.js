
import express from "express"
// import { authorizeRoles } from "../middleware/roleMiddleware.js"

import {
  generatePass, scanPass, getPasses, getPassById,
  getCheckLogsByPassId,
} from "../controllers/passController.js"

import { protect } from "../middleware/authMiddleware.js"

const router = express.Router();

// router.get("/api/pass/scan", protect, scanPass)

router.post("/api/pass/scan", protect, scanPass)
router.post("/api/pass/:id", protect, generatePass)

// router.post("/:id", protect, generatePass)

router.post("/api/pass/:id", protect,
   generatePass)

router.get("/api/pass", 
  protect, getPasses)

router.get("/api/pass/:id",
   protect, getPassById)

// router.post("/api/pass/:passId/checklogs", 
//   protect, getCheckLogsByPassId)
router.get("/api/pass/:passId/checklogs", 
  protect, getCheckLogsByPassId)

  

export default router;