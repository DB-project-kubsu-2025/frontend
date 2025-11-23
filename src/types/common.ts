export type employeeNames =
  | 'Сотрудник ГК'
  | 'Директор магазина'
  | 'Товаровед'
  | 'Кладовщик'
  | 'Продавец';

export type statusTypes = 'done' | 'planned';
  
export interface employeesList {
  id: number;
  name: employeeNames;
};

export type calendarLeaves = {
  id: number;
  start_date: string;
  end_date: string;
  status: statusTypes;
};
export interface LeavesCalendarProps {
  used_days: number;
  balance_days: number;
  planned_days: number;
  calendarLeaves: calendarLeaves[];
}

export interface CalendarEvents {
  id: string;
  employee_id: number,
  title: string;
  date?: string;
  start?: string;
  end?: string;
  color?: string;
}

export interface calendarLeavesEdit extends calendarLeaves {
  number: number;
  calendar: calendarLeaves;
}