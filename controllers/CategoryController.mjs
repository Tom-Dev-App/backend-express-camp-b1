import database from "../config/database.mjs";

export const getAllCategory = async (req, res, next) => {
  try {
    const [results] = await database.query(`SELECT id, slug, name FROM categories`)
    res.json({data: results})
  } catch (error) {
    console.log(`DB Error in get all category data` + error)
    next(error)
  }
}

export const getCategoryById = async(req, res, next) => {
  const {id} = req.params

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID. It must be a number." });
  }

  try {
    const [results] = await database.query("SELECT id, slug, name FROM categories WHERE id = ?", [id]);
    if (results.length === 0) {
        return res.status(404).json({ error: "Category not found" });
    }
    res.json(results[0]);
} catch (error) {
    console.error(error);
    next(error);
}
}

export const createCategory = async(req, res, next) => {
  const {slug, name} = req.body

  // VALIDASI SLUG DAN NAME
  if(!slug || typeof slug !== 'string' || slug.length < 3) {
    return res.status(400).json({ error: "Slug is required and must be at least 3 characters long." });
  }

  if (!name || typeof name !== "string" || name.length < 3) {
    return res.status(400).json({ error: "Name is required and must be at least 3 characters long." });
  }

  try {
    const [result] = await database.query("INSERT INTO categories (slug, name) VALUES (?, ?)", [slug, name]);
    res.status(201).json({ message: "Category created successfully", id: result.insertId });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

export const updateCategory = async(req, res, next) => {
    const { id } = req.params;
    const { slug, name } = req.body;

    // VALIDASI ID SLUG NAME
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID. It must be a number." });
    }

    if (!slug || typeof slug !== "string" || slug.length < 3) {
      return res.status(400).json({ error: "Slug is required and must be at least 3 characters long." });
    }

    if (!name || typeof name !== "string" || name.length < 3) {
      return res.status(400).json({ error: "Name is required and must be at least 3 characters long." });
    }

    try {
      const [result] = await database.query("UPDATE categories SET slug = ?, name = ? WHERE id = ?", [slug, name, id]);
      if (result.affectedRows === 0) {
          return res.status(404).json({ error: "Category not found" });
      }
      res.json({ message: "Category updated successfully" });
    } catch (error) {
      console.error(error);
      next(error);
  }
}

export const deteleCategory = async(req, res, next) => {
  const { id } = req.params;

  // Validasi ID
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID. It must be a number." });
  }

  try {
    const [result] = await database.query("DELETE FROM categories WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Category not found" });
    }
    
    res.json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error(error);
        next(error);
    }
}