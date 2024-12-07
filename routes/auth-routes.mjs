import express from "express";
import passport from "passport";
import { handleValidationErrors } from "../middlewares/handle-validation.mjs";
import { googleAuth, googleAuthCallback, login, register } from "../controllers/auth-controller.mjs";
import { loginValidator, registerValidator } from "../validators/auth-validator.mjs";


 const authRoutes = express.Router()


authRoutes.post('/register', registerValidator, handleValidationErrors, register)

authRoutes.post('/login', loginValidator, handleValidationErrors, login)

authRoutes.get("/google", googleAuth);
authRoutes.get("/google/callback", googleAuthCallback);


 export default authRoutes