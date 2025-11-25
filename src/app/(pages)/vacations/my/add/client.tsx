'use client';

import { useState } from 'react';
import { Button, Grid, Stack, Typography } from '@mui/material';
import MonthCalendar from '@/components/MonthCalendar';
import { SubjectMode, calendarLeaves } from '@/types/common';
import CalendarHead from '@/components/widgets/calendar/CalendarHead';
import { differenceDates, formatDate } from '@/utils/helper';
import { useApiRequest } from '@/hooks/useApiRequest';
import { enqueueSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import { queryClient } from '@/utils/queryClient';

interface CalendarLeavesObj {
  calendar: calendarLeaves
}
const DEFAULT_CALENDAR_DATA: CalendarLeavesObj = {
  calendar: {
    id: 0,
    start_date: '',
    end_date: '',
    status: 'planned',
  }
};

export default function MyVacationsClientEdit() {
  const router = useRouter();
  const { request } = useApiRequest();
  const currYear = new Date().getFullYear();
  const years = Array.from({ length: currYear - 2023 }, (_, i) => currYear + i);
  const [year, setYear] = useState(currYear);
  const [data, setData] = useState(DEFAULT_CALENDAR_DATA);
  const [mode, setMode] = useState<SubjectMode>('edit');
  console.log(data);

  function handleClearCalendar() {
    setData((prev: CalendarLeavesObj) => {
      return {
        ...prev,
        DEFAULT_CALENDAR_DATA
      };
    });
    setMode('edit');
  }

  function handleSelectDate(d: Date) {
    const date_format = formatDate(d, 'ymd');
    if (!data?.calendar?.start_date) {
      setData((prev: CalendarLeavesObj) => {
        return {
          ...prev,
          calendar: {
            ...prev.calendar,
            start_date: date_format,
          },
        };
      });
    } else {
      console.log(differenceDates(data?.calendar?.start_date, date_format));
      if (differenceDates(data?.calendar?.start_date, date_format) < 2) {
        return;
      }

      setData((prev: CalendarLeavesObj) => {
        return {
          ...prev,
          calendar: {
            ...prev.calendar,
            end_date: date_format,
          },
        };
      });
      setMode('view');
    }
  }

  const isSelectCalendar = (): boolean => {
    const calendar = data?.calendar;
    return (
      calendar?.id !== 0 ||
      calendar?.start_date === '' ||
      calendar?.end_date === ''
    );
  };

  async function handleUpdateLeave() {
    const res = await request(`/vacations/my`, {
      method: 'POST',
      data: { calendar: data?.calendar },
    }).catch(() => null);

    if (!res) return;

    enqueueSnackbar(res.message, { variant: 'success' });
    queryClient.invalidateQueries({ queryKey: ['vacations/my'] });
    router.push('/vacations/my');
    router.refresh();
  }

  return (
    <Stack sx={{ background: '#fff', p: 2 }}>
      <CalendarHead years={years} year={year} setYear={setYear} />

      <Grid>
        <Stack sx={{ alignItems: 'end', mt: 1 }}>
          {mode === 'view' ? (
            <Button variant="text" onClick={() => handleClearCalendar()}>
              Очистить
            </Button>
          ) : (
            <Typography
              variant="subtitle1"
              color="textSecondary"
              sx={{ mb: 1.1 }}
            >
              Выберите даты
            </Typography>
          )}
        </Stack>
        <Grid container spacing={2}>
          {Array.from({ length: 12 }).map((_, m) => (
            <Grid key={m} size={{ xl: 2, lg: 3, md: 4, sm: 6, xs: 12 }}>
              <MonthCalendar
                mode={mode}
                year={year}
                monthIndex0={m}
                leaves={[data?.calendar]}
                backOpacity={true}
                onDateClick={handleSelectDate}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>

      <Stack
        sx={{ flexDirection: 'row', justifyContent: 'end', gap: 1, mt: 2 }}
      >
        <Button
          variant="contained"
          color="success"
          disabled={isSelectCalendar()}
          onClick={() => handleUpdateLeave()}
        >
          Добавить
        </Button>
      </Stack>
    </Stack>
  );
}
