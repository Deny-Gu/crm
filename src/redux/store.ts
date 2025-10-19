import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../auth/authSlice'
import userReducer from '../auth/userSlice'
import mastersReducer from '../auth/mastersSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    masters: mastersReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
