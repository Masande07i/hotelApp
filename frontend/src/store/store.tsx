import { configureStore } from '@reduxjs/toolkit'
import authReducer from "../features/authSlice"
import accommodationReducer from "../features/accomodationSlice"
import roomReducer from "../features/roomSlice";
import customersReducer from "../features/customerSlice"
import bookingReducer from "../features/bookingSlice";

export const store = configureStore({
reducer: {
    auth: authReducer,
    accommodation: accommodationReducer,
    room: roomReducer,
    customers: customersReducer,
    booking: bookingReducer
}})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
