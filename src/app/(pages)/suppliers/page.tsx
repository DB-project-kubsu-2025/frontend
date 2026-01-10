import { apiFetch } from '@/utils/apiFetch';
import PositionsClient from './client';

export default async function PositionsPage() {
  const res: any = (await apiFetch('/employees/job-positions')).data;
  return <PositionsClient initData={res} />;
}
