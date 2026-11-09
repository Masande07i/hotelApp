
import { Request, Response } from "express";
import * as notificationService from "../services/notificationService";

export const getUserNotifications = async (
    req: Request,
    res: Response
) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Please log in first"
            });
        }

        const user_id = req.user.id;

        const notifications =
            await notificationService.getUserNotifications(user_id);

        return res.status(200).json({ notifications });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error retrieving notifications"
        });
    }
};

export const getUnreadNotificationCount = async (
    req: Request,
    res: Response
) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Please log in first"
            });
        }

        const user_id = req.user.id;

        const unread_count =
            await notificationService.getUnreadNotificationCount(user_id);

        return res.status(200).json({ unread_count });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error retrieving unread notifications"
        });
    }
};

export const markNotificationAsRead = async (
    req: Request,
    res: Response
) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Please log in first"
            });
        }

        const notification_id = Number(req.params.notification_id);

        if (!Number.isInteger(notification_id) || notification_id <= 0) {
            return res.status(400).json({
                message: "Invalid notification ID"
            });
        }

        const user_id = req.user.id;

        const notification =
            await notificationService.markNotificationAsRead(
                notification_id,
                user_id
            );

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found"
            });
        }

        return res.status(200).json({
            message: "Notification marked as read",
            notification
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error marking notification as read"
        });
    }
};

export const markAllNotificationsAsRead = async (
    req: Request,
    res: Response
) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Please log in first"
            });
        }

        const user_id = req.user.id;

        await notificationService.markAllNotificationsAsRead(user_id);

        return res.status(200).json({
            message: "All notifications marked as read"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error marking all notifications as read"
        });
    }
};

export const deleteNotification = async (
    req: Request,
    res: Response
) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Please log in first"
            });
        }

        const notification_id = Number(req.params.notification_id);

        if (!Number.isInteger(notification_id) || notification_id <= 0) {
            return res.status(400).json({
                message: "Invalid notification ID"
            });
        }

        const user_id = req.user.id;

        const notification =
            await notificationService.deleteNotification(
                notification_id,
                user_id
            );

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found"
            });
        }

        return res.status(200).json({
            message: "Notification deleted successfully"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error deleting notification"
        });
    }
};
