import { checkSchema } from "express-validator";
import database from "../config/database.mjs";

export const productValidationSchema = checkSchema({
  slug: {
    in: ["body"],
    isString: {
      errorMessage: "Slug must be a string.",
    },
    notEmpty: {
      errorMessage: "Slug is required.",
    },
    custom: {
      options: async (value, { req }) => {
        const { id } = req.params || {};
        const query = id
          ? `SELECT id FROM products WHERE slug = ? AND id != ?`
          : `SELECT id FROM products WHERE slug = ?`;
        const params = id ? [value, id] : [value];

        const [existingProduct] = await database.query(query, params);

        if (existingProduct.length > 0) {
          throw new Error("Slug must be unique.");
        }
      },
      errorMessage: "Slug must be unique.",
    },
  },
  name: {
    in: ["body"],
    isString: {
      errorMessage: "Name must be a string.",
    },
    notEmpty: {
      errorMessage: "Name is required.",
    },
    trim: true,
  },
  category_id: {
    in: ["body"],
    notEmpty: {
      errorMessage: "Category ID is required.",
    },
    isString: {
      errorMessage: "Category ID must be a string.",
    },
    custom: {
      options: async (value) => {
        const [category] = await database.query(
          `SELECT id FROM categories WHERE id = ?`,
          [value]
        );
        if (category.length === 0) {
          throw new Error("Invalid category ID.");
        }
      },
      errorMessage: "Invalid category ID.",
    },
  },
  price: {
    in: ["body"],
    isFloat: {
      options: { min: 0 },
      errorMessage: "Price must be a positive number.",
    },
    toFloat: true,
  },
  stock: {
    in: ["body"],
    isInt: {
      options: { min: 0 },
      errorMessage: "Stock must be a non-negative integer.",
    },
    toInt: true,
  },
  description: {
    in: ["body"],
    optional: true,
    isString: {
      errorMessage: "Description must be a string.",
    },
  },
});

export const photoValidationSchema = checkSchema({
  image: {
    in: ["files"],
    custom: {
      options: (file) => !!file,
      errorMessage: "Image file is required.",
    },
    customSanitizer: {
      options: (file) => file, // Pass file directly for further processing
    },
  },
});
