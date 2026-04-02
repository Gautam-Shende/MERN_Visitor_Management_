import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db.js"

import authRoutes from "./routes/authRoutes.js"
import visitorRoutes from "./routes/visitorRoutes.js"
import appointmentRoutes from "./routes/appointmentRoutes.js"
import passRoutes from "./routes/passRoutes.js"
import dashboardRoutes from "./routes/dashboardRoutes.js"
import reportRoutes from "./routes/reportRoutes.js"
import exportRoutes from "./routes/exportRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import visitorAuthRoutes from "./routes/visitorAuthRoutes.js"

dotenv.config()

const app = express()

// app.use(cors())
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json())

connectDB()

// Routes
app.use("/", authRoutes)
app.use("/", visitorRoutes)
app.use("/", appointmentRoutes)
app.use("/", passRoutes)
app.use("/", dashboardRoutes)
app.use("/", reportRoutes)
app.use("/", exportRoutes)
app.use("/", userRoutes)
app.use("/", visitorAuthRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})