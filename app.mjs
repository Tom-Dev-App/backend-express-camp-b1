import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import categoryRoutes from './routes/categoryRoutes.mjs'
import productRoutes from './routes/productRoutes.mjs'
import categoryRoutesV2 from './routes/categoryRoutesV2.mjs'
import path from 'path'
import cookieParser from 'cookie-parser'
import expressSession from 'express-session'
import passport from 'passport'
import 'dotenv/config'
import configurePassport from './config/passport.mjs'
import authRoutes from './routes/auth-routes.mjs'


const app = express()
const PORT = 8000

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(morgan('dev'))



// CONFIGURE CORS
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5173/*"],
  credentials: true,
  methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
  allowedHeaders: "Authorization, Content-Type",
}))

app.options("*", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", [
    "http://localhost:5173",
    "http://localhost:5173/*",
  ]);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
})
app.use(cookieParser())
app.use(expressSession({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: false,
    maxAge: 60 * 60 * 1000 //dalam ms
  }
}))

app.use(
  passport.session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
)
app.use(passport.initialize());
app.use(passport.session());
configurePassport(passport);


// ROUTING
app.get('/', (req, res, next) => {
  // res.json({data: `Hello World`})
  res.send('Hello World')
})

// static routes
app.use("/public", express.static(path.join(process.cwd(), "public")));
app.use('/auth', authRoutes)
// Routing wrapping dengan app.use entry point domain/api/v1/categories/
app.use('/api/v1/categories', categoryRoutes)
app.use('/api/v2/categories', categoryRoutesV2)

app.use('/api/v1/products', productRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT} http://localhost:${PORT}/`)
})