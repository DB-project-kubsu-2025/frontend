import {
  addDays,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
} from 'date-fns';

export type LeaveStatus = 'done' | 'planned';
export type Leave = { start: string; end: string; status: LeaveStatus };

export function monthMatrix(
  year: number,
  monthIndex0: number,
  weekStartsOn: 1 | 0 = 1,
) {
  const first = startOfWeek(startOfMonth(new Date(year, monthIndex0, 1)), {
    weekStartsOn,
  });
  const last = endOfWeek(endOfMonth(new Date(year, monthIndex0, 1)), {
    weekStartsOn,
  });
  const days: Date[] = [];
  for (let d = first; d <= last; d = addDays(d, 1)) days.push(d);
  return days;
}

export function dayInAnyLeave(day: Date, leaves: Leave[]) {
  for (const lv of leaves) {
    const s = new Date(lv.start),
      e = new Date(lv.end);
    if (day >= s && day <= e) return lv.status;
  }
  return null;
}
