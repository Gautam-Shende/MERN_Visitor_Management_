import mongoose from "mongoose"
import { VISITOR_STATUS } from "../../constants.js"

const visitorSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Name is required"],
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, "Email is required"], 
    unique: true,
    lowercase: true,
    trim: true 
  },
  phone: { 
    type: String, 
    required: [true, "Phone number is required"] 
  },
  purpose: { 
    type: String, 
    required: [true, "Purpose is required"] 
  },
  host: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  },
  photo: { 
    type: String,
    default: null 
  },
  status: { 
    type: String, 
    enum: [VISITOR_STATUS.PENDING, VISITOR_STATUS.APPROVED, VISITOR_STATUS.REJECTED, VISITOR_STATUS.REQUESTED],
    default: VISITOR_STATUS.PENDING 
  },
  password: { 
    type: String, 
    required: [true, "Password is required"] 
  },
}, { 
  timestamps: true 
})

export default mongoose.model("Visitor", visitorSchema)