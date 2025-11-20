'use client';

import { useState } from 'react';
import { Grid, Stack } from '@mui/material';
import MonthCalendar from '@/components/MonthCalendar';
import { LeavesCalendarProps } from '@/types/common';
import { useCalendarLeaves } from '@/hooks/useCalendarLeaves';
import CalendarSubHeadInfo from '@/components/widgets/calendar/CalendarSubHeadInfo';
import CalendarHead from '@/components/widgets/calendar/CalendarHead';

export default function SickLeavesClient(initData: LeavesCalendarProps) {
  const currYear = new Date().getFullYear();
  const years = Array.from({ length: currYear - 2023 }, (_, i) => 2024 + i);
  const [year, setYear] = useState(currYear);
  const { data } = useCalendarLeaves('sickLeaves', year, initData);

  return (
    <Stack sx={{ background: '#fff', p: 2 }} spacing={2}>
      <CalendarHead
        btnText="Изменить график больничных"
        href="/sickLeaves"
        years={years}
        year={year}
        setYear={setYear}
      />

      <CalendarSubHeadInfo data={data} />

      <Grid sx={{ flex: '1 1 auto' }}>
        <Grid container spacing={2}>
          {Array.from({ length: 12 }).map((_, m) => (
            <Grid key={m} size={{ xl: 2, lg: 3, md: 4, sm: 6, xs: 12 }}>
              <MonthCalendar
                year={year}
                monthIndex0={m}
                leaves={data?.calendarLeaves}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Stack>
  );
}
