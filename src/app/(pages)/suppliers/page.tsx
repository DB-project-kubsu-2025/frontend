import { apiFetch } from '@/utils/apiFetch';
import SuppliersClient from './client';

export default async function SuppliersPage() {
  const res: any = (await apiFetch('/supplies/suppliers/')).data;
  console.log(res);
  return <SuppliersClient initData={res} />;
}
