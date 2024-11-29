import { validationResult } from "express-validator";

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "bad request",
      message: "Validation errors occurred.",
      err_code: "VALIDATION_ERROR",
      errors: errors.array().map((error) => ({
        field: error.param,
        message: error.msg,
        location: error.location, // "body", "query", "params", "headers", etc.
        path: error.path || `${error.location}.${error.param}`, // Including a path for clarity
      })),
    });
  }
  next();
};
