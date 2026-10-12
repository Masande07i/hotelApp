import { Router } from "express";
import {createAccommodation,
    getAllAccommodations,
    getAccommodationById
} from "../controllers/accommodationController";

const router = Router();

router.post("/", createAccommodation);
router.get("/", getAllAccommodations);
router.get("/:id", getAccommodationById);

export default router;
