import { differenceInCalendarDays, parseISO } from "date-fns";

export const safeText = (str: any, replace: string = ''): string => {
  return str || replace;
};

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

export function differenceDates(date1: string, date2: string): number {
  return (
    differenceInCalendarDays(parseISO(date2), parseISO(date1)) + 1
  );
}
