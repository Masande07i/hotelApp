
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface PaymentResponse {
    message: string;
}

interface PaymentState {
    status: "idle" | "loading" | "success" | "failed";
    message: string;
}

const initialState: PaymentState = {
    status: "idle",
    message: ""
};

export const verifyPayment = createAsyncThunk<
    PaymentResponse,
    { reference: string; token: string },
    { rejectValue: string }
>(
    "payment/verifyPayment",
    async ({ reference, token }, { rejectWithValue }) => {
        if (!reference) {
            return rejectWithValue("Payment reference was not found.");
        }
        try {
            const response = await fetch(
                `/api/payments/verify?reference=${encodeURIComponent(reference)}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                return rejectWithValue(
                    data.message || "Payment verification failed."
                );
            }

            return {
                message: "Your payment was successful. Your booking is confirmed."
            };
        } catch (error) {
            return rejectWithValue(
                "Unable to verify your payment. Please try again."
            );
        }
    }
);

const paymentSlice = createSlice({
    name: "payment",
    initialState,
    reducers: {
        resetPayment: (state) => {
            state.status = "idle";
            state.message = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(verifyPayment.pending, (state) => {
                state.status = "loading";
                state.message = "Verifying your payment...";
            })
            .addCase(verifyPayment.fulfilled, (state, action) => {
                state.status = "success";
                state.message = action.payload.message;
            })
            .addCase(verifyPayment.rejected, (state, action) => {
                state.status = "failed";
                state.message =
                    action.payload || "Payment verification failed.";
            });
    }
});

export const { resetPayment } = paymentSlice.actions;

export default paymentSlice.reducer;
