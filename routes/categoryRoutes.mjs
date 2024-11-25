import { Router } from "express";
import { createCategory, deteleCategory, getAllCategory, getCategoryById, updateCategory } from "../controllers/CategoryController.mjs";

const categoryRoutes = Router()

// Ambil semua kategori
categoryRoutes.get('/', getAllCategory)

// Ambil kategori by ID
categoryRoutes.get('/:id', getCategoryById)

// Buat Kategori Baru
categoryRoutes.post('/', createCategory)

// Update category
categoryRoutes.put('/:id', updateCategory)

// Delete Category
categoryRoutes.delete('/:id', deteleCategory)

export default categoryRoutes