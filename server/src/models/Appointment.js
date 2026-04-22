
import mongoose from "mongoose"
import { APPOINTMENT_STATUS } from "../../constants.js"

const appointmentSchema = new mongoose.Schema({
  visitor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Visitor",
    required: [true, "Visitor is required"],
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  date: {
    type: Date,
  },
  preferredDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: Object.values(APPOINTMENT_STATUS),
    default: APPOINTMENT_STATUS.PENDING,
  },
  requestedByVisitor: {
    type: Boolean,
    default: false,
  },
  purpose: {
    type: String,
    default: "Meeting..."
  },
  message: {
    type: String,
    default: ""
  },
  scheduledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  scheduledAt: {
    type: Date,
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  approvedAt: {
    type: Date,
  },
}, { 
  timestamps: true 
})


export default mongoose.model("Appointment", appointmentSchema)