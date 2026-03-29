import mongoose from "mongoose"


const appointmentSchema = new mongoose.Schema(
  {
    visitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Visitor",
      required: true,
    },
    host: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "admin",
    //   required: true,
    // },
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      // required: false,
    },
  },
  { timestamps: true },
)

export default mongoose.model("Appointment", appointmentSchema);
