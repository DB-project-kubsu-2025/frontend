import { apiFetch } from '@/utils/apiFetch';
import VacationsClient from './client';

export default async function VacationsPage() {
  const res = await apiFetch('/vacations');
  console.log(res, '--vacations ');
  return <VacationsClient />;
}
