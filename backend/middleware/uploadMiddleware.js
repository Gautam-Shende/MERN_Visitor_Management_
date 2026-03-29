
import multer from "multer"
// import emailservice from "../services/emailservices.js"

import { CloudinaryStorage } from "multer-storage-cloudinary"
//
import cloudinary from "../utils/cloudinary.js"

const storage = new CloudinaryStorage({

  cloudinary,
  params: async (req, file) => {
    const timestamp = Date.now();
    const folder = `visitors/${timestamp}`
    
    if (file.mimetype === "application/pdf") {
      return {
        folder: `${folder}/pdf`,
        // resource_type: "pdftext",
        // format: "text",
        resource_type: "raw",
        format: "pdf",
        public_id: `pass_${timestamp}`,
      }
    }

    return {
      folder: `${folder}/photo`,
      allowed_formats: ["jpg", "jpeg", "png"],
      public_id: `photo_${timestamp}`,
    }
  },
})

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "application/pdf"]

  // if (!allowed.includes(file.mimetype)) {
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {

    // console.log(file)
    cb(new Error(`File type not allowed: ${file.mimetype}`), false);
  }
}

// const limits = { fileSize: 3 * 1024  }
const limits = { fileSize: 5 * 1024 * 1024 }

export const upload = multer({ storage, fileFilter, limits });