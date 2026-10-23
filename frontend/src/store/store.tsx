import { configureStore } from '@reduxjs/toolkit'
import authReducer from "../features/authSlice"
import accommodationReducer from "../features/accomodationSlice"
import roomReducer from "../features/roomSlice";
import customersReducer from "../features/customerSlice"
import bookingReducer from "../features/bookingSlice";

const savedAuth = localStorage.getItem("auth")

const preloadedAuth = savedAuth
  ? {
      auth: {
        ...authReducer(undefined, { type: "INIT" }),
        ...JSON.parse(savedAuth)
      }
    }
  : undefined
  
export const store = configureStore({
reducer: {
    auth: authReducer,
    accommodation: accommodationReducer,
    room: roomReducer,
    customers: customersReducer,
    booking: bookingReducer
},
preloadedState: preloadedAuth
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

store.subscribe(() => {
  console.log("Redux auth token exists:", !!store.getState().auth.token)
})