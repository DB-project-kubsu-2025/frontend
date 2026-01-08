import { apiFetch } from '@/utils/apiFetch';
import ProductsClient from './client';

export default async function ProductsPage() {
  const res: any = await apiFetch('/shops/products/');
  return <ProductsClient initData={res} />;
}
