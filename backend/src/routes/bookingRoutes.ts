import { Router } from "express";
import {getRoomForBooking,getAvailableRooms,calculateBookingPrice,createBooking,getMyBookings,cancelBooking,getAllBookings,updateBookingStatus} from "../controllers/bookingController";
import { protect , adminOnly} from "../middleware/authMiddleware";

const router = Router();

router.get("/room/:room_id", getRoomForBooking);
router.get("/room/:room_id/availability", getAvailableRooms);
router.get("/room/:room_id/price", calculateBookingPrice);

router.post("/", protect, createBooking);
router.get("/my-bookings", protect, getMyBookings);
router.patch("/:booking_id/cancel", protect, cancelBooking);
router.get("/all", protect, adminOnly, getAllBookings);
router.patch("/:booking_id/status", protect, adminOnly, updateBookingStatus);

export default router;
