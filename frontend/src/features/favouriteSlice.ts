import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store/store";
import type { Accommodation } from "./accomodationSlice"

interface FavouriteState {
    favourites: Accommodation[];
    loading: boolean;
    error: string | null;
}

const initialState: FavouriteState = {
    favourites: [],
    loading: false,
    error: null
};

export const fetchFavourites = createAsyncThunk<
    Accommodation[],
    void,
    { rejectValue: string; state: RootState }
>(
    "favourite/fetchAll",
    async (_, thunkAPI) => {
        const token = thunkAPI.getState().auth.token;

        if (!token) {
            return thunkAPI.rejectWithValue(
                "Please log in to view your favourites"
            );
        }

        try {
            const response = await fetch("/api/favourites", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                return thunkAPI.rejectWithValue(
                    data.message || "Failed to fetch favourites"
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

export const addFavourite = createAsyncThunk<
    Accommodation[],
    number,
    { rejectValue: string; state: RootState }
>(
    "favourite/add",
    async (accommodationId, thunkAPI) => {
        const token = thunkAPI.getState().auth.token;

        if (!token) {
            return thunkAPI.rejectWithValue(
                "Please log in to add favourites"
            );
        }

        try {
            const response = await fetch(
                `/api/favourites/${accommodationId}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                return thunkAPI.rejectWithValue(
                    data.message || "Failed to add favourite"
                );
            }

            return await thunkAPI.dispatch(fetchFavourites()).unwrap();
        } catch {
            return thunkAPI.rejectWithValue(
                "Unable to connect to the server"
            );
        }
    }
);

export const removeFavourite = createAsyncThunk<
    number,
    number,
    { rejectValue: string; state: RootState }
>(
    "favourite/remove",
    async (accommodationId, thunkAPI) => {
        const token = thunkAPI.getState().auth.token;

        if (!token) {
            return thunkAPI.rejectWithValue(
                "Please log in to remove favourites"
            );
        }

        try {
            const response = await fetch(
                `/api/favourites/${accommodationId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                return thunkAPI.rejectWithValue(
                    data.message || "Failed to remove favourite"
                );
            }

            return accommodationId;
        } catch {
            return thunkAPI.rejectWithValue(
                "Unable to connect to the server"
            );
        }
    }
);

const favouriteSlice = createSlice({
    name: "favourite",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFavourites.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFavourites.fulfilled, (state, action) => {
                state.loading = false;
                state.favourites = action.payload;
            })
            .addCase(fetchFavourites.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch favourites";
            })
            .addCase(addFavourite.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addFavourite.fulfilled, (state, action) => {
                state.loading = false;
                state.favourites = action.payload;
            })
            .addCase(addFavourite.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to add favourite";
            })
            .addCase(removeFavourite.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFavourite.fulfilled, (state, action) => {
                state.loading = false;
                state.favourites = state.favourites.filter(
                    (accommodation) => accommodation.id !== action.payload
                );
            })
            .addCase(removeFavourite.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to remove favourite";
            });
    }
});

export default favouriteSlice.reducer;