import { Router } from "express";
import {getRoomForBooking,getAvailableRooms,calculateBookingPrice,createBooking} from "../controllers/bookingController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/room/:room_id", getRoomForBooking);
router.get("/room/:room_id/availability", getAvailableRooms);
router.get("/room/:room_id/price", calculateBookingPrice);

router.post("/", protect, createBooking);

export default router;
