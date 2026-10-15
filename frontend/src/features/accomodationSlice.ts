import { createAsyncThunk, createSlice,type PayloadAction } from "@reduxjs/toolkit";

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
interface AccommodationInputs {
    name: string
    description: string
    address: string
    city: string
    country: string
    star_rating: string
}

interface AccommodationState {
    accommodations: Accommodation[];
    inputs: AccommodationInputs
    showForm: boolean
    imagesByAccommodation: Record<number, AccommodationImage[]>;
    loading: boolean;
    error: string | null;
}


const initialState: AccommodationState = {
    accommodations: [],
        inputs: {
        name: '',
        description: '',
        address: '',
        city: '',
        country: '',
        star_rating: ''
    },
        showForm: false,
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
   reducers: {
    updateAccommodationInputs: (
        state,
        action: PayloadAction<Partial<AccommodationInputs>>
    ) => {
        state.inputs = {
            ...state.inputs,
            ...action.payload
        };
    },

    openAccommodationForm: (state) => {
        state.showForm = true;
    },

    closeAccommodationForm: (state) => {
        state.showForm = false;
    }
},

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

        .addCase(fetchAccommodationImages.pending, () => {
        })
        .addCase(fetchAccommodationImages.fulfilled, (state, action) => {
            state.imagesByAccommodation[action.meta.arg] = action.payload;
        })
        .addCase(fetchAccommodationImages.rejected, () => {
        });
}

});
export const {updateAccommodationInputs,openAccommodationForm,closeAccommodationForm
} = accommodationSlice.actions;

export default accommodationSlice.reducer;