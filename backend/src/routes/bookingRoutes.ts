import { Router } from "express";
import { getRoomForBooking ,getAvailableRooms} from "../controllers/bookingController";

const router = Router();

router.get("/room/:room_id", getRoomForBooking);
router.get("/room/:room_id/availability", getAvailableRooms);

export default router;