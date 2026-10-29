import { Router } from "express";
import {createAccommodation,getAllAccommodations,
    getAccommodationById,updateAccommodation,
    deleteAccommodation
} from "../controllers/accommodationController";
import { protect, adminOnly } from "../middleware/authMiddleware";

const router = Router();

router.get("/", getAllAccommodations);
router.get("/:id", getAccommodationById);

router.post("/", protect, adminOnly, createAccommodation);
router.put("/:id", protect, adminOnly, updateAccommodation);
router.delete("/:id", protect, adminOnly, deleteAccommodation);

export default router;
