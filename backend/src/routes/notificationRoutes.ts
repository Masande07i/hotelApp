import { Router } from "express";
import {
    getUserNotifications,
    getUnreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    createPromotionNotification
} from "../controllers/notificationController";
import { adminOnly, protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/", protect, getUserNotifications);
router.get("/unread-count", protect, getUnreadNotificationCount);
router.patch("/read-all", protect, markAllNotificationsAsRead);
router.patch("/:notification_id/read", protect, markNotificationAsRead);
router.delete("/:notification_id", protect, deleteNotification)

router.post("/promotion", protect,adminOnly,createPromotionNotification);

export default router;
