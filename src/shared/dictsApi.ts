import { apiFetch } from '@/utils/apiFetch';

export type DictItem = { id: number; name: string };

const dictsApi = {
  getCouponsDiscountsTypes: async () => (await apiFetch('/shops/coupons/discounts/types/')).data as DictItem[],
  getMovementsTypes: async () => (await apiFetch('/shops/movements/types/')).data as DictItem[],
  getPriceListsBases: async () => (await apiFetch('/shops/price-lists/bases/')).data as DictItem[],
  getPriceListsTypes: async () => (await apiFetch('/shops/price-lists/types/')).data as DictItem[],
  getStockTakesTypes: async () => (await apiFetch('/shops/stock-takes/types/')).data as DictItem[],
  getStoragesSpacesTypes: async () => (await apiFetch('/shops/storages/spaces/types/')).data as DictItem[],
  getStoragesTypes: async () => (await apiFetch('/shops/storages/types/')).data as DictItem[],
  getWriteoffsReasons: async () => (await apiFetch('/shops/writeoffs/reasons/')).data as DictItem[],
  getPaymentMethods: async () => (await apiFetch('/shops/payments/methods/')).data as DictItem[],
  getCategories: async () => (await apiFetch('/shops/products/categories/')).data as DictItem[],
  getUnits: async () => (await apiFetch('/shops/products/units/')).data as DictItem[],
};

export default dictsApi;