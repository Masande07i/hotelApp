import { createAsyncThunk, createSlice,type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store/store";

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
    selectedImage: File | null;
}
interface CreateAccommodationResponse {
    message: string;
    accommodation: Accommodation;
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
         selectedImage: null,
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


export const createAccommodation = createAsyncThunk<
    CreateAccommodationResponse,
    void,
    { rejectValue: string }
>(
    "accommodation/create",
    async (_, thunkAPI) => {
        const state = thunkAPI.getState() as {
            auth: { token: string | null };
            accommodation: { inputs: AccommodationInputs };
        };

        const { inputs } = state.accommodation;
        const token = state.auth.token;

        if (!token) {
            return thunkAPI.rejectWithValue(
                "Please log in before creating an accommodation"
            );
        }

        try {
            const response = await fetch("/api/accommodations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...inputs,
                    star_rating: inputs.star_rating
                        ? Number(inputs.star_rating)
                        : null
                })
            });

            const data = await response.json();

            if (!response.ok) {
                return thunkAPI.rejectWithValue(
                    data.message || "Failed to create accommodation"
                );
            }

            return data as CreateAccommodationResponse;
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

export const uploadAccommodationImage = createAsyncThunk<
    AccommodationImage,
    { accommodationId: number; image: File },
    { rejectValue: string; state: RootState }
>(
    "accommodation/uploadImage",
    async ({ accommodationId, image }, thunkAPI) => {
        const token = thunkAPI.getState().auth.token;

        if (!token) {
            return thunkAPI.rejectWithValue(
                "Please log in before uploading images"
            );
        }

        try {
            const formData = new FormData();
            formData.append("image", image);

            const response = await fetch(
                `/api/accommodations/${accommodationId}/images`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: formData
                }
            );

            const data = await response.json();

            if (!response.ok) {
                return thunkAPI.rejectWithValue(
                    data.message || "Failed to upload image"
                );
            }

            return (data.image ?? data) as AccommodationImage;
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
    },
    setSelectedImage: (
        state,
        action: PayloadAction<File | null>
    ) => {
        state.selectedImage = action.payload;
    },
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
        })
     


        .addCase(createAccommodation.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createAccommodation.fulfilled, (state, action) => {
            state.loading = false;
            state.accommodations.push(action.payload.accommodation);
            state.inputs = {
                name: "",
                description: "",
                address: "",
                city: "",
                country: "",
                star_rating: ""
            };
            state.showForm = false;
        })
       
        
        .addCase(createAccommodation.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Failed to create accommodation";
        })
        .addCase(uploadAccommodationImage.pending, (state) => {
            state.error = null;
        })
        .addCase(uploadAccommodationImage.fulfilled, (state, action) => {
            const accommodationId = action.meta.arg.accommodationId;

            if (!state.imagesByAccommodation[accommodationId]) {
                state.imagesByAccommodation[accommodationId] = [];
            }

            state.imagesByAccommodation[accommodationId].push(action.payload);
        })
        .addCase(uploadAccommodationImage.rejected, (state, action) => {
            state.error = action.payload || "Failed to upload image";
        });


}

});
export const {updateAccommodationInputs,openAccommodationForm,closeAccommodationForm,    setSelectedImage

} = accommodationSlice.actions;

export default accommodationSlice.reducer;