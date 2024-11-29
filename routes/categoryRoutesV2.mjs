import { Router } from "express";
import { createCategory, deteleCategory, getAllCategory, getCategoryById, updateCategory } from "../controllers/CategoryController.mjs";

const categoryRoutesV2 = Router()

// Ambil semua kategori
categoryRoutesV2.get('/', getAllCategory)

// Ambil kategori by ID
categoryRoutesV2.get('/:id', getCategoryById)

// Buat Kategori Baru
categoryRoutesV2.post('/', createCategory)

// Update category
categoryRoutesV2.put('/:id', updateCategory)

// Delete Category
categoryRoutesV2.delete('/:id', deteleCategory)

export default categoryRoutesV2