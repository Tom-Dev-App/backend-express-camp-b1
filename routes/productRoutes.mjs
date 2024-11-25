import { Router } from "express";
import { getAllProduct, getProductById, getProductBySlug } from "../controllers/ProductController.mjs";


const productRoutes = Router()

productRoutes.get('/', getAllProduct)
productRoutes.get('/:id', getProductById)
productRoutes.get('/slug/:slug', getProductBySlug)



export default productRoutes