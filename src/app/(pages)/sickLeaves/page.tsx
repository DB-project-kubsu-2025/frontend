import { apiFetch } from '@/utils/apiFetch';
import SickLeavesClient from './client';
import { LeavesCalendarProps } from '@/types/common';

export default async function SickLeavesPage() {
  const res = await apiFetch('/sickLeaves?year=2025', { local: true});
  const res1 = res.data as LeavesCalendarProps;
  return <SickLeavesClient {...res1} />;
}
