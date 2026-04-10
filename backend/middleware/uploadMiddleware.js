import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import cloudinary from "../src/utils/cloudinary.js"

// Simple storage config - student style
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "visitor-photos",
    allowed_formats: ["jpg", "jpeg", "png"]
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true)
  } else {
    cb(new Error("Only JPEG/PNG images allowed"), false)
  }
}

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
})