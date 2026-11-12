import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface DashboardStats {
    totalAccommodations: number;
    totalCustomers: number;
    totalRevenue: number;
}

interface DashboardState extends DashboardStats {
    showForm: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: DashboardState = {
    totalAccommodations: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    showForm: false,
    loading: false,
    error: null
};

export const fetchDashboardStats = createAsyncThunk<
    DashboardStats,
    string,
    { rejectValue: string }
>(
    "dashboard/fetchDashboardStats",
    async (token, { rejectWithValue }) => {
        try {
            const [accommodationsResponse, usersResponse, revenueResponse] =
                await Promise.all([
                    fetch("/api/accommodations"),
                    fetch("/api/users", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }),
                    fetch("/api/payments/revenue", {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                ]);

            if (
                !accommodationsResponse.ok ||
                !usersResponse.ok ||
                !revenueResponse.ok
            ) {
                return rejectWithValue(
                    "Failed to fetch dashboard statistics."
                );
            }

            const accommodations = await accommodationsResponse.json();
            const users = await usersResponse.json();
            const revenue = await revenueResponse.json();

            return {
                totalAccommodations: accommodations.length,
                totalCustomers: users.length,
                totalRevenue: Number(revenue.totalRevenue) || 0
            };
        } catch (error) {
            return rejectWithValue(
                "Unable to fetch dashboard statistics."
            );
        }
    }
);

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        openDashboardForm: (state) => {
            state.showForm = true;
        },
        closeDashboardForm: (state) => {
            state.showForm = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.loading = false;
                state.totalAccommodations =
                    action.payload.totalAccommodations;
                state.totalCustomers = action.payload.totalCustomers;
                state.totalRevenue = action.payload.totalRevenue;
            })
            .addCase(fetchDashboardStats.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload || "Failed to fetch dashboard statistics.";
            });
    }
});

export const { openDashboardForm, closeDashboardForm } =
    dashboardSlice.actions;

export default dashboardSlice.reducer;
