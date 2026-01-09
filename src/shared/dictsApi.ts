import { apiFetch } from '@/utils/apiFetch';

export type DictItem = { id: number; name: string };

const dictsApi = {
  getCouponsDiscountsTypes: async () => (await apiFetch('/shops/coupons/discounts/types/')) as DictItem[],
  getMovementsTypes: async () => (await apiFetch('/shops/movements/types/')) as DictItem[],
  getPriceListsBases: async () => (await apiFetch('/shops/price-lists/bases/')) as DictItem[],
  getPriceListsTypes: async () => (await apiFetch('/shops/price-lists/types/')) as DictItem[],
  getStockTakesTypes: async () => (await apiFetch('/shops/stock-takes/types/')) as DictItem[],
  getStoragesSpacesTypes: async () => (await apiFetch('/shops/storages/spaces/types/')) as DictItem[],
  getStoragesTypes: async () => (await apiFetch('/shops/storages/types/')) as DictItem[],
  getWriteoffsReasons: async () => (await apiFetch('/shops/writeoffs/reasons/')) as DictItem[],
  getPaymentMethods: async () =>
    (await apiFetch('/shops/payments/methods')) as DictItem[],
  getCategories: async () =>
    (await apiFetch('/shops/products/categories')) as DictItem[],
  getUnits: async () => (await apiFetch('/shops/products/units')) as DictItem[],
};

export default dictsApi;