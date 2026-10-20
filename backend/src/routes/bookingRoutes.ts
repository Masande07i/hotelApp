import { Router } from "express";
import {getRoomForBooking,getAvailableRooms,calculateBookingPrice
} from "../controllers/bookingController";

const router = Router();

router.get("/room/:room_id", getRoomForBooking);
router.get("/room/:room_id/availability", getAvailableRooms);
router.get("/room/:room_id/price", calculateBookingPrice);

export default router;