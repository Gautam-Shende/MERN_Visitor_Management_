
import QRCode from "qrcode"
import dotenv from "dotenv"

// import {storage} from "../middleware/uploadMiddleware.js"
import cloudinary from "../config/Cloudinary/cloudinary.js"

dotenv.config()

// This function Genrate a QR code for pass with the help of passID, 
// and uploads it to cloudinary
const generateQRCode = async (passId) => {
  // first genrate qr code , and data
  const qrBuffer = await QRCode.toBuffer(`PASS:${passId}`, {
    width: 300,
    margin: 2,
    color: { dark: "#000000", light: "#ffffff" },
  })
  // console check pass ID
  // console.log(`QR buffer generated for pass: ${passId}`)

  // second convert buffer to base64 data URI for safe uploading in Cloudinary upload
  const base64Image = qrBuffer.toString('base64')
  const dataURI = `data:image/png;base64,${base64Image}`
  // console.log(dataURI) // checked

  // finally upload on cloudinary...
  const result = await cloudinary.uploader.upload(dataURI, {
    folder: "visitor-passes/qrcodes",
    public_id: `qr_${passId}`,
    overwrite: true,
  })

  return {
    qrCodeDataURL: result.secure_url,
    cloudinaryUrl: result.secure_url,
    cloudinaryPublicId: result.public_id,
  }
}

export default generateQRCode
