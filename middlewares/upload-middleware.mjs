import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import crypto from "crypto"; // For generating unique filenames

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedExtensions = /png|jpg|jpeg/;
const maxSize = 5 * 1024 * 1024; // 5MB

export const uploadFile = (req, res, next) => {
  if (!req.files || !req.files.image) {
    return res.status(400).json({
      status: "bad request",
      message: "Image file is required",
      err_code: "FILE_MISSING",
    });
  }

  const { image } = req.files;
  const extName = path.extname(image.name).toLowerCase();
  const isValidExt = allowedExtensions.test(extName);
  const isValidMimeType = allowedExtensions.test(image.mimetype);

  if (!isValidExt || !isValidMimeType) {
    return res.status(422).json({
      status: "unprocessable entity",
      message: "Invalid file type. Only PNG, JPG, and JPEG are allowed",
      err_code: "INVALID_FILE_TYPE",
    });
  }

  if (image.size > maxSize) {
    return res.status(422).json({
      status: "unprocessable entity",
      message: "File size exceeds 5MB",
      err_code: "FILE_TOO_LARGE",
    });
  }

  // Generate a random filename with the original extension
  const randomName = crypto.randomBytes(16).toString("hex");
  const uniqueFileName = `${randomName}${extName}`;

  // Set the upload directory and file path
  const uploadDir = path.join(__dirname, "../public/images");
  const uploadPath = path.join(uploadDir, uniqueFileName);
  const normalizedRelativePath = path
    .relative(__dirname, uploadPath)
    .replace(/\\/g, "/");

  image.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500).json({
        status: "error",
        message: "Error uploading the file",
        err_code: "UPLOAD_FAILURE",
        error: err.message,
      });
    }
    req.uploadedFilePath = normalizedRelativePath;
    req.uploadedFileName = uniqueFileName;
    next();
  });
};

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
