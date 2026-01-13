import { apiFetch } from '@/utils/apiFetch';
import CouponsClient from './client';

export default async function CouponsPage() {
  const res = await apiFetch('/shops/coupons/');
  console.log(res);

  if (!res.ok) {
    console.error('[CouponsPage] fetch error:', res.status, res.data ?? res.text);
    return <CouponsClient initData={[]} />;
  }

  const raw = res.data;
  const list = Array.isArray(raw) ? raw : Array.isArray(raw?.results) ? raw.results : [];

  return <CouponsClient initData={list} />;
}
