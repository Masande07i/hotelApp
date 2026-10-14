import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface Accommodation {
    id: number;
    name: string;
    description: string;
    address: string;
    city: string;
    country: string;
    star_rating: number | null;
    created_at: string;
    updated_at: string;
}


interface AccommodationState {
    accommodations: Accommodation[];
    loading: boolean;
    error: string | null;
}

const initialState: AccommodationState = {
    accommodations: [],
    loading: false,
    error: null
};


export const fetchAccommodations = createAsyncThunk("accommodation/fetchAll",async (_, thunkAPI) => {
        try {
            const response = await fetch("/api/accommodations");

            const data = await response.json();

            if (!response.ok) {
                return thunkAPI.rejectWithValue(
                    data.message || "Failed to fetch accommodations"
                );
            }

            return data as Accommodation[];
        } catch {
            return thunkAPI.rejectWithValue(
                "Unable to connect to the server"
            );
        }
    }
);

const accommodationSlice = createSlice({
    name: "accommodation",
    initialState,
    reducers: {},

extraReducers: (builder) => {
    builder
        .addCase(fetchAccommodations.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchAccommodations.fulfilled, (state, action) => {
            state.loading = false;
            state.accommodations = action.payload;
        })
        .addCase(fetchAccommodations.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
}

});

export default accommodationSlice.reducer;