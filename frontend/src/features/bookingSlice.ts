import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";

export interface Booking {
    id: number;
    user_id: number;
    check_in: string;
    check_out: string;
    number_of_rooms: number;
    number_of_guests: number;
    total_price: number;
    status: "pending" | "confirmed" | "cancelled";
    created_at: string;
    updated_at: string;
}

export interface CreateBooking {
    check_in: string;
    check_out: string;
    room_id: number;
    number_of_rooms: number;
    number_of_guests: number;
}

interface BookingState {
    bookings: Booking[];
    loading: boolean;
    error: string | null;
}

const initialState: BookingState = {
    bookings: [],
    loading: false,
    error: null
};

export const createBooking = createAsyncThunk(
    "booking/createBooking",
    async (bookingData: CreateBooking, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch("/api/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(bookingData)
            });

            const data = await response.json();

            if (!response.ok) {
                return rejectWithValue(data.message || "Failed to create booking");
            }

            return data.booking as Booking;
        } catch {
            return rejectWithValue("Something went wrong while creating the booking");
        }
    }
);

const bookingSlice = createSlice({
    name: "booking",
    initialState,
    reducers: {}
});

export default bookingSlice.reducer;