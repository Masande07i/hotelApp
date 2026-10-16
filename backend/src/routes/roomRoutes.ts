import { Router } from "express";
import {createRoom,getAllRooms,getRoomById,updateRoom,deleteRoom,getRoomsByAccommodationId} from "../controllers/roomController";
import { protect, adminOnly } from "../middleware/authMiddleware";

const router = Router();

router.get("/", getAllRooms);
router.get("/:id", getRoomById);
router.get("/accommodation/:accommodation_id",getRoomsByAccommodationId);

router.post("/", protect, adminOnly, createRoom);
router.put("/:id", protect, adminOnly, updateRoom);
router.delete("/:id", protect, adminOnly, deleteRoom);

export default router;
