import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../types';
import { fetchMasterByIdApi, fetchMastersApi } from '../services/masters';

export type MastersState = {
  status: 'idle' | 'loading' | 'success' | 'error';
  masters: User[];
  page: number;
  limit: number;
  count: number;
  q: string;
  error?: string;
  master: User | null;
  masterStatus: 'idle' | 'loading' | 'success' | 'error';
  masterError?: string;
};

const initialState: MastersState = {
  status: 'idle',
  masters: [],
  page: 1,
  limit: 50,
  count: 0,
  q: '',
  master: null,
  masterStatus: 'idle',
};

export const fetchMasters = createAsyncThunk<
  { items: User[]; page: number; limit: number; count: number },
  { q?: string; page?: number; limit?: number } | void,
  { rejectValue: string }
>('masters/fetch', async (args, { rejectWithValue }) => {
  try {
    const params = args ?? {};
    const data = await fetchMastersApi(params);
    return data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return rejectWithValue(e?.message ?? 'Не удалось загрузить мастеров');
  }
});

export const fetchMasterById = createAsyncThunk<
  User,
  { id: number | string },
  { rejectValue: string }
>('masters/fetchById', async ({ id }, { rejectWithValue }) => {
  try {
    return await fetchMasterByIdApi(id);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return rejectWithValue(e?.message ?? 'Не удалось загрузить мастера');
  }
});

const mastersSlice = createSlice({
  name: 'masters',
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.q = action.payload;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = Math.max(1, action.payload);
    },
    setLimit(state, action: PayloadAction<number>) {
      state.limit = Math.max(1, action.payload);
    },
    clearMasters(state) {
      state.masters = [];
      state.count = 0;
      state.status = 'idle';
      state.error = undefined;
    },
    clearMaster(state) {
      state.master = null;
      state.masterStatus = 'idle';
      state.masterError = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMasters.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(fetchMasters.fulfilled, (state, action) => {
        state.status = 'success';
        state.masters = action.payload.items;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.count = action.payload.count;
      })
      .addCase(fetchMasters.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload ?? 'Ошибка загрузки';
      })
      .addCase(fetchMasterById.pending, (state) => {
        state.masterStatus = 'loading';
        state.masterError = undefined;
      })
      .addCase(fetchMasterById.fulfilled, (state, action) => {
        state.masterStatus = 'success';
        state.master = action.payload;

        // опционально: обновим запись в списке, если она есть
        const idx = state.masters.findIndex(m => m.id === action.payload.id);
        if (idx >= 0) state.masters[idx] = action.payload;
      })
      .addCase(fetchMasterById.rejected, (state, action) => {
        state.masterStatus = 'error';
        state.masterError = action.payload ?? 'Ошибка загрузки';
      });
  },
});

export const { setQuery, setPage, setLimit, clearMasters, clearMaster } = mastersSlice.actions;
export default mastersSlice.reducer;