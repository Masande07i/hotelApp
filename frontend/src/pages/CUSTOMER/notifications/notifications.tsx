import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import type { RootState, AppDispatch } from "../../../store/store"
import { Text } from "../../../components/Text/text"
import { ProfileSidebar } from "../../../components/ProfileSidebar/ProfileSidebar"
import { Footer } from "../../../components/footer/footer"
import { IoArrowBackCircle } from "react-icons/io5"
import {
    fetchNotifications,
    fetchUnreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification
} from "../../../features/notificationSlice"
import style from "./notifications.module.css"

export const Notifications = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()

    const user = useSelector((state: RootState) => state.auth.user)

    const {
        notifications,
        unreadCount,
        loading,
        error
    } = useSelector((state: RootState) => state.notification)

    useEffect(() => {
        if (!user) {
            navigate("/login")
            return
        }

        dispatch(fetchNotifications())
        dispatch(fetchUnreadCount())
    }, [user, dispatch, navigate])

    if (!user) {
        return null
    }

    const handleNotificationClick = (
        notificationId: number,
        isRead: boolean
    ) => {
        if (!isRead) {
            dispatch(markNotificationAsRead(notificationId))
        }
    }

    const handleMarkAllRead = () => {
        dispatch(markAllNotificationsAsRead())
    }

    const handleDelete = (notificationId: number) => {
        dispatch(deleteNotification(notificationId))
    }

    return (
        <div className={style.notificationsPage}>
            <button
                type="button"
                className={style.backButton}
                onClick={() => navigate("/")}
            >
                <IoArrowBackCircle />
            </button>

            <Text variant="h1">Notifications</Text>

            <div className={style.notificationsLayout}>
                <ProfileSidebar />

                <main className={style.notificationsContent}>
                    <div className={style.notificationHeader}>
                        <Text variant="h2">Your Notifications</Text>

                        {unreadCount > 0 && (
                            <button
                                type="button"
                                onClick={handleMarkAllRead}
                                className={style.markAllButton}
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    {loading && (
                        <p>Loading notifications...</p>
                    )}

                    {error && (
                        <p className={style.error}>{error}</p>
                    )}

                    {!loading &&
                        !error &&
                        notifications.length === 0 && (
                            <div className={style.emptySection}>
                                <Text variant="p">
                                    You have no notifications yet.
                                </Text>
                            </div>
                        )}

                    {!loading &&
                        notifications.length > 0 && (
                            <div className={style.notificationList}>
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`${style.notificationItem} ${
                                            !notification.is_read
                                                ? style.unread
                                                : ""
                                        }`}
                                        onClick={() =>
                                            handleNotificationClick(
                                                notification.id,
                                                notification.is_read
                                            )
                                        }
                                    >
                                        <div
                                            className={
                                                style.notificationContent
                                            }
                                        >
                                            <Text variant="h2">
                                                {notification.title}
                                            </Text>

                                            <Text variant="p">
                                                {notification.message}
                                            </Text>

                                            <span>
                                                {new Date(
                                                    notification.created_at
                                                ).toLocaleString()}
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            className={
                                                style.deleteButton
                                            }
                                            onClick={(event) => {
                                                event.stopPropagation()
                                                handleDelete(
                                                    notification.id
                                                )
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                </main>
            </div>

            <Footer />
        </div>
    )
}