import { apiFetch } from '@/utils/apiFetch';
import SickLeavesClient from './client';
import { LeavesCalendarProps } from '@/types/common';

export default async function VacationsPage() {
  const res: LeavesCalendarProps = await apiFetch('/sickLeaves?year=2025');
  return <SickLeavesClient {...res} />;
}
