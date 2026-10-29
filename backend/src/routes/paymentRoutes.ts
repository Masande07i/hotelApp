import { Router } from "express";
import {
    initializePayment,
    verifyPayment,getTotalRevenue
} from "../controllers/paymentController";
import { protect ,adminOnly } from "../middleware/authMiddleware";

const router = Router();

router.post("/initialize", protect, initializePayment);
router.get("/verify", protect, verifyPayment);
router.get("/revenue", protect, adminOnly, getTotalRevenue);

export default router;


//http://localhost:3000/api/payments/revenue