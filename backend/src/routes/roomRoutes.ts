import { Router } from "express";
import {createRoom,getAllRooms} from "../controllers/roomController";
import { protect, adminOnly } from "../middleware/authMiddleware";

const router = Router();

router.get("/", getAllRooms);

router.post("/", protect, adminOnly, createRoom);

export default router;
