'use client';
import CalendarWidget from "@/components/widgets/calendar/CalendarWidget";
import { CalendarEvents } from "@/types/common";

export default function CalendarClient({initData}: {initData: CalendarEvents[]}) {
  console.log(initData);
  return <CalendarWidget events={initData} />;
}