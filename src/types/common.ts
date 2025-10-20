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
