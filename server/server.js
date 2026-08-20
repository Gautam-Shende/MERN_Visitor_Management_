
import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./src/config/database/db.js"

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
connectDB()

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
)

app.use(express.json())

// Mount routes
app.use("/", authRoutes)
app.use("/", visitorAuthRoutes)
app.use("/", appointmentRoutes)
app.use("/", visitorRoutes)
app.use("/", passRoutes)
app.use("/", dashboardRoutes)
app.use("/", reportRoutes)
app.use("/", exportRoutes)
app.use("/", userRoutes)

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`)
})