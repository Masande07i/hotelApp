import { Router } from "express";
import {
    getUserNotifications,
    getUnreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification
} from "../controllers/notificationController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/", protect, getUserNotifications);
router.get("/unread-count", protect, getUnreadNotificationCount);
router.patch("/read-all", protect, markAllNotificationsAsRead);
router.patch("/:notification_id/read", protect, markNotificationAsRead);
router.delete("/:notification_id", protect, deleteNotification);

export default router;
