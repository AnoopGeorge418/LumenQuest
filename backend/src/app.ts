import { Hono } from 'hono';
import authRoutes from './modules/auth/routes/auth.routes';
import { errorHandler } from './middlewares/errorHandler.middleare';

export const app = new Hono();

// All LumenQuest Routes
app.route("/api/auth", authRoutes) // Auth Routes

// Global Middlewares
app.onError(errorHandler)  // Error handler

