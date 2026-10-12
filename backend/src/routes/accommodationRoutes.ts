import { Router } from "express";
import {createAccommodation, updateAccommodation,
    getAllAccommodations,deleteAccommodation,
    getAccommodationById
} from "../controllers/accommodationController";

const router = Router();

router.post("/", createAccommodation);
router.get("/", getAllAccommodations);
router.get("/:id", getAccommodationById);
router.put("/:id", updateAccommodation);
router.delete("/:id", deleteAccommodation);

export default router;
