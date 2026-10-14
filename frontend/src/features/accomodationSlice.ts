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
export interface AccommodationImage {
    id: number;
    accommodation_id: number;
    image_url: string;
    public_id: string;
    created_at: string;
}

interface AccommodationState {
    accommodations: Accommodation[];
    imagesByAccommodation: Record<number, AccommodationImage[]>;
    loading: boolean;
    error: string | null;
}


const initialState: AccommodationState = {
    accommodations: [],
    imagesByAccommodation: {},
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


export const fetchAccommodationImages = createAsyncThunk("accommodation/fetchImages",async (accommodationId: number, thunkAPI) => {
        try {
            const response = await fetch(`/api/accommodations/${accommodationId}/images`
            );

            const data = await response.json();

            if (!response.ok) {
                return thunkAPI.rejectWithValue(
                    data.message || "Failed to fetch accommodation images"
                );
            }

            return data.images as AccommodationImage[];
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
        })

        .addCase(fetchAccommodationImages.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchAccommodationImages.fulfilled, (state, action) => {
            state.loading = false;
            state.imagesByAccommodation[action.meta.arg] = action.payload;
        })
        .addCase(fetchAccommodationImages.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
}

});

export default accommodationSlice.reducer;