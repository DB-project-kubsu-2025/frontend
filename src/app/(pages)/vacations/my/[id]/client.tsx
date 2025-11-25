'use client';

import { useState } from 'react';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import MonthCalendar from '@/components/MonthCalendar';
import { calendarLeavesEdit, SubjectMode } from '@/types/common';
import CalendarHead from '@/components/widgets/calendar/CalendarHead';
import { differenceDates, formatDate } from '@/utils/helper';
import StatusSpan from '@/components/UI/StatusSpan';
import { useConfirm } from '@/components/ConfirmDialog';
import { useApiRequest } from '@/hooks/useApiRequest';
import { enqueueSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import { queryClient } from '@/utils/queryClient';

export default function MyVacationsClientEdit({
  id,
  initData,
}: {
  id: number;
  initData: calendarLeavesEdit;
}) {
  const confirm = useConfirm();
  const router = useRouter();
  const { request } = useApiRequest();
  const currYear = new Date().getFullYear();
  const years = Array.from({ length: currYear - 2023 }, (_, i) => currYear + i);
  const [year, setYear] = useState(currYear);
  const [data, setData] = useState(initData);
  const [mode, setMode] = useState<SubjectMode>('view');
  console.log(data);

  function handleClearCalendar() {
    setData((prev: calendarLeavesEdit) => {
      return {
        ...prev,
        calendar: {
          id: 0,
          start_date: '',
          end_date: '',
          status: 'planned',
        },
      };
    });
    setMode('edit');
  }

  function handleSelectDate(d: Date) {
    const date_format = formatDate(d, 'ymd');
    if (!data?.calendar?.start_date) {
      setData((prev: calendarLeavesEdit) => {
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

      setData((prev: calendarLeavesEdit) => {
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

  async function handleDeleteLeave() {
    const ok = await confirm('Удалить отпуск?');
    if (!ok) return;

    const res = await request(`/vacations/my/${id}`, {
      method: 'DELETE',
    }).catch(() => null);

    if (!res) return;

    enqueueSnackbar(res.message, { variant: 'success' });
    queryClient.invalidateQueries({ queryKey: ['vacations/my'] });
    router.push('/vacations/my');
    router.refresh();
  }

  async function handleUpdateLeave() {
    const res = await request(`/vacations/my/${id}`, {
      method: 'PUT',
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
      <Stack sx={{display: 'flex', justifyContent: 'space-between', flexDirection: 'row'}}>
        <Box>
          <Typography variant="h5">Номер заявки: {data?.number}</Typography>

          <Typography variant="body1" sx={{ mt: 1 }}>
            Статус: <StatusSpan status={data?.calendar?.status} />
          </Typography>
        </Box>
      <CalendarHead years={years} year={year} setYear={setYear} />
      </Stack>


      <Grid>
        <Stack sx={{alignItems: 'end'}}>
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

        <Stack sx={{ flexDirection: 'row', justifyContent: 'end', gap: 1, mt: 2 }}>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDeleteLeave()}
          >
            Удалить
          </Button>
          <Button
            variant="contained"
            color="success"
            disabled={isSelectCalendar()}
            onClick={() => handleUpdateLeave()}
          >
            Сохранить
          </Button>
        </Stack>
    </Stack>
  );
}
