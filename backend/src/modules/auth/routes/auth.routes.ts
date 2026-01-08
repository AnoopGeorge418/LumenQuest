import { Hono } from "hono";
import { authSignUpController } from "../controllers/signup.controller";
import { authSignInController } from "../controllers/signin.controller";
import { authResetPasswordController } from "../controllers/resetPassword.controller";

const authRoutes = new Hono();

// Auth Routes API

// POST /signup -> Create user account
authRoutes.post("/signup", authSignUpController)

// POST /signin -> Authenticates user
authRoutes.post("/signin", authSignInController)

// POST /reset-password -> Resets user password
authRoutes.post("/reset-password", authResetPasswordController)

export default authRoutes
