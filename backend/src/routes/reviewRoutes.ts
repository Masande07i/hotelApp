import { Router } from "express";
import {getAccommodationReviews,addReview,editReview,
    removeReview
} from "../controllers/reviewController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/:accommodation_id", getAccommodationReviews);
router.post("/:accommodation_id", protect, addReview);
router.put("/:accommodation_id", protect, editReview);
router.delete("/:accommodation_id", protect, removeReview);

export default router;