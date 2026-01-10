import { apiFetch } from '@/utils/apiFetch';
import TimeTrackClient from './client';

export default async function TimeTrackPage() {
  const res = await apiFetch('/timeTrack?month=11&year=2025', { local: true });
  const data = (res.data as any) ?? { events: [], employees: [] };
  return <TimeTrackClient data={data} />;
}
