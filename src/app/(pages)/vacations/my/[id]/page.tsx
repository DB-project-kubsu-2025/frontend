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
  const idNum = Number(id);

  const res = await apiFetch(
    `/vacations/my/${idNum}?year=${String(sp?.year)}`,
    { local: true },
  );
  const res1 = res.data as calendarLeavesEdit;
  return <MyVacationsClientEdit id={idNum} initData={res1} />;
}
