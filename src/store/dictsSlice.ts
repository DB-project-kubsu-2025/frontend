import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiRequest } from '@/shared/api/request';

export type DictItem = { id: number; name: string };

type DictState = {
  units: DictItem[];
  categories: DictItem[];
  paymentMethods: DictItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string | null;
  lastLoadedAt?: number | null;
};

const initialState: DictState = {
  units: [],
  categories: [],
  paymentMethods: [],
  status: 'idle',
  error: null,
  lastLoadedAt: null,
};

const TTL_MS = 10 * 60 * 1000;

export const preloadDicts = createAsyncThunk<
  { units: DictItem[]; categories: DictItem[]; paymentMethods: DictItem[] },
  { force?: boolean } | void,
  { state: any }
>(
  'dicts/preload',
  async () => {
    const res = await apiRequest<{ units: DictItem[]; categories: DictItem[]; paymentMethods: DictItem[] }>(
      '/getDicts',
      { method: 'GET' },
    );
    return res.data;
  },
  {
    condition: (arg, { getState }) => {
      const state = getState();
      const last = state.dicts?.lastLoadedAt as number | null | undefined;
      const status = state.dicts?.status as string | undefined;

      if (arg?.force) return true;
      if (status === 'loading') return false;
      if (last && Date.now() - last < TTL_MS) return false;

      const hasAny =
        (state.dicts?.units?.length ?? 0) > 0 ||
        (state.dicts?.categories?.length ?? 0) > 0 ||
        (state.dicts?.paymentMethods?.length ?? 0) > 0;

      return !hasAny || !last;
    },
  },
);

const dictsSlice = createSlice({
  name: 'dicts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(preloadDicts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(preloadDicts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.units = action.payload.units;
        state.categories = action.payload.categories;
        state.paymentMethods = action.payload.paymentMethods;
        state.lastLoadedAt = Date.now();
      })
      .addCase(preloadDicts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load dicts';
      });
  },
});

export default dictsSlice.reducer;
