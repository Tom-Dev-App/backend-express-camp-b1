import { Router } from "express";
import { createProduct, getAllProducts, getProduct, getProductBySlug } from "../controllers/ProductController.mjs";
import fileUpload from "express-fileupload";
import { productValidationSchema } from "../validators/product-validator.mjs";
import { handleValidationErrors } from "../middlewares/handle-validation.mjs";
import { uploadFile } from "../middlewares/upload-middleware.mjs";


const productRoutes = Router()
productRoutes.use(fileUpload())

productRoutes.get('/', getAllProducts)
productRoutes.get('/:id', getProduct)
productRoutes.get('/slug/:slug', getProductBySlug)
productRoutes.post('/',  productValidationSchema,
  handleValidationErrors,
  uploadFile,createProduct)



export default productRoutes