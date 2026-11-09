
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store/store";

export interface Notification {
    id: number;
    user_id: number;
    booking_id: number | null;
    title: string;
    message: string;
    type:
        | "booking_created"
        | "booking_confirmed"
        | "booking_cancelled"
        | "booking_updated"
        | "payment_success"
        | "promotion";
    is_read: boolean;
    created_at: Date;
}

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    error: string | null;
    showNotifications: boolean;
}

const initialState: NotificationState = {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
    showNotifications: false
};

export const fetchNotifications = createAsyncThunk<
    Notification[],
    void,
    { state: RootState; rejectValue: string }
>(
    "notification/fetchNotifications",
    async (_, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;

            const response = await fetch("/api/notifications", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                return rejectWithValue(data.message || "Failed to fetch notifications");
            }

            return data.notifications;
        } catch {
            return rejectWithValue("Error fetching notifications");
        }
    }
);

export const fetchUnreadCount = createAsyncThunk<
    number,
    void,
    { state: RootState; rejectValue: string }
>(
    "notification/fetchUnreadCount",
    async (_, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;

            const response = await fetch("/api/notifications/unread-count", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                return rejectWithValue(data.message || "Failed to fetch unread count");
            }

            return data.unread_count;
        } catch {
            return rejectWithValue("Error fetching unread count");
        }
    }
);

export const markNotificationAsRead = createAsyncThunk<
    Notification,
    number,
    { state: RootState; rejectValue: string }
>(
    "notification/markNotificationAsRead",
    async (notificationId, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;

            const response = await fetch(
                `/api/notifications/${notificationId}/read`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                return rejectWithValue(data.message || "Failed to mark notification as read");
            }

            return data.notification;
        } catch {
            return rejectWithValue("Error marking notification as read");
        }
    }
);

export const markAllNotificationsAsRead = createAsyncThunk<
    void,
    void,
    { state: RootState; rejectValue: string }
>(
    "notification/markAllNotificationsAsRead",
    async (_, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;

            const response = await fetch("/api/notifications/read-all", {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                return rejectWithValue(data.message || "Failed to mark notifications as read");
            }
        } catch {
            return rejectWithValue("Error marking all notifications as read");
        }
    }
);

export const deleteNotification = createAsyncThunk<
    number,
    number,
    { state: RootState; rejectValue: string }
>(
    "notification/deleteNotification",
    async (notificationId, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;

            const response = await fetch(
                `/api/notifications/${notificationId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                return rejectWithValue(data.message || "Failed to delete notification");
            }

            return notificationId;
        } catch {
            return rejectWithValue("Error deleting notification");
        }
    }
);

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        clearNotifications: (state) => {
            state.notifications = [];
            state.unreadCount = 0;
            state.error = null;
            state.showNotifications = false;
        },
        toggleNotifications: (state) => {
            state.showNotifications = !state.showNotifications;
        },
        closeNotifications: (state) => {
            state.showNotifications = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch notifications";
            })
            .addCase(fetchUnreadCount.fulfilled, (state, action) => {
                state.unreadCount = action.payload;
            })
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                const notification = state.notifications.find(
                    (item) => item.id === action.payload.id
                );

                if (notification && !notification.is_read) {
                    notification.is_read = true;
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
            })
            .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
                state.notifications.forEach((notification) => {
                    notification.is_read = true;
                });

                state.unreadCount = 0;
            })
            .addCase(deleteNotification.fulfilled, (state, action) => {
                const notification = state.notifications.find(
                    (item) => item.id === action.payload
                );

                if (notification && !notification.is_read) {
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }

                state.notifications = state.notifications.filter(
                    (item) => item.id !== action.payload
                );
            });
    }
});

export const {
    clearNotifications,
    toggleNotifications,
    closeNotifications
} = notificationSlice.actions;

export default notificationSlice.reducer;
