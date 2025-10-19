import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { User, Credentials } from '../types'
import { signIn as apiSignIn, me as apiMe, signOut as apiSignOut, refresh as apiRefresh, clearAccessToken } from '../services/auth'
import { updateWorkingDays } from './userSlice'

export type AuthState = {
  status: 'idle' | 'loading' | 'authenticated' | 'error'
  user: User | null
  accessToken: string | null
  error?: string
}

const initialState: AuthState = {
  status: 'idle',
  user: null,
  accessToken: null,
}

export const signIn = createAsyncThunk('auth/signIn', async (cred: Credentials, { rejectWithValue }) => {
  try {
    const { user, accessToken } = await apiSignIn(cred)
    return { user, accessToken }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return rejectWithValue(e?.message ?? 'Не удалось войти')
  }
})

export const signOut = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await apiSignOut()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return rejectWithValue(e?.message ?? 'Ошибка выхода')
  }
})

export const refresh = createAsyncThunk(
  'auth/refresh',
  async (_, { rejectWithValue }) => {
    try {
      return await apiRefresh()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      return rejectWithValue(e?.message ?? 'Сессия недействительна')
    }
  }
)

export const fetchMe = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    return await apiMe()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return rejectWithValue(e?.message ?? 'Сессия недействительна')
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signIn.pending, (state) => {
        state.status = 'loading'
        state.error = undefined
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.status = 'authenticated'
        state.user = action.payload.user
        state.accessToken = action.payload.accessToken
      })
      .addCase(signIn.rejected, (state, action) => {
        state.status = 'error'
        state.error = action.payload as string
      })
      .addCase(signOut.fulfilled, (state) => {
        state.status = 'idle'
        state.user = null
        state.accessToken = null
        clearAccessToken()
      })
      .addCase(refresh.fulfilled, (state, action) => {
        state.status = 'authenticated'
        state.accessToken = action.payload
      })
      .addCase(refresh.rejected, (state, action) => {
        state.status = 'idle'
        state.accessToken = null
        state.error = action.payload as string
        clearAccessToken()
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.status = 'authenticated'
        state.user = action.payload
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.status = 'idle'
        state.user = null
        state.error = action.payload as string
      })
      .addCase(updateWorkingDays.fulfilled, (state, action) => {
        if (state.user && state.user.id === action.payload.id) {
          state.user = action.payload
        }
      })
  },
})

export default authSlice.reducer
