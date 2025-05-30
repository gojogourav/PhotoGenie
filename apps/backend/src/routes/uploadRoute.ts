import { Router } from "express";
import upload from "../middleware/multer";
import uploadController from "../controllers/uplodController";
const router = Router();
router.post('/upload',upload.single('image'),uploadController);

export default router;