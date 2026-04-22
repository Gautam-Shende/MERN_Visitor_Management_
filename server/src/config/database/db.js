
// MongoDB dataBase MERN_Visitor_management_System
import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "MERN_Visitor_Managment_System",
    })
    // console.log("Data Base Working Properly...")
    console.log("MongoDB Connected...")
  } catch (error) {
    console.error("DB-Error:", error.message)
    process.exit(1)
  }
}

export default connectDB