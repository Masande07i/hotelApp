import { createSlice,createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store/store";


export interface Room {
    id: number;
    accommodation_id: number;
    room_type: string;
    description: string | null;
    bed_type: string | null;
    capacity: number;
    price_per_night: string;
    total_rooms: number;
    amenities: string[];
    created_at: string;
    updated_at: string;
}

interface RoomState {
    rooms: Room[];
    loading: boolean;
    error: string | null;
}

const initialState: RoomState = {
    rooms: [],
    loading: false,
    error: null
};


export const fetchRoomsByAccommodation = createAsyncThunk<Room[],number,{ rejectValue: string; state: RootState }>(
    "room/fetchByAccommodation",async (accommodationId, thunkAPI) => {
        try {
            const response = await fetch(`/api/rooms/accommodation/${accommodationId}`);

            const data = await response.json();

            if (!response.ok) {
                return thunkAPI.rejectWithValue(
                    data.message || "Failed to fetch rooms"
                );
            }

            return data as Room[];
        } catch {
            return thunkAPI.rejectWithValue(
                "Unable to connect to the server"
            );
        }
    }
);



const roomSlice = createSlice({
    name: "room",
    initialState,
    reducers: {
        setRooms: (state, action: PayloadAction<Room[]>) => {
            state.rooms = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRoomsByAccommodation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRoomsByAccommodation.fulfilled, (state, action) => {
                state.loading = false;
                state.rooms = action.payload;
            })
            .addCase(fetchRoomsByAccommodation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch rooms";
            });
    }
});


export const { setRooms } = roomSlice.actions;

export default roomSlice.reducer;
