import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { User } from '../types';
import { updateWorkingDaysApi } from '../services/users';

export type UserState = {
  status: 'idle' | 'loading' | 'success' | 'error';
  current?: User | null;   // если хранишь профиль отдельно от auth
  error?: string;
};

const initialState: UserState = {
  status: 'idle',
  current: null,
};

export const updateWorkingDays = createAsyncThunk<
  User,                                // что вернём
  { userId: number | string; workingDays: string[] }, // входные параметры
  { rejectValue: string }
>('user/updateWorkingDays', async ({ userId, workingDays }, { rejectWithValue }) => {
  try {
    return await updateWorkingDaysApi(userId, workingDays);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return rejectWithValue(e?.message ?? 'Не удалось обновить рабочие дни');
  }
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateWorkingDays.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(updateWorkingDays.fulfilled, (state, action) => {
        state.status = 'success';
        // если ведёшь профиль и тут, обновим его
        if (state.current && state.current.id === action.payload.id) {
          state.current = action.payload;
        }
      })
      .addCase(updateWorkingDays.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload ?? 'Ошибка обновления';
      });
  },
});

export default userSlice.reducer;