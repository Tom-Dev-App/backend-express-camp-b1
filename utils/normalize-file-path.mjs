import path from "path";

const normalizeFilePath = (filePath) => {
  return path.normalize(filePath); // Normalize path separators
};

export default normalizeFilePath;
