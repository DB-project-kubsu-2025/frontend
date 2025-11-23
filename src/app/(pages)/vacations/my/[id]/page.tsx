import { apiFetch } from '@/utils/apiFetch';
import MyVacationsClientEdit from './client';
import { calendarLeavesEdit } from '@/types/common';

export default async function MyVacationsPageEdit({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);

  const res: calendarLeavesEdit = await apiFetch(
    `/vacations/my/${id}?year=${String(sp?.year)}`,
  );
  return <MyVacationsClientEdit {...res} />;
}
