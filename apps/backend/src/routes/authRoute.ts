import { Router } from "express";
import { rateLimiterMiddleware } from "../middleware/rateLimiting";
import { loginController, registerController } from "../controllers/authController";
import { authMiddleware } from "../middleware/auth";

const authRoute = Router();

authRoute.post('/register',rateLimiterMiddleware,registerController)
authRoute.post('/login',rateLimiterMiddleware,loginController)


export default authRoute;