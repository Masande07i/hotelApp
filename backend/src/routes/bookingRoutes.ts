import { Router } from "express";
import { getRoomForBooking } from "../controllers/bookingController";

const router = Router();

router.get("/room/:room_id", getRoomForBooking);

export default router;