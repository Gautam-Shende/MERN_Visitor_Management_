import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./src/config/database/db.js"

// Import Routes
import authRoutes from "./src/routes/authRoutes.js"
import visitorRoutes from "./src/routes/visitorRoutes.js"
import appointmentRoutes from "./src/routes/appointmentRoutes.js"
import passRoutes from "./src/routes/passRoutes.js"
import dashboardRoutes from "./src/routes/dashboardRoutes.js"
import reportRoutes from "./src/routes/reportRoutes.js"
import exportRoutes from "./src/routes/exportRoutes.js"
import userRoutes from "./src/routes/userRoutes.js"
import visitorAuthRoutes from "./src/routes/visitorAuthRoutes.js"

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Connect to Database
connectDB()

app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));

// Routes (all routes already have /api prefix in their files)
app.use("/", authRoutes)
app.use("/", visitorAuthRoutes)
app.use("/", appointmentRoutes)
app.use("/", visitorRoutes)
app.use("/", passRoutes)
app.use("/", dashboardRoutes)
app.use("/", reportRoutes)
app.use("/", exportRoutes)
app.use("/", userRoutes)

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` })
})

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message)
  res.status(500).json({ error: "Internal server error" })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📁 Environment: ${process.env.NODE_ENV || "development"}`)
})