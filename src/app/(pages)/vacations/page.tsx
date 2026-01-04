import { CalendarEvents, employeesList } from '@/types/common';
import { apiFetch } from '@/utils/apiFetch';
import VacationsClient from './client';

export default async function CalendarPage() { 
  const res: { events: CalendarEvents[]; employees: employeesList[] } =
    await apiFetch('/vacations?month=11&year=2025');
  console.log(res);
  return <VacationsClient   events={res?.events} employees={res?.employees} />;
}
