import { Router } from "express";
import { createCategory, deteleCategory, getAllCategory, getCategoryById, updateCategory } from "../controllers/CategoryController.mjs";
import { hasRole } from "../middlewares/has-role-middleware.mjs";
import { isAuthenticated } from "../middlewares/auth-middleware.mjs";

const categoryRoutesV2 = Router()

// Ambil semua kategori
categoryRoutesV2.get('/', getAllCategory)

// Ambil kategori by ID
categoryRoutesV2.get('/:id', getCategoryById)

// Buat Kategori Baru
categoryRoutesV2.post('/', isAuthenticated, hasRole(['admin']),createCategory)

// Update category
categoryRoutesV2.put('/:id', isAuthenticated, hasRole(['admin']),updateCategory)

// Delete Category
categoryRoutesV2.delete('/:id', isAuthenticated, hasRole(['admin']),deteleCategory)

export default categoryRoutesV2