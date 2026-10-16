import { configureStore } from '@reduxjs/toolkit'
import authReducer from "../features/authSlice"
import accommodationReducer from "../features/accomodationSlice"
import roomReducer from "../features/roomSlice";

export const store = configureStore({
reducer: {
    auth: authReducer,
    accommodation: accommodationReducer,
    room: roomReducer
}})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
