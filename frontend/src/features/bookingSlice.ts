import { createSlice } from "@reduxjs/toolkit";

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

const bookingSlice = createSlice({
    name: "booking",
    initialState,
    reducers: {}
});

export default bookingSlice.reducer;