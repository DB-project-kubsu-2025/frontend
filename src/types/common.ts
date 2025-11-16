export type calendarLeaves = {
  id: number;
  employee: string;
  start_date: string;
  end_date: string;
  status: 'done' | 'planned';
};
export interface LeavesCalendarProps {
  used_days: number;
  balance_days: number;
  planned_days: number;
  calendarLeaves: calendarLeaves[];
}

export interface CalendarEvents {
  id: string;
  title: string;
  date?: string;
  start?: string;
  end?: string;
  color?: string;
}