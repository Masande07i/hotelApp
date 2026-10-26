import { configureStore } from '@reduxjs/toolkit'
import authReducer from "../features/authSlice"
import accommodationReducer from "../features/accomodationSlice"
import roomReducer from "../features/roomSlice";
import customersReducer from "../features/customerSlice"
import bookingReducer from "../features/bookingSlice";
import favouriteReducer from "../features/favouriteSlice";
import reviewReducer from "../features/reviewSlice";

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
        booking: bookingReducer,
        favourite: favouriteReducer,
        review: reviewReducer,
    },
    preloadedState: preloadedAuth
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
