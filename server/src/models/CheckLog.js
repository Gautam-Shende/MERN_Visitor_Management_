import mongoose from "mongoose"

const checkLogSchema = new mongoose.Schema({
  pass: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Pass", 
    required: [true, "Pass is required"],
  },
  checkInTime: { 
    type: Date,
    default: null 
  },
  checkOutTime: { 
    type: Date,
    default: null 
  },
}, { 
  timestamps: true 
})


export default mongoose.model("CheckLog", checkLogSchema)