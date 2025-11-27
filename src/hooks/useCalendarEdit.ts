'use client';

import { useState } from 'react';
import { calendarLeavesEdit, SubjectMode } from '@/types/common';
import { formatDate, differenceDates } from '@/utils/helper';

export function useCalendarEdit(initData: calendarLeavesEdit) {
  const currYear = new Date().getFullYear();

  const years = Array.from({ length: currYear - 2023 }, (_, i) => 2024 + i);

  const [year, setYear] = useState(currYear);
  const [data, setData] = useState(initData);
  const [modeCalendar, setModeCalendar] = useState<SubjectMode>('view');

  function handleClearCalendar() {
    setData((prev) => ({
      ...prev,
      calendar: {
        id: 0,
        start_date: '',
        end_date: '',
        status: 'planned',
      },
    }));
    setModeCalendar('edit');
  }

  function handleSelectDate(d: Date) {
    const date_format = formatDate(d, 'ymd');

    if (!data?.calendar?.start_date) {
      setData((prev) => ({
        ...prev,
        calendar: { ...prev.calendar, start_date: date_format },
      }));
      return;
    }

    if (differenceDates(data.calendar.start_date, date_format) < 2) {
      return;
    }

    setData((prev) => ({
      ...prev,
      calendar: { ...prev.calendar, end_date: date_format },
    }));

    setModeCalendar('view');
  }

  const isSelectCalendar = (): boolean => {
    const c = data?.calendar;
    return c?.id !== 0 || c?.start_date === '' || c?.end_date === '';
  };

  return {
    year,
    years,
    setYear,
    data,
    setData,
    modeCalendar,
    setModeCalendar,
    handleClearCalendar,
    handleSelectDate,
    isSelectCalendar,
  };
}
