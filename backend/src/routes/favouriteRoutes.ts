import { Router } from "express";
import {
    getFavourites, 
} from "../controllers/favouriteController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/", protect, getFavourites);


export default router;