
import QRCode from "qrcode"
import dotenv from "dotenv"

// import {storage} from "../middleware/uploadMiddleware.js"
import cloudinary from "../config/Cloudinary/cloudinary.js"

dotenv.config()

const generateQRCode = async (passId) => {
  const qrBuffer = await QRCode.toBuffer(`PASS:${passId}`, {
    width: 300,
    margin: 2,
    color: { dark: "#000000", light: "#ffffff" },
  })

  const dataURI = `data:image/png;base64,${qrBuffer.toString("base64")}`

  // console.log(dataURI) // checked
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
