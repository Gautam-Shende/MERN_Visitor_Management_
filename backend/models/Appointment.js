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
      required: false,
    },
    date: {
      type: Date,
      required: false,
    },
    preferredDate: {
      type: Date,
      required: false,
    },
    status: {
      type: String,
      enum: ["requested", "pending", "scheduled", "approved", "rejected", "cancelled"],
      default: "pending",
    },
    requestedByVisitor: {
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
    rejectionReason: {
      type: String,
    }
  },
  { timestamps: true }
)

export default mongoose.model("Appointment", appointmentSchema)