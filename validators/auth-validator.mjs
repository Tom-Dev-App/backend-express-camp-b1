import { checkSchema } from "express-validator";
import database from "../config/database.mjs";

export const registerValidator = checkSchema({
  fullname: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Fullname required.",
    },
    trim: true,
    isLength: {
      options: { min: 3, max: 128 },
      errorMessage: "Fullname should be at least 3 up to 128 characters.",
    },
  },

  email: {
    isEmail: {
      errorMessage: "Must be valid email.",
    },
    trim: true,
    isLength: {
      options: { max: 255 },
      errorMessage: "Email not more than 255 characters.",
    },
    notEmpty: {
      errorMessage: "Email required.",
    },
    custom: {
      options: async (value) => {
        const [rows] = await database.query(
          "SELECT * FROM users WHERE email = ?",
          [value]
        );
        if (rows.length > 0) {
          throw new Error("Email already in use.");
        }
      },
      errorMessage: "Email is not valid.",
    },
  },

  password: {
    notEmpty: {
      errorMessage: `Password required.`,
    },
    isLength: {
      options: { min: 6, max: 70 },
      errorMessage: `Password at least 6 up to 70 characters`,
    },
  },
});

export const loginValidator = checkSchema({
  email: {
    isEmail: {
      errorMessage: "Must be valid email.",
    },
    trim: true,
    isLength: {
      options: { max: 255 },
      errorMessage: "Email not more than 255 characters.",
    },
    notEmpty: {
      errorMessage: "Email required.",
    },
    custom: {
      options: async (value) => {
        const [rows] = await database.query(
          "SELECT * FROM users WHERE email = ?",
          [value]
        );
        if (rows.length === 0) {
          throw new Error("Email not registered.");
        }
      },
      errorMessage: "Password or Email is not valid",
    },
  },

  password: {
    notEmpty: {
      errorMessage: `Password required.`,
    },
    isLength: {
      options: { min: 6, max: 70 },
      errorMessage: `Password at least 6 up to 70 characters`,
    },
  },
});
