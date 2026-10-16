import { Router } from "express";
import {createRoom,getAllRooms,getRoomById,updateRoom} from "../controllers/roomController";
import { protect, adminOnly } from "../middleware/authMiddleware";

const router = Router();

router.get("/", getAllRooms);
router.get("/:id", getRoomById);

router.post("/", protect, adminOnly, createRoom);
router.put("/:id", protect, adminOnly, updateRoom);

export default router;
