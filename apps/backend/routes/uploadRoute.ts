import { Router } from "express";
import upload from "../middleware/multer";
import { uploadImage } from "../controllers/uplodController";

const router = Router();
router.post('/upload',upload.single('image'),uploadImage);

export default router;