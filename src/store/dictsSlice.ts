import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiRequest } from '@/shared/api/request';

export type DictItem = { id: number; name: string };

type DictState = {
  couponsDiscountsTypes: DictItem[];
  movementsTypes: DictItem[];
  priceListsBases: DictItem[];
  priceListsTypes: DictItem[];
  stockTakesTypes: DictItem[];
  storagesSpacesTypes: DictItem[];
  storagesTypes: DictItem[];
  writeoffsReasons: DictItem[];
  paymentMethods: DictItem[];
  categories: DictItem[];
  units: DictItem[];

  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string | null;
  lastLoadedAt?: number | null;
  invalidated?: boolean;
};

const initialState: DictState = {
  couponsDiscountsTypes: [],
  movementsTypes: [],
  priceListsBases: [],
  priceListsTypes: [],
  stockTakesTypes: [],
  storagesSpacesTypes: [],
  storagesTypes: [],
  writeoffsReasons: [],
  paymentMethods: [],
  categories: [],
  units: [],
  storages: [],
  products: [],
  status: 'idle',
  error: null,
  lastLoadedAt: null,
  invalidated: true,
};

const TTL_MS = 10 * 60 * 1000;

type DictsPayload = {
  couponsDiscountsTypes: DictItem[];
  movementsTypes: DictItem[];
  priceListsBases: DictItem[];
  priceListsTypes: DictItem[];
  stockTakesTypes: DictItem[];
  storagesSpacesTypes: DictItem[];
  storagesTypes: DictItem[];
  writeoffsReasons: DictItem[];
  paymentMethods: DictItem[];
  categories: DictItem[];
  units: DictItem[];
};

export const preloadDicts = createAsyncThunk<
  DictsPayload,
  { force?: boolean } | void,
  { state: any }
>(
  'dicts/preload',
  async () => {
    const res = await apiRequest<DictsPayload>('/getDicts', { method: 'GET' });
    return res.data;
  },
  {
    condition: (arg, { getState }) => {
      const state = getState();
      const dicts = state.dicts as DictState | undefined;

      const last = dicts?.lastLoadedAt ?? null;
      const status = dicts?.status;
      const invalidated = dicts?.invalidated ?? false;

      if ((arg as any)?.force) return true;
      if (status === 'loading') return false;
      if (invalidated) return true;
      if (last && Date.now() - last < TTL_MS) return false;

      const hasAny =
        (dicts?.couponsDiscountsTypes?.length ?? 0) > 0 ||
        (dicts?.movementsTypes?.length ?? 0) > 0 ||
        (dicts?.priceListsBases?.length ?? 0) > 0 ||
        (dicts?.priceListsTypes?.length ?? 0) > 0 ||
        (dicts?.stockTakesTypes?.length ?? 0) > 0 ||
        (dicts?.storagesSpacesTypes?.length ?? 0) > 0 ||
        (dicts?.storagesTypes?.length ?? 0) > 0 ||
        (dicts?.writeoffsReasons?.length ?? 0) > 0 ||
        (dicts?.paymentMethods?.length ?? 0) > 0 ||
        (dicts?.categories?.length ?? 0) > 0 ||
        (dicts?.units?.length ?? 0) > 0;

      return !hasAny || !last;
    },
  },
);

const dictsSlice = createSlice({
  name: 'dicts',
  initialState,
  reducers: {
    invalidateDicts(state) {
      state.invalidated = true;
    },

    clearDicts() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(preloadDicts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(preloadDicts.fulfilled, (state, action) => {
        state.status = 'succeeded';

        state.couponsDiscountsTypes = action.payload.couponsDiscountsTypes;
        state.movementsTypes = action.payload.movementsTypes;
        state.priceListsBases = action.payload.priceListsBases;
        state.priceListsTypes = action.payload.priceListsTypes;
        state.stockTakesTypes = action.payload.stockTakesTypes;
        state.storagesSpacesTypes = action.payload.storagesSpacesTypes;
        state.storagesTypes = action.payload.storagesTypes;
        state.writeoffsReasons = action.payload.writeoffsReasons;
        state.paymentMethods = action.payload.paymentMethods;
        state.categories = action.payload.categories;
        state.units = action.payload.units;

        state.lastLoadedAt = Date.now();
        state.invalidated = false;
      })
      .addCase(preloadDicts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load dicts';
      });
  },
});

export const { invalidateDicts, clearDicts } = dictsSlice.actions;
export default dictsSlice.reducer;
