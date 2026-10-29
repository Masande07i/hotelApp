import { Router } from "express";
import {
    initializePayment,
    verifyPayment
} from "../controllers/paymentController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/initialize", protect, initializePayment);
router.get("/verify", protect, verifyPayment);

export default router;
