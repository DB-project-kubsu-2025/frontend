import { apiFetch } from '@/utils/apiFetch';

export type DictItem = { id: number; name: string };

const dictsApi = {
  getUnits: async () => (await apiFetch('/shops/products/units')) as DictItem[],
  getCategories: async () =>
    (await apiFetch('/shops/products/categories')) as DictItem[],
  getPaymentMethods: async () =>
    (await apiFetch('/shops/payments/methods')) as DictItem[],
};

export default dictsApi;