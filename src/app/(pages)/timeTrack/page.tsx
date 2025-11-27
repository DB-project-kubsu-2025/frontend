import { CalendarTimeTrack, employeesList } from '@/types/common';
import { apiFetch } from '@/utils/apiFetch';
import TimeTrackClient from './client';

export default async function TimeTrackPage() {
  const res: { events: CalendarTimeTrack[]; employees: employeesList[] } =
    await apiFetch('/timeTrack?month=11&year=2025');
  console.log(res);
  return <TimeTrackClient events={res?.events} employees={res?.employees} />;
}
