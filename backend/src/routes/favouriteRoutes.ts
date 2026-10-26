import { Router } from "express";
import {getFavourites,addFavourite,removeFavourite} from "../controllers/favouriteController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/", protect, getFavourites);
router.post("/:accommodation_id", protect, addFavourite);
router.delete("/:accommodation_id", protect, removeFavourite);

export default router;