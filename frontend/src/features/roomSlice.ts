import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

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

const roomSlice = createSlice({
    name: "room",
    initialState,
    reducers: {
        setRooms: (state, action: PayloadAction<Room[]>) => {
            state.rooms = action.payload;
        }
    }
});

export const { setRooms } = roomSlice.actions;

export default roomSlice.reducer;
