import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store/store";

export interface Customer {
    id: number;
    name: string;
    email: string;
    profile_image: string | null;
    role: "customer" | "admin";
    created_at: string;
    updated_at: string;
}

interface CustomersState {
    customers: Customer[];
    loading: boolean;
    error: string | null;
}

const initialState: CustomersState = {
    customers: [],
    loading: false,
    error: null
};


export const fetchCustomers = createAsyncThunk<
    Customer[],
    void,
    { state: RootState; rejectValue: string }
>(
    "customers/fetchCustomers",
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;

            const response = await fetch("/api/users", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                return thunkAPI.rejectWithValue(
                    data.message || "Failed to fetch customers"
                );
            }

            return data as Customer[];
        } catch {
            return thunkAPI.rejectWithValue(
                "Unable to connect to the server"
            );
        }
    }
);

