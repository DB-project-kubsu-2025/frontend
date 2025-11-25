'use client';

import { useState } from 'react';
import { Grid, Stack, Button } from '@mui/material';
import MonthCalendar from '@/components/MonthCalendar';
import { LeavesCalendarProps } from '@/types/common';
import { useCalendarLeaves } from '@/hooks/useCalendarLeaves';
import CalendarSubHeadInfo from '@/components/widgets/calendar/CalendarSubHeadInfo';
import CalendarHead from '@/components/widgets/calendar/CalendarHead';
import Link from 'next/link';

export default function SickLeavesClient(initData: LeavesCalendarProps) {
  const currYear = new Date().getFullYear();
  const years = Array.from({ length: currYear - 2023 + 1 }, (_, i) => 2024 + i);
  const [year, setYear] = useState(currYear);
  const { data } = useCalendarLeaves('sickLeaves', year, initData);

  return (
    <Stack sx={{ background: '#fff', p: 2 }} spacing={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="start">
        <Button variant="contained" component={Link} href="/sickLeaves/add">
          Добавить
        </Button>
        <CalendarHead years={years} year={year} setYear={setYear} />
      </Stack>

      <CalendarSubHeadInfo href="/sickLeaves" year={year} data={data} />

      <Grid>
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
