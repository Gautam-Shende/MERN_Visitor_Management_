import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    phone: { type: String, required: true },
    purpose: { type: String, required: true },

    // host: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    // photo: { type: String, required: true },

    host: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    photo: { type: String },

    status: { type: String, enum: ["pending", "approved", "rejected"],
       default: "pending" },

    // password: { type: Number, required: true },
    password: { type: String, required: true },

  },
  { timestamps: true }
)

export default mongoose.model("Visitor", visitorSchema);