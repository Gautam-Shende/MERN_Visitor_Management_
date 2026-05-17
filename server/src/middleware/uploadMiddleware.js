
import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import cloudinary from "../config/Cloudinary/cloudinary.js"
import { FILE_UPLOAD, HTTP_STATUS } from "../../constants.js"


// .env variables files data
//  CLOUD_NAME=cloudinary_cloud_name
//   CLOUD_API_KEY=cloudinary_api_key
//   CLOUD_API_SECRET=cloudinary_api_secret
//
// How to test with Postman:
//   POST http://localhost:4000/api/visitor/register
//   Body → form-data
//   Add field: name=photo, Type=File, Value=<choose an image file>
//   Add other fields: name, email, password, phone, purpose (all Type=Text)
//   Send — check MongoDB for the visitor record with a photo URL

// genrate new cloudinary storage or folder for new user
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "visitor-photos",
    allowed_formats: FILE_UPLOAD.ALLOWED_FORMATS,
    transformation: [
      { width: 500, height: 500, crop: "limit" }
    ],
  }),
});

// this is for allowing only images file not for any pdf or etc
const fileFilter = ( req, file, cb) => {
  const isValidType = ["image/jpeg", "image/jpg", "image/png"].includes(
    file.mimetype
  );
  
  // checking the type of uploaded image
  if (!isValidType) {
    return cb(
      new Error("Invalid file type. Only JPG, JPEG, PNG allowed."),
      false
    );
  }
  cb(null, true);
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: FILE_UPLOAD.MAX_SIZE, 
  },
})

// functions for upload single photo upload on field named "photo"
export const uploadSingle = upload.single("photo");

// handle any error occuring in this upload process
export const handleUploadError = (err, req, res, next) => {
  if (!err) return next();

  console.error("Upload error:", err);

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: `File too large. Max allowed: ${
          FILE_UPLOAD.MAX_SIZE / 1024 / 1024
        }MB`,
      });
    }

    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: err.message });
  }

  return res.status(HTTP_STATUS.BAD_REQUEST).json({
    message: err.message || "File upload failed",
  })
}