import database from "../config/database.mjs";

// Get all categories
export const getAllCategory = async (req, res) => {
  try {
    const [categories] = await database.query(
      "SELECT id, slug, name FROM categories"
    );
    res.json({
      status: "success",
      data: { categories },
      message: "Request success",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: "Something went wrong",
      err_code: "CANT_GET_CATEGORIES",
    });
    console.error("CANT QUERY CATEGORIES " + error.message);
  }
};

// Get a single category by ID
export const getCategory = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({
      status: "bad request",
      errors: { id: "Invalid ID. It must be a number." },
      err_code: "DATA_INVALID",
    });
  }

  try {
    const [category] = await database.query(
      "SELECT id, slug, name FROM categories WHERE id = ?",
      [id]
    );
    if (category.length === 0) {
      return res.status(404).json({
        status: "not found",
        data: { category: [] },
        message: "Category not found",
      });
    }

    res.json({
      status: "success",
      data: { category: category[0] },
      message: "Request success",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: "Something went wrong",
      err_code: "CANT_GET_CATEGORY",
    });
    console.error("CANT QUERY CATEGORY " + error.message);
  }
};

// Create a new category
export const createCategory = async (req, res) => {
  const { slug, name } = req.body;

  if (!slug || typeof slug !== "string" || slug.length < 3) {
    return res.status(400).json({
      status: "bad request",
      errors: {
        slug: "Slug is required and must be at least 3 characters long.",
      },
      err_code: "DATA_INVALID",
    });
  }

  if (!name || typeof name !== "string" || name.length < 3) {
    return res.status(400).json({
      status: "bad request",
      errors: {
        name: "Name is required and must be at least 3 characters long.",
      },
      err_code: "DATA_INVALID",
    });
  }

  try {
    const [existingSlug] = await database.query(
      "SELECT id FROM categories WHERE slug = ?",
      [slug]
    );
    if (existingSlug.length > 0) {
      return res.status(409).json({
        status: "conflict",
        error: "Slug already exists",
        err_code: "SLUG_CONFLICT",
      });
    }

    const [result] = await database.query(
      "INSERT INTO categories (slug, name) VALUES (?, ?)",
      [slug, name]
    );
    res.status(201).json({
      status: "success",
      data: { dataId: result.insertId },
      message: "Category created",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      err_code: "CANT_CREATE_CATEGORY",
    });
    console.error("COULDN'T CREATE CATEGORY " + error.message);
  }
};

// Update an existing category
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { slug, name } = req.body;

  if (!id || isNaN(id)) {
    return res.status(400).json({
      status: "bad request",
      errors: { id: "Invalid ID. It must be a number." },
      err_code: "DATA_INVALID",
    });
  }

  if (!slug || typeof slug !== "string" || slug.length < 3) {
    return res.status(400).json({
      status: "bad request",
      errors: {
        slug: "Slug is required and must be at least 3 characters long.",
      },
      err_code: "DATA_INVALID",
    });
  }

  if (!name || typeof name !== "string" || name.length < 3) {
    return res.status(400).json({
      status: "bad request",
      errors: {
        name: "Name is required and must be at least 3 characters long.",
      },
      err_code: "DATA_INVALID",
    });
  }

  try {
    const [existingSlug] = await database.query(
      "SELECT id FROM categories WHERE slug = ? AND id != ?",
      [slug, id]
    );
    if (existingSlug.length > 0) {
      return res.status(409).json({
        status: "conflict",
        error: "Slug already exists",
        err_code: "SLUG_CONFLICT",
      });
    }

    const [result] = await database.query(
      "UPDATE categories SET slug = ?, name = ? WHERE id = ?",
      [slug, name, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "not found",
        error: "Category not found",
        err_code: "NOT_FOUND",
      });
    }

    res.json({
      status: "success",
      message: "Category updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: "Something went wrong",
      err_code: "CANT_UPDATE_CATEGORY",
    });
    console.error("COULDN'T UPDATE CATEGORY " + error.message);
  }
};

// Delete a category
export const deleteCategory = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({
      status: "bad request",
      errors: { id: "Invalid ID. It must be a number." },
      err_code: "DATA_INVALID",
    });
  }

  try {
    const [result] = await database.query(
      "DELETE FROM categories WHERE id = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "not found",
        error: "Category not found",
        err_code: "NOT_FOUND",
      });
    }

    res.json({
      status: "success",
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: "Something went wrong",
      err_code: "CANT_DELETE_CATEGORY",
    });
    console.error("COULDN'T DELETE CATEGORY " + error.message);
  }
};
