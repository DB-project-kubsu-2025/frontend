export type employeeNames =
  | 'Сотрудник ГК'
  | 'Директор магазина'
  | 'Товаровед'
  | 'Кладовщик'
  | 'Продавец';

export type statusTypes = 'done' | 'planned';
export type SubjectMode = 'view' | 'edit' | 'create';
export type nameSubjects = 'products';

export interface ComponentSelectItem {
  id: number | string;
  [key: string]: any;
}

export interface UISelectProps {
  value: string | number | undefined;
  label?: string;
  selectValues?: ComponentSelectItem[];
  sortName?: string;
  setInputsData: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  fieldsError?: string | null;
  setFieldsError?: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  inputsDataPath: string[];
}

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
  title: string;
  employee_role_id: number;
  date?: string;
  start?: string;
  end?: string;
  color?: string;
}

export interface CalendarTimeTrack {
  id: string;
  date: string;
  employee_name: string;
  work_time: number;
  all_time: number;
}

export interface calendarLeavesEdit {
  number: number;
  calendar: calendarLeaves;
}