import { createSlice,createAsyncThunk,type PayloadAction } from "@reduxjs/toolkit";

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

export interface BookingInputs {
    check_in: string;
    check_out: string;
    room_id: string;
    number_of_rooms: string;
    number_of_guests: string;
}

interface BookingState {
    bookings: Booking[];
    inputs: BookingInputs;
    loading: boolean;
    error: string | null;
}

const initialState: BookingState = {
    bookings: [],
    inputs: {
        check_in: "",
        check_out: "",
        room_id: "",
        number_of_rooms: "1",
        number_of_guests: "1"
    },
    loading: false,
    error: null
};


export const createBooking = createAsyncThunk<
    Booking,
    CreateBooking,
    { state: { auth: { token: string | null } }; rejectValue: string }
>(
    "booking/createBooking",
    async (bookingData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;

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
                return thunkAPI.rejectWithValue(
                    data.message || "Failed to create booking"
                );
            }

            return data.booking as Booking;
        } catch {
            return thunkAPI.rejectWithValue(
                "Unable to connect to the server"
            );
        }
    }
);

export const fetchMyBookings = createAsyncThunk<
    Booking[],
    void,
    { state: { auth: { token: string | null } }; rejectValue: string }
>(
    "booking/fetchMyBookings",
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;

            const response = await fetch("/api/bookings/my-bookings", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                return thunkAPI.rejectWithValue(
                    data.message || "Failed to retrieve bookings"
                );
            }

            return data.bookings as Booking[];
        } catch {
            return thunkAPI.rejectWithValue(
                "Unable to connect to the server"
            );
        }
    }
);



const bookingSlice = createSlice({
    name: "booking",
    initialState,
    reducers: {
    updateBookingInputs: (
        state,
        action: PayloadAction<Partial<BookingInputs>>
    ) => {
        state.inputs = {
            ...state.inputs,
            ...action.payload
        };
    },
     setSelectedRoom: (state, action: PayloadAction<number>) => {
        state.inputs.room_id = String(action.payload);
    }
},

    extraReducers: (builder) => {
        builder
            .addCase(createBooking.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createBooking.fulfilled, (state, action) => {
                state.loading = false;
                state.bookings.push(action.payload);
            })
            .addCase(createBooking.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to create booking";
            })

            .addCase(fetchMyBookings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyBookings.fulfilled, (state, action) => {
                state.loading = false;
                state.bookings = action.payload;
            })
            .addCase(fetchMyBookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to retrieve bookings";
            });
    }
});

export const { updateBookingInputs , setSelectedRoom} = bookingSlice.actions;

export default bookingSlice.reducer;