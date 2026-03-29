
import express from "express"

import { getVisitors,
  getVisitorById,
} from "../controllers/visitorController.js"

// import Visitor from "../models/Visitor.js"
import { protect } from "../middleware/authMiddleware.js"
import { authorizeRoles } from "../middleware/roleMiddleware.js"
//
// import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// router.post("/api/visitors",
//   protect,
//   authorizeRoles("admin", "employee"), upload.single("photo"),
//   createVisitor
// )

// router.post("/api/visitors", protect,
//   authorizeRoles("admin", "employee"), getVisitors
// )

router.get("/api/visitors", protect,
  authorizeRoles("admin", "employee"), getVisitors
)

router.get("/api/visitors/:id",
  protect, authorizeRoles("admin", "employee"),
  getVisitorById
)


export default router;