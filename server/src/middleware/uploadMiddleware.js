
import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import cloudinary from "../config/Cloudinary/cloudinary.js"
import { FILE_UPLOAD, HTTP_STATUS } from "../../constants.js"


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


const fileFilter = ( file, cb) => {
  const isValidType = ["image/jpeg", "image/jpg", "image/png"].includes(
    file.mimetype
  );

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


export const uploadSingle = upload.single("photo");


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