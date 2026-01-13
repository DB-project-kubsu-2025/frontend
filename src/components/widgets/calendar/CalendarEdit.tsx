'use client';

import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import MonthCalendar from '@/components/MonthCalendar';
import StatusSpan from '@/components/UI/StatusSpan';
import CalendarHead from '@/components/widgets/calendar/CalendarHead';
import { useConfirm } from '@/components/ConfirmDialog';
import { useApiRequest } from '@/hooks/useApiRequest';
import { enqueueSnackbar } from 'notistack';
import { useRouter } from 'next/navigation';
import { queryClient } from '@/utils/queryClient';
import { useCalendarEdit } from '@/hooks/useCalendarEdit';
import { calendarLeavesEdit, SubjectModes } from '@/types/common';

type Props = {
  id?: number;
  initData: calendarLeavesEdit;
  title: string;
  confirmText?: string;
  deleteEndpoint?: string;
  updateEndpoint: string;
  invalidateKey: string;
  redirectUrl: string;
  mode?: SubjectModes;
};

export default function EditCalendarForm({
  initData,
  title,
  confirmText,
  deleteEndpoint,
  updateEndpoint,
  invalidateKey,
  redirectUrl,
  mode = 'edit',
}: Props) {
  const confirm = useConfirm();
  const router = useRouter();
  const { request } = useApiRequest();

  const {
    year,
    years,
    setYear,
    data,
    modeCalendar,
    handleClearCalendar,
    handleSelectDate,
    isSelectCalendar,
  } = useCalendarEdit(initData);

  async function handleDelete() {
    if (!deleteEndpoint || mode === 'create') return;

    const ok = await confirm(confirmText || 'Удалить?');
    if (!ok) return;

    const res = await request(deleteEndpoint, { method: 'DELETE' }).catch(
      () => null,
    );
    if (!res) return;

    enqueueSnackbar(res.message, { variant: 'success' });
    queryClient.invalidateQueries({ queryKey: [invalidateKey] });
    router.push(redirectUrl);
    router.refresh();
  }

  async function handleSave() {
    const res = await request(updateEndpoint, {
      method: mode === 'create' ? 'POST' : 'PUT',
      data: { calendar: data.calendar },
    }).catch(() => null);

    if (!res) return;

    enqueueSnackbar(res.message, { variant: 'success' });
    queryClient.invalidateQueries({ queryKey: [invalidateKey] });
    router.push(redirectUrl);
    router.refresh();
  }

  return (
    <Stack sx={{ background: 'rgba(235, 180, 0, 0.16)', p: 2 }}>
      <Stack
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row',
          
        }}
      >
        <Box>
          <Typography variant="h5" >
            {title} {mode === 'edit' && `: ${data?.number}`}
          </Typography>

          {mode === 'edit' && (
            <Typography variant="body1" sx={{ mt: 1 }}>
              Статус: <StatusSpan status={data?.calendar?.status} />
            </Typography>
          )}
        </Box>

        <CalendarHead years={years} year={year} setYear={setYear} />
      </Stack>

      <Grid>
        <Stack sx={{ alignItems: 'end', mt: 1 }}>
          {modeCalendar === 'view' ? (
            <Button variant="text" onClick={handleClearCalendar}>
              Очистить
            </Button>
          ) : (
            <Typography variant="subtitle1" sx={{ mb: 1.1 }}>
              Выберите даты
            </Typography>
          )}
        </Stack>

        <Grid container spacing={2} >
          {Array.from({ length: 12 }).map((_, m) => (
            <Grid key={m} size={{ xl: 2, lg: 3, md: 4, sm: 6, xs: 12 }}>
              <MonthCalendar
                mode={modeCalendar}
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
        sx={{ flexDirection: 'row', justifyContent: 'end', gap: 1, mt: 2, }}
      >
        {mode === 'edit' && (
          <Button variant="contained" color="error" onClick={handleDelete}>
            Удалить
          </Button>
        )}

        <Button
          variant="contained"
          color="success"
          disabled={isSelectCalendar()}
          onClick={handleSave}
        >
          {mode === 'create' ? 'Добавить' : 'Сохранить'}
        </Button>
      </Stack>
    </Stack>
  );
}
