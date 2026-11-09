
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
}

const initialState: NotificationState = {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null
};

export const fetchNotifications = createAsyncThunk<
    Notification[],
    void,
    { rejectValue: string; state: RootState }
>(
    "notification/fetchAll",
    async (_, thunkAPI) => {
        const token = thunkAPI.getState().auth.token;

        if (!token) {
            return thunkAPI.rejectWithValue(
                "Please log in to view notifications"
            );
        }

        try {
            const response = await fetch("/api/notifications", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                return thunkAPI.rejectWithValue(
                    data.message || "Failed to fetch notifications"
                );
            }

            return data.notifications as Notification[];
        } catch {
            return thunkAPI.rejectWithValue(
                "Unable to connect to the server"
            );
        }
    }
);

export const fetchUnreadCount = createAsyncThunk<
    number,
    void,
    { rejectValue: string; state: RootState }
>(
    "notification/fetchUnreadCount",
    async (_, thunkAPI) => {
        const token = thunkAPI.getState().auth.token;

        if (!token) {
            return thunkAPI.rejectWithValue(
                "Please log in first"
            );
        }

        try {
            const response = await fetch(
                "/api/notifications/unread-count",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                return thunkAPI.rejectWithValue(
                    data.message || "Failed to fetch unread count"
                );
            }

            return data.unread_count as number;
        } catch {
            return thunkAPI.rejectWithValue(
                "Unable to connect to the server"
            );
        }
    }
);

export const markNotificationAsRead = createAsyncThunk<
    Notification,
    number,
    { rejectValue: string; state: RootState }
>(
    "notification/markAsRead",
    async (notificationId, thunkAPI) => {
        const token = thunkAPI.getState().auth.token;

        if (!token) {
            return thunkAPI.rejectWithValue(
                "Please log in first"
            );
        }

        try {
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
                return thunkAPI.rejectWithValue(
                    data.message || "Failed to mark notification as read"
                );
            }

            return data.notification as Notification;
        } catch {
            return thunkAPI.rejectWithValue(
                "Unable to connect to the server"
            );
        }
    }
);

export const markAllNotificationsAsRead = createAsyncThunk<
    void,
    void,
    { rejectValue: string; state: RootState }
>(
    "notification/markAllAsRead",
    async (_, thunkAPI) => {
        const token = thunkAPI.getState().auth.token;

        if (!token) {
            return thunkAPI.rejectWithValue(
                "Please log in first"
            );
        }

        try {
            const response = await fetch(
                "/api/notifications/read-all",
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                return thunkAPI.rejectWithValue(
                    data.message || "Failed to mark all notifications as read"
                );
            }
        } catch {
            return thunkAPI.rejectWithValue(
                "Unable to connect to the server"
            );
        }
    }
);

export const deleteNotification = createAsyncThunk<
    number,
    number,
    { rejectValue: string; state: RootState }
>(
    "notification/delete",
    async (notificationId, thunkAPI) => {
        const token = thunkAPI.getState().auth.token;

        if (!token) {
            return thunkAPI.rejectWithValue(
                "Please log in first"
            );
        }

        try {
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
                return thunkAPI.rejectWithValue(
                    data.message || "Failed to delete notification"
                );
            }

            return notificationId;
        } catch {
            return thunkAPI.rejectWithValue(
                "Unable to connect to the server"
            );
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
                const index = state.notifications.findIndex(
                    (notification) => notification.id === action.payload.id
                );

                if (index !== -1) {
                    state.notifications[index] = action.payload;
                }

                state.unreadCount = Math.max(0, state.unreadCount - 1);
            })

            .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
                state.notifications = state.notifications.map(
                    (notification) => ({
                        ...notification,
                        is_read: true
                    })
                );

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

export const { clearNotifications } = notificationSlice.actions;

export default notificationSlice.reducer;
