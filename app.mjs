import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import categoryRoutes from './routes/categoryRoutes.mjs'
import productRoutes from './routes/productRoutes.mjs'
import categoryRoutesV2 from './routes/categoryRoutesV2.mjs'
import path from 'path'

const app = express()
const PORT = 5000

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors({ 
  origin: '*'
}))
app.use(morgan('dev'))

// ROUTING
app.get('/', (req, res, next) => {
  // res.json({data: `Hello World`})
  res.send('Hello World')
})

// static routes
app.use("/public", express.static(path.join(process.cwd(), "public")));

// Routing wrapping dengan app.use entry point domain/api/v1/categories/
app.use('/api/v1/categories', categoryRoutes)
app.use('/api/v2/categories', categoryRoutesV2)

app.use('/api/v1/products', productRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT} http://localhost:${PORT}/`)
})