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
  storages: DictItem[];
  products: DictItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string | null;
  lastLoadedAt?: number | null;
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
};

const TTL_MS = 10 * 60 * 1000;

export const preloadDicts = createAsyncThunk<
  {
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
    storages: DictItem[];
    products: DictItem[];
  },
  { force?: boolean } | void,
  { state: any }
>(
  'dicts/preload',
  async () => {
    const res = await apiRequest<{
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
      storages: DictItem[];
      products: DictItem[];
    }>('/getDicts', { method: 'GET' });
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
        (state.dicts?.couponsDiscountsTypes?.length ?? 0) > 0 ||
        (state.dicts?.movementsTypes?.length ?? 0) > 0 ||
        (state.dicts?.priceListsBases?.length ?? 0) > 0 ||
        (state.dicts?.priceListsTypes?.length ?? 0) > 0 ||
        (state.dicts?.stockTakesTypes?.length ?? 0) > 0 ||
        (state.dicts?.storagesSpacesTypes?.length ?? 0) > 0 ||
        (state.dicts?.storagesTypes?.length ?? 0) > 0 ||
        (state.dicts?.writeoffsReasons?.length ?? 0) > 0 ||
        (state.dicts?.paymentMethods?.length ?? 0) > 0 ||
        (state.dicts?.categories?.length ?? 0) > 0 ||
        (state.dicts?.units?.length ?? 0) > 0 ||
        (state.dicts?.storages?.length ?? 0) > 0 ||
        (state.dicts?.products?.length ?? 0) > 0;


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
        state.storages = action.payload.storages;
        state.products = action.payload.products;
        state.lastLoadedAt = Date.now();
      })
      .addCase(preloadDicts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load dicts';
      });
  },
});

export default dictsSlice.reducer;
