import { CalendarEvents, employeesList } from '@/types/common';
import { apiFetch } from '@/utils/apiFetch';
import VacationsClient from './client';

export default async function CalendarPage() {
  const res = await apiFetch('/vacations?month=11&year=2025', { local: true });
  console.log(res);
  const res1 = res.data?.events as CalendarEvents[];
  const res2 = res.data?.employees as employeesList[];
  return <VacationsClient events={res1} employees={res2} />;
}
