import style from './navbar.module.css';
import { Text } from '../Text/text';
import { Button } from '../button/button';
import { CiHome, CiUser } from "react-icons/ci";
import {
    IoNotificationsOutline,
    IoCheckmarkDoneOutline,
    IoTrashOutline
} from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../store/store';
import {
    fetchNotifications,
    fetchUnreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    toggleNotifications
} from '../../features/notificationSlice';

interface NavbarProps {
    className?: string;
}

export const navbar = ({ className }: NavbarProps) => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const user = useSelector((state: RootState) => state.auth.user);

    const {
        notifications,
        unreadCount,
        loading,
        showNotifications
    } = useSelector((state: RootState) => state.notification);

    const handleStart = () => {
        navigate('/login');
    };

    const handleSign = () => {
        navigate('/signup');
    };

    const handleProfile = () => {
        navigate('/profile');
    };

    const handleNotificationToggle = () => {
        if (!showNotifications) {
            dispatch(fetchNotifications());
            dispatch(fetchUnreadCount());
        }

        dispatch(toggleNotifications());
    };

    const handleNotificationClick = (
        notificationId: number,
        isRead: boolean
    ) => {
        if (!isRead) {
            dispatch(markNotificationAsRead(notificationId));
        }
    };

    const handleMarkAllRead = () => {
        dispatch(markAllNotificationsAsRead());
    };

    const handleDelete = (notificationId: number) => {
        dispatch(deleteNotification(notificationId));
    };

    return (
        <nav className={`${style.navbar} ${className || ""}`}>
            <div className={style.logo}>
                <CiHome className={style.logoIcon} />
                <Text variant="h2">Havenly</Text>
            </div>

            <div className={style.links}>
                <a href="/">Home</a>
                <a href="/accomodations">Hotels</a>
                <a href="/about">About</a>
                <a href="/contact">Contact</a>
            </div>

            <div className={style.actions}>
                {user ? (
                    <>
                        <div className={style.notificationContainer}>
                            <button
                                type="button"
                                className={style.notificationButton}
                                onClick={handleNotificationToggle}
                                aria-label="Notifications"
                                title="Notifications"
                            >
                                <IoNotificationsOutline />

                                {unreadCount > 0 && (
                                    <span className={style.notificationBadge}>
                                        {unreadCount > 99 ? '99+' : unreadCount}
                                    </span>
                                )}
                            </button>

                            {showNotifications && (
                                <div className={style.notificationDropdown}>
                                    <div className={style.notificationHeader}>
                                        <h3>Notifications</h3>

                                        {unreadCount > 0 && (
                                            <button
                                                type="button"
                                                onClick={handleMarkAllRead}
                                                className={style.markAllButton}
                                            >
                                                <IoCheckmarkDoneOutline />
                                                Mark all as read
                                            </button>
                                        )}
                                    </div>

                                    <div className={style.notificationList}>
                                        {loading ? (
                                            <p className={style.emptyNotifications}>
                                                Loading notifications...
                                            </p>
                                        ) : notifications.length === 0 ? (
                                            <p className={style.emptyNotifications}>
                                                You have no notifications yet.
                                            </p>
                                        ) : (
                                            notifications.map((notification) => (
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
                                                    <div className={style.notificationContent}>
                                                        <h4>{notification.title}</h4>

                                                        <p>{notification.message}</p>

                                                        <span>
                                                            {new Date(
                                                                notification.created_at
                                                            ).toLocaleString()}
                                                        </span>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        className={style.deleteNotificationButton}
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            handleDelete(notification.id);
                                                        }}
                                                        aria-label="Delete notification"
                                                        title="Delete notification"
                                                    >
                                                        <IoTrashOutline />
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            type="button"
                            className={style.profileButton}
                            onClick={handleProfile}
                            aria-label="My Profile"
                            title="My Profile"
                        >
                            <CiUser />
                        </button>
                    </>
                ) : (
                    <>
                        <Button
                            label="LOGIN"
                            type="button"
                            onClick={handleStart}
                        />

                        <Button
                            label="SIGN UP"
                            type="button"
                            onClick={handleSign}
                        />
                    </>
                )}
            </div>
        </nav>
    );
};
