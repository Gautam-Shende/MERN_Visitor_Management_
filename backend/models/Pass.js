import mongoose from "mongoose"

const passSchema = new mongoose.Schema(
  {
    visitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Visitor",
      // required
      required: true,
    },
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    // qrCode: { String },

    //  qrPublicId: { String },

    qrCode: { 
      type: String },

    qrPublicId: { type: String },

    pdfPath: { type: String },

    pdfPublicId: { type: String },


    // status: {
    //   type: String,
    //   enum: ["active",],
    //   default: "active",
    // },
    status: {
      type: String,
      enum: ["active", "inside", "expired"],
      default: "active",
    },
  },
  { timestamps: true },
)

export default mongoose.model("Pass", passSchema)
