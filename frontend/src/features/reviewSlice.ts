import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface Review {
    id: number;
    user_id: number;
    accommodation_id: number;
    rating: number;
    comment: string;
    created_at: string;
    updated_at: string;
}

export interface ReviewInputs {
    rating: number;
    comment: string;
}

interface ReviewState {
    reviews: Review[];
    inputs: ReviewInputs;
    loading: boolean;
    error: string | null;
    success: boolean;
}


const initialState: ReviewState = {
    reviews: [],
    inputs: {
        rating: 5,
        comment: ''
    },
    loading: false,
    error: null,
    success: false
};

export const fetchReviewsByAccommodation = createAsyncThunk<
    Review[],
    number,
    { rejectValue: string }
>(
    'review/fetchReviewsByAccommodation',
    async (accommodation_id, thunkAPI) => {
        try {
            const response = await fetch(`/api/reviews/${accommodation_id}`);

            const data = await response.json();

            if (!response.ok) {
                return thunkAPI.rejectWithValue(
                    data.message || 'Failed to fetch reviews'
                );
            }

            return data as Review[];
        } catch {
            return thunkAPI.rejectWithValue(
                'Unable to connect to the server'
            );
        }
    }
);

export const addReview = createAsyncThunk<
    Review,
    { accommodation_id: number; inputs: ReviewInputs },
    { state: { auth: { token: string | null } }; rejectValue: string }
>(
    'review/addReview',
    async ({ accommodation_id, inputs }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;

            const response = await fetch(`/api/reviews/${accommodation_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(inputs)
            });

            const data = await response.json();

            if (!response.ok) {
                return thunkAPI.rejectWithValue(
                    data.message || 'Failed to add review'
                );
            }

            return data.review as Review;
        } catch {
            return thunkAPI.rejectWithValue(
                'Unable to connect to the server'
            );
        }
    }
);

export const updateReview = createAsyncThunk<
    Review,
    { accommodation_id: number; inputs: ReviewInputs },
    { state: { auth: { token: string | null } }; rejectValue: string }
>(
    'review/updateReview',
    async ({ accommodation_id, inputs }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;

            const response = await fetch(`/api/reviews/${accommodation_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(inputs)
            });

            const data = await response.json();

            if (!response.ok) {
                return thunkAPI.rejectWithValue(
                    data.message || 'Failed to update review'
                );
            }

            return data.review as Review;
        } catch {
            return thunkAPI.rejectWithValue(
                'Unable to connect to the server'
            );
        }
    }
);

export const removeReview = createAsyncThunk<
    number,
    number,
    { state: { auth: { token: string | null } }; rejectValue: string }
>(
    'review/removeReview',
    async (accommodation_id, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;

            const response = await fetch(`/api/reviews/${accommodation_id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                return thunkAPI.rejectWithValue(
                    data.message || 'Failed to delete review'
                );
            }

            return accommodation_id;
        } catch {
            return thunkAPI.rejectWithValue(
                'Unable to connect to the server'
            );
        }
    }
);

export const reviewSlice = createSlice({
    name: 'review',
    initialState,
    reducers: {
        updateReviewInputs: (
            state,
            action: PayloadAction<Partial<ReviewInputs>>
        ) => {
            state.inputs = {
                ...state.inputs,
                ...action.payload
            };
        },
        clearReviewForm: (state) => {
            state.inputs = initialState.inputs;
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
    .addCase(fetchReviewsByAccommodation.pending, (state) => {
        state.loading = true;
        state.error = null;
    })
    .addCase(fetchReviewsByAccommodation.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
    })
    .addCase(fetchReviewsByAccommodation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
    });

    }
});