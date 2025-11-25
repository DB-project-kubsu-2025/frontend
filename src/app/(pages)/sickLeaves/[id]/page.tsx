import { apiFetch } from '@/utils/apiFetch';
import SickLeavesClientEdit from './client';
import { calendarLeavesEdit } from '@/types/common';

export default async function SickLeavesPageEdit({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const idNum = Number(id);

  const res: calendarLeavesEdit = await apiFetch(
    `/sickLeaves/${idNum}?year=${String(sp?.year)}`,
  );
  return <SickLeavesClientEdit id={idNum} initData={res} />;
}
