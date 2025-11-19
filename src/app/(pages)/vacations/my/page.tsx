import { apiFetch } from '@/utils/apiFetch';
import MyVacationsClient from './client';
import { LeavesCalendarProps } from '@/types/common';

export default async function VacationsPage() {
  const res: LeavesCalendarProps = await apiFetch('/vacations/my?year=2025');
  return <MyVacationsClient {...res} />;
}
