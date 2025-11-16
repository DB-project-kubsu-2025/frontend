
import { CalendarEvents } from "@/types/common";
import { apiFetch } from "@/utils/apiFetch";
import Client from "./client";

export default async function CalendarPage() {
  const res: CalendarEvents[] = await apiFetch('/vacations?month=11&year=2025');
  console.log(res);
  return <Client initData={res} />;
}
