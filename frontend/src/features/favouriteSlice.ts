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
    Accommodation,
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

            return data.favourite as Accommodation;
        } catch {
            return thunkAPI.rejectWithValue(
                "Unable to connect to the server"
            );
        }
    }
);