import { Router } from "express";
import {
    initializePayment,
    paymentNotification
} from "../controllers/paymentController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/initialize", protect, initializePayment);
router.post("/notify", paymentNotification);

export default router;
