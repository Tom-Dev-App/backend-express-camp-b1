import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join("public", "images");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = crypto.randomBytes(16).toString("hex") + ext; // Generating unique name
    req.uploadedFileName = uniqueName;
    req.uploadedFilePath = path.join("public", "images", uniqueName); // Full path for saving
    cb(null, uniqueName);
  },
});

// File Filter
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /png|jpg|jpeg/;
  const extName = allowedExtensions.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = allowedExtensions.test(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PNG, JPG, and JPEG are allowed."));
  }
};

// Set upload constraints
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Middleware for file upload
export const multerUpload = upload.single("image");

// Helper to delete a file
export const deleteFile = (filePath) => {
  if (!filePath) {
    console.warn("File path is undefined or null. Skipping deletion.");
    return;
  }

  // Normalize the path to resolve relative paths to absolute paths
  const absolutePath = path.resolve(__dirname, "..", filePath); // Go up one level from __dirname, then resolve the path

  if (fs.existsSync(absolutePath)) {
    try {
      fs.unlinkSync(absolutePath); // Delete the file synchronously
      console.log(`File deleted: ${absolutePath}`);
    } catch (err) {
      console.error(`Error deleting file: ${err.message}`);
    }
  } else {
    console.warn(`File not found: ${absolutePath}`);
  }
};
