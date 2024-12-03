import { Router } from "express";
import { createCategory, deteleCategory, getAllCategory, getCategoryById, updateCategory } from "../controllers/CategoryController.mjs";
import {isAuthenticated} from '../middlewares/auth-middleware.mjs'
import {hasRole} from '../middlewares/has-role-middleware.mjs'
const categoryRoutes = Router()

// Ambil semua kategori
categoryRoutes.get('/', getAllCategory)

// Ambil kategori by ID
categoryRoutes.get('/:id', getCategoryById)

// Buat Kategori Baru
categoryRoutes.post('/', isAuthenticated, hasRole(['admin']),createCategory)

// Update category
categoryRoutes.put('/:id', isAuthenticated, hasRole(['admin']),updateCategory)

// Delete Category
categoryRoutes.delete('/:id', isAuthenticated, hasRole(['admin']), deteleCategory)

export default categoryRoutes