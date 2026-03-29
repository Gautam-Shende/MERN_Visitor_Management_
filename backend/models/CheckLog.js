import mongoose from "mongoose"

const checkLogSchema = new mongoose.Schema(
  {
    pass: { 
      type: mongoose.Schema.Types.ObjectId, ref: "Pass", 
      required: true },

    // checkInTime: 
    // { type: String },

    checkInTime: 
    { type: Date },

    checkOutTime: 
    { type: Date },
  },

  { timestamps: true },

)

export default mongoose.model("CheckLog", checkLogSchema)
