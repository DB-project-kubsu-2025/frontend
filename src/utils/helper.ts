import { statusTypes } from '@/types/common';
import { differenceInCalendarDays, parseISO } from 'date-fns';

export const safeText = (str: any, replace: string = ''): string => {
  return str || replace;
};

export const isNonEmptyString = (v: unknown) =>
  typeof v === 'string' && v.trim().length > 0;

export const isValidNumberString = (v: unknown, minLen?: number, maxLen?: number) => {
  const s = String(v ?? '').replace(/\D/g, '');
  if (!s) return false;
  if (minLen && s.length < minLen) return false;
  if (maxLen && s.length > maxLen) return false;
  return true;
};

export const isValidDate = (v: unknown) => {
  if (v instanceof Date) return !Number.isNaN(v.getTime());
  if (typeof v === 'string') return v.trim().length > 0;
  return false;
};

export function formatDate(
  dateString: undefined | string | Date,
  format: 'dmy' | 'ymd' = 'dmy',
): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return format === 'dmy'
    ? `${day}.${month}.${year}`
    : `${year}-${month}-${day}`;
}

export function differenceDates(date1: string, date2: string): number {
  return differenceInCalendarDays(parseISO(date2), parseISO(date1)) + 1;
}

export function getStatusRus(status: statusTypes) {
  switch (status) {
    case 'done':
      return 'ЗАВЕРШЕНО';
    case 'planned':
      return 'ЗАПЛАНИРОВАННО';
    default:
      return '';
  }
}

export function getStatusColor(status: statusTypes) {
  switch (status) {
    case 'done':
      return '#96ce70';
    case 'planned':
      return '#8a94d1';
    default:
      return '#000';
  }
}
