'use client';

import { useState } from 'react';
import { Box, Grid } from '@mui/material';
import MonthCalendar from '@/components/MonthCalendar';
import { LeavesCalendarProps } from '@/types/common';
import { useCalendarLeaves } from '@/hooks/useCalendarLeaves';
import CalendarLeftInfo from '@/components/widgets/vacation/CalendarLeftInfo';
import CalendarHead from '@/components/widgets/calendar/CalendarHead';

export default function MyVacationsClient(initData: LeavesCalendarProps) {
  const currYear = new Date().getFullYear();
  const years = Array.from({ length: currYear - 2023 }, (_, i) => 2024 + i);
  const [year, setYear] = useState(currYear);
  const { data } = useCalendarLeaves('vacations', year, initData);

  return (
    <Box sx={{ background: '#fff', p: 2 }}>
      <CalendarHead
        btnText="Изменить график отпусков"
        years={years}
        year={year}
        setYear={setYear}
      />

      <Grid
        container
        spacing={2}
        sx={{ flexDirection: 'row', flexWrap: 'nowrap' }}
      >
        <Grid sx={{ flex: '0 0 auto' }}>
          <CalendarLeftInfo data={data} />
        </Grid>

        <Grid sx={{ flex: '1 1 auto' }}>
          <Grid container spacing={2}>
            {Array.from({ length: 12 }).map((_, m) => (
              <Grid key={m} size={{ xl: 2, lg: 4, md: 6, xs: 12 }}>
                <MonthCalendar
                  year={year}
                  monthIndex0={m}
                  leaves={data?.calendarLeaves}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
