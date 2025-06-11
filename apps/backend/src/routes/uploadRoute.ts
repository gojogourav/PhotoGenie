import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import uploadController from "../controllers/uplodController";
import upload from "../middleware/multer";
const router = Router();
router.post('/',authMiddleware,upload.array("files",20),uploadController);
router.get('/photos',authMiddleware,uploadController)
router.delete('/photos/:id',authMiddleware,uploadController)

export default router;