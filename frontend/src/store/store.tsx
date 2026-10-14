import { configureStore } from '@reduxjs/toolkit'
import authReducer from "../features/authSlice"
import accommodationReducer from "../features/accomodationSlice"

export const store = configureStore({
reducer: {
auth: authReducer,
accommodation: accommodationReducer
}
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
