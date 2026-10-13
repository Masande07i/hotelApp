import { Router } from "express";
import multer from "multer";
import { uploadImage } from "../controllers/accommodationImageController";
import { protect, adminOnly } from "../middleware/authMiddleware";

const router = Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, callback) => {
        if (["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
            callback(null, true);
        } else {
            callback(new Error("Only JPEG, PNG, and WebP images are allowed"));
        }
    }
});

router.post(
    "/:id/images",
    protect,
    adminOnly,
    upload.single("image"),
    uploadImage
);

export default router;
