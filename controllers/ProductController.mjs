import database from "../config/database.mjs";
import { deleteFile } from "../middlewares/upload-middleware.mjs";
import path from "path";
import normalizeFilePath from "../utils/normalize-file-path.mjs";

export const getAllProducts = async (req, res) => {
  try {
    const [products] = await database.query(`
      SELECT 
           p.*, 
           c.name AS category_name, 
           c.slug AS category_slug,
           i.image_url AS product_image_url,
           i.image_path AS product_image_path
         FROM products p
         LEFT JOIN categories c ON p.category_id = c.id
         LEFT JOIN images i ON p.id = i.product_id
         
    `);
    res.status(200).json({
      status: "success",
      data: { products },
      message: "Products fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: "Cannot fetch products",
      err_code: "CANT_GET_PRODUCTS",
    });
  }
};

export const getProductBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const [product] = await database.query(
      `SELECT 
           p.*, 
           c.name AS category_name, 
           c.slug AS category_slug,
           i.image_url AS product_image_url,
           i.image_path AS product_image_path
         FROM products p
         LEFT JOIN categories c ON p.category_id = c.id
         LEFT JOIN images i ON p.id = i.product_id
         WHERE p.slug = ?`,
      [slug]
    );

    // Check if the product exists
    if (product.length === 0) {
      return res.status(404).json({
        status: "not found",
        data: { product: null },
        message: "Product not found",
      });
    }

    // Respond with product details
    res.status(200).json({
      status: "success",
      data: { product: product[0] },
      message: "Product fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: "Error fetching product",
      err_code: "CANT_GET_PRODUCT",
    });

    throw new Error("CANNOT FETCH PRODUCT: " + error.message);
  }
};

export const getProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const [product] = await database.query(
      `SELECT 
             p.*, 
             c.name AS category_name, 
             c.slug AS category_slug,
             i.image_url AS product_image_url,
             i.image_path AS product_image_path
           FROM products p
           LEFT JOIN categories c ON p.category_id = c.id
           LEFT JOIN images i ON p.id = i.product_id
           WHERE p.id = ?`,
      [id]
    );

    // Check if the product exists
    if (product.length === 0) {
      return res.status(404).json({
        status: "not found",
        data: { product: null },
        message: "Product not found",
      });
    }

    // Respond with product details
    res.status(200).json({
      status: "success",
      data: { product: product[0] },
      message: "Product fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: "Error fetching product",
      err_code: "CANT_GET_PRODUCT",
    });

    throw new Error("CANNOT FETCH PRODUCT: " + error.message);
  }
};

export const createProduct = async (req, res) => {
  const { slug, name, category_id, price, stock, description } = req.body;

  try {
    const [existingProduct] = await database.query(
      "SELECT id FROM products WHERE slug = ?",
      [slug]
    );

    if (existingProduct.length > 0) {
      deleteFile(req.uploadedFilePath);
      return res.status(409).json({
        status: "conflict",
        message: "A product with this slug already exists",
        err_code: "CONFLICT_DUPLICATE",
      });
    }

    const [product] = await database.query(
      "INSERT INTO products (slug, name, category_id, price, stock, description) VALUES (?, ?, ?, ?, ?, ?)",
      [slug, name, category_id, price, stock, description]
    );

    if (req.uploadedFileName) {
      await database.query(
        "INSERT INTO images (product_id, image_url, image_path) VALUES (?, ?, ?)",
        [
          product.insertId,
          `/public/images/${req.uploadedFileName}`,
          req.uploadedFilePath,
        ]
      );
    }

    res.status(201).json({
      status: "success",
      data: { productId: product.insertId },
      message: "Product created successfully",
    });
  } catch (error) {
    deleteFile(req.uploadedFilePath);
    res.status(500).json({
      status: "error",
      message: "Error creating product",
      err_code: "SERVER_ERROR",
      error: error.message,
    });
  }
};

export const createProductMulter = async (req, res) => {
  const { slug, name, category_id, price, stock, description } = req.body;

  try {
    const [existingProduct] = await database.query(
      "SELECT id FROM products WHERE slug = ?",
      [slug]
    );

    if (existingProduct.length > 0) {
      deleteFile(req.uploadedFilePath);
      return res.status(409).json({
        status: "conflict",
        message: "A product with this slug already exists",
        err_code: "CONFLICT_DUPLICATE",
      });
    }

    const [product] = await database.query(
      "INSERT INTO products (slug, name, category_id, price, stock, description) VALUES (?, ?, ?, ?, ?, ?)",
      [slug, name, category_id, price, stock, description]
    );

    // Normalize the file path before inserting it into the database
    if (req.uploadedFileName) {
      const normalizedImagePath = normalizeFilePath(
        path.join("public", "images", req.uploadedFileName)
      );

      await database.query(
        "INSERT INTO images (product_id, image_url, image_path) VALUES (?, ?, ?)",
        [
          product.insertId,
          `/public/images/${req.uploadedFileName}`, // Image URL
          normalizedImagePath, // Normalized Image Path
        ]
      );
    }

    res.status(201).json({
      status: "success",
      data: { productId: product.insertId },
      message: "Product created successfully",
    });
  } catch (error) {
    deleteFile(req.uploadedFilePath);
    res.status(500).json({
      status: "error",
      message: "Error creating product",
      err_code: "SERVER_ERROR",
      error: error.message,
    });
  }
};