import { CalendarTimeTrack } from '@/types/common';
import { apiFetch } from '@/utils/apiFetch';
import TimeTrackClient from './client';

export default async function TimeTrackPage() {
  const res = await apiFetch(
    '/timeTrack?month=11&year=2025',
  );
  console.log(res);
  const res1 = res.data as CalendarTimeTrack[];
  return <TimeTrackClient events={res1} />;
}
