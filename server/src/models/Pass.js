import mongoose from "mongoose"
import { PASS_STATUS } from "../../constants.js"

const passSchema = new mongoose.Schema({
  visitor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Visitor",
    required: [true, "Visitor is required"],
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: [true, "Appointment is required"],
  },
  qrCode: { 
    type: String,
    default: null 
  },
  qrPublicId: { 
    type: String,
    default: null 
  },
  pdfPath: { 
    type: String,
    default: null 
  },
  pdfPublicId: { 
    type: String,
    default: null 
  },
  status: {
    type: String,
    enum: [PASS_STATUS.ACTIVE, PASS_STATUS.INSIDE, PASS_STATUS.EXPIRED],
    default: PASS_STATUS.ACTIVE,
  },
}, { 
  timestamps: true 
})


export default mongoose.model("Pass", passSchema)