// backend/models/Appointment.js
import mongoose from "mongoose"

const appointmentSchema = new mongoose.Schema(
  {
    visitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Visitor",
      required: true,
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,  // Visitor request mein host nahi hoga
    },
    date: {
      type: Date,
      required: false,  // Visitor request mein date nahi hogi
    },
    preferredDate: {     // NEW - Visitor ki preferred date
      type: Date,
      required: false,
    },
    status: {
      type: String,
      enum: ["requested", "pending", "approved", "rejected"],
      default: "pending",
    },
    requestedByVisitor: {  // NEW - Request hai ya direct appointment
      type: Boolean,
      default: false,
    },
    purpose: {
      type: String,
      default: "General Visit"
    },
    message: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
)

export default mongoose.model("Appointment", appointmentSchema)