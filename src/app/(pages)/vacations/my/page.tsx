import { apiFetch } from '@/utils/apiFetch';
import MyVacationsClient from './client';
import { LeavesCalendarProps } from '@/types/common';

export default async function MyVacationsPage() {
  const res = await apiFetch('/vacations/my?year=2025', { local: true });
  const res1 = res.data as LeavesCalendarProps;
  return <MyVacationsClient {...res1} />;
}
