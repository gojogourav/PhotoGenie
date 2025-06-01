import { Router } from "express";
import { rateLimiterMiddleware } from "../middleware/rateLimiting";
import { registerController } from "../controllers/authController";

const authRoute = Router();

authRoute.post('/register',rateLimiterMiddleware,registerController)


export default authRoute;