'use client';

import { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import MonthCalendar from '@/components/MonthCalendar';
import { calendarLeaves, LeavesCalendarProps } from '@/types/common';
import { differenceDates } from '@/utils/helper';
import { useVacations } from '@/hooks/useVacations';

export default function VacationsClient(initData: LeavesCalendarProps) {
  const [year, setYear] = useState(2025);
  const years = [2024, 2025];
  const { data } = useVacations(year, initData);

  return (
    <Box sx={{ background: '#fff', p: 2 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 2 }}
      >
        <Button variant="contained" color="primary">
          Изменить график отпусков
        </Button>
        <ToggleButtonGroup
          size="small"
          value={year}
          exclusive
          onChange={(_, v) => v && setYear(v)}
        >
          {years.map((y) => (
            <ToggleButton key={y} value={y}>
              {y}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>

      <Grid
        container
        spacing={2}
        sx={{ flexDirection: 'row', flexWrap: 'nowrap' }}
      >
        <Grid sx={{ flex: '0 0 auto' }}>
          <Card
            variant="outlined"
            sx={{ position: 'sticky', top: 16, maxWidth: 250 }}
          >
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="body2">
                  Количество уже использованных дней ежегодного отпуска -{' '}
                  <b>{data?.used_days}</b>
                </Typography>
                <Typography variant="body2">
                  Остаток дней ежегодного отпуска на текущую дату -{' '}
                  <b>{data?.balance_days}</b>
                </Typography>
                <Typography variant="body2">
                  Запланировано дней ежегодного отпуска на будущие периоды -{' '}
                  <b>{data?.planned_days}</b>
                </Typography>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <List dense>
                {data?.calendarLeaves?.map((l: calendarLeaves, i: number) => (
                  <ListItem
                    key={i}
                    disableGutters
                    sx={{ alignItems: 'flex-start' }}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <EventAvailableIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`Очередной ежегодный отпуск (${differenceDates(
                        l.start_date,
                        l.end_date,
                      )} дней)`}
                      secondary={
                        <Stack spacing={0.5}>
                          <span>
                            {l.start_date} - {l.end_date}
                          </span>
                          <Typography
                            variant="body2"
                            color={
                              l.status === 'done' ? '#c1e7a7' : '#bdc4eaff'
                            }
                          >
                            {l.status === 'done'
                              ? 'ЗАВЕРШЕНА'
                              : 'ЗАПЛАНИРОВАНО'}
                          </Typography>
                        </Stack>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
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
