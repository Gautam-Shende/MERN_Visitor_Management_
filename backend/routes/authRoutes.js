
import express from "express"
//
import { loginUser } from "../controllers/authController.js"

const router = express.Router();

// router.post("/login", loginUser);
router.post("/api/auth/login", loginUser);

export default router;
