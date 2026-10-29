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


export interface CreateRoomInputs {
    accommodation_id: number;
    room_type: string;
    description: string | null;
    bed_type: string | null;
    capacity: number;
    price_per_night: number;
    total_rooms: number;
    amenities: string[];
}

export interface RoomInputs {
    id?: number;
    room_type: string;
    description: string;
    bed_type: string;
    capacity: string;
    price_per_night: string;
    total_rooms: string;
    amenities: string;
}


interface RoomState {
    rooms: Room[];
    inputs: RoomInputs;
    showForm: boolean;
    loading: boolean;
    error: string | null;
}


const initialState: RoomState = {
    rooms: [],
     inputs: {
        room_type: "",
        description: "",
        bed_type: "",
        capacity: "1",
        price_per_night: "",
        total_rooms: "1",
        amenities: ""
    },
    loading: false,
    showForm: false,
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


export const createRoom = createAsyncThunk<Room,CreateRoomInputs,{ rejectValue: string; state: RootState }>(
    "room/createRoom",
    async (roomData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;

            const response = await fetch("/api/rooms", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(roomData)
            });

            const data = await response.json();

            if (!response.ok) {
                return thunkAPI.rejectWithValue(
                    data.message || "Failed to create room"
                );
            }

            return data.room as Room;
        } catch {
            return thunkAPI.rejectWithValue(
                "Unable to connect to the server"
            );
        }
    }
);

export const updateRoom = createAsyncThunk<Room,RoomInputs, { rejectValue: string; state: RootState }
>(
    "room/updateRoom",
    async (roomData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;

            const response = await fetch(`/api/rooms/${roomData.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    
                    room_type: roomData.room_type,
                    description: roomData.description || null,
                    bed_type: roomData.bed_type || null,
                    capacity: Number(roomData.capacity),
                    price_per_night: Number(roomData.price_per_night),
                    total_rooms: Number(roomData.total_rooms),
                    amenities: roomData.amenities
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean)
                })
            });

           const data = await response.json();

if (!response.ok) {
    return thunkAPI.rejectWithValue(
        data.message || "Failed to update room"
    );
}

return data.room as Room;
     
        } catch {
            return thunkAPI.rejectWithValue(
                "Unable to connect to the server"
            );
        }
    }
);


export const deleteRoom = createAsyncThunk<
    number,
    number,
    { rejectValue: string; state: RootState }
>(
    "room/deleteRoom",
    async (roomId, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;

            const response = await fetch(`/api/rooms/${roomId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                return thunkAPI.rejectWithValue(
                    data.message || "Failed to delete room"
                );
            }

            return roomId;
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
        },
        updateRoomInputs: (state, action: PayloadAction<Partial<RoomInputs>>) => {
        state.inputs = {
        ...state.inputs,
        ...action.payload
    };
},
       openRoomForm: (state) => {
       state.showForm = true;
        },
        closeRoomForm: (state) => {
            state.showForm = false;
        },
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
            })
            .addCase(createRoom.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createRoom.fulfilled, (state, action) => {
                state.loading = false;
                state.rooms.unshift(action.payload);
            })
            .addCase(createRoom.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to create room";
            })
            .addCase(updateRoom.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateRoom.fulfilled, (state, action) => {
            state.loading = false;

            const index = state.rooms.findIndex(
                (room) => room.id === action.payload.id
            );

            if (index !== -1) {
                state.rooms[index] = action.payload;
            }
        })
        .addCase(updateRoom.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to update room";
        })

            .addCase(deleteRoom.pending, (state) => {
                state.error = null;
            })
            .addCase(deleteRoom.fulfilled, (state, action) => {
                state.rooms = state.rooms.filter(
                    (room) => room.id !== action.payload
                );
            })
            .addCase(deleteRoom.rejected, (state, action) => {
                state.error = action.payload || "Failed to delete room";
            });
    }
});


export const { setRooms, updateRoomInputs,closeRoomForm,openRoomForm } = roomSlice.actions;

export default roomSlice.reducer;
