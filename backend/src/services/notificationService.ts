
import { query } from "../config/database";
import { Notification } from "../types/notification.types";

export const createNotification = async (
    user_id: number,
    title: string,
    message: string,
    type: Notification["type"],
    booking_id: number | null = null
): Promise<Notification> => {
    const { rows } = await query(
        `INSERT INTO notifications (
            user_id,
            booking_id,
            title,
            message,
            type
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [user_id, booking_id, title, message, type]
    );

    return rows[0];
};

export const getUserNotifications = async (
    user_id: number
): Promise<Notification[]> => {
    const { rows } = await query(
        `SELECT *
         FROM notifications
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [user_id]
    );

    return rows;
};

export const getUnreadNotificationCount = async (
    user_id: number
): Promise<number> => {
    const { rows } = await query(
        `SELECT COUNT(*) AS unread_count
         FROM notifications
         WHERE user_id = $1
         AND is_read = FALSE`,
        [user_id]
    );

    return Number(rows[0].unread_count);
};

export const markNotificationAsRead = async (
    notification_id: number,
    user_id: number
): Promise<Notification | null> => {
    const { rows } = await query(
        `UPDATE notifications
         SET is_read = TRUE
         WHERE id = $1
         AND user_id = $2
         RETURNING *`,
        [notification_id, user_id]
    );

    return rows[0] ?? null;
};

export const markAllNotificationsAsRead = async (
    user_id: number
): Promise<void> => {
    await query(
        `UPDATE notifications
         SET is_read = TRUE
         WHERE user_id = $1
         AND is_read = FALSE`,
        [user_id]
    );
};

export const deleteNotification = async (
    notification_id: number,
    user_id: number
): Promise<Notification | null> => {
    const { rows } = await query(
        `DELETE FROM notifications
         WHERE id = $1
         AND user_id = $2
         RETURNING *`,
        [notification_id, user_id]
    );

    return rows[0] ?? null;
};
