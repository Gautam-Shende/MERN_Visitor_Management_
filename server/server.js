import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./src/config/database/db.js"
import { errorHandler } from "./src/middleware/errorMiddleware.js"

// Route imports
import authRoutes from "./src/routes/authRoutes.js"
import visitorAuthRoutes from "./src/routes/visitorAuthRoutes.js"
import appointmentRoutes from "./src/routes/appointmentRoutes.js"
import visitorRoutes from "./src/routes/visitorRoutes.js"
import passRoutes from "./src/routes/passRoutes.js"
import dashboardRoutes from "./src/routes/dashboardRoutes.js"
import reportRoutes from "./src/routes/reportRoutes.js"
import exportRoutes from "./src/routes/exportRoutes.js"
import userRoutes from "./src/routes/userRoutes.js"

dotenv.config()

const app = express()

// Connect to MongoDB
connectDB()

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
)

// Body parser middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// API Routes Mounting
app.use("/api/auth", authRoutes)
app.use("/api/visitor", visitorAuthRoutes)
app.use("/api/visitors", visitorRoutes)
app.use("/api/appointments", appointmentRoutes)
app.use("/api/pass", passRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use("/api/reports", reportRoutes)
app.use("/api/export", exportRoutes)
app.use("/api/users", userRoutes)

// Centralized error handling middleware
app.use(errorHandler)

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`)
})
