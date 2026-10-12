import { Router } from "express";
import {createAccommodation, updateAccommodation,
    getAllAccommodations,
    getAccommodationById
} from "../controllers/accommodationController";

const router = Router();

router.post("/", createAccommodation);
router.get("/", getAllAccommodations);
router.get("/:id", getAccommodationById);
router.put("/:id", updateAccommodation);

export default router;
