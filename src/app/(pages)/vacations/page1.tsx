import { apiFetch } from '@/utils/apiFetch';
import VacationsClient from './client1';
import { LeavesCalendarProps } from '@/types/common';

export default async function VacationsPage() {
  const res: LeavesCalendarProps = await apiFetch('/vacations?year=2025');
  return <VacationsClient {...res} />;
}
