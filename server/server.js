
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
// import { fileURLToPath } from 'url';
import { HTTP_STATUS, MESSAGES } from "./constants.js"


dotenv.config()

const app = express()
connectDB()

app.use(cors())
// app.use(cors({
//   origin: process.env.FRONTEND_URL, 
//   credentials: true
// }))

app.use(express.json())

app.use("/", authRoutes)
app.use("/", visitorAuthRoutes)
app.use("/", appointmentRoutes)
app.use("/", visitorRoutes)
app.use("/", passRoutes)
app.use("/", dashboardRoutes)
app.use("/", reportRoutes)
app.use("/", exportRoutes)
app.use("/", userRoutes)

// app.use((req, res) => {
//   res.status(HTTP_STATUS.BAD_REQUEST).json({ error: `Route ${req.originalUrl} not found` })
// })

// app.use((err, req, res, next) => {
//   console.error("Server Error:", err.message)
//   res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: MESSAGES.SERVER_ERROR })
// })

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`)
})