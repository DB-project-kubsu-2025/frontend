import { apiFetch } from '@/utils/apiFetch';
import VacationsClient from './client';

export default async function VacationsPage() {
  const res = await apiFetch('/vacations');
  
  return (
    <VacationsClient
      used_days={res?.used_days || 0}
      balance_days={res?.balance_days || 0}
      planned_days={res?.planned_days || 0}
      calendarLeaves={res?.calendarLeaves || []}
    />
  );
}
