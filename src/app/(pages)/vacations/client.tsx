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
import { Leave } from '@/libs/calendar';
import { differenceInCalendarDays, parseISO } from 'date-fns';

const sampleLeaves: Leave[] = [
  { start: '2025-07-21', end: '2025-08-10', status: 'done' },
  { start: '2025-12-29', end: '2025-12-30', status: 'planned' },
];

export default function VacationsClient() {
  const [year, setYear] = useState(2025);
  const years = [2024, 2025];

  const leftStats = useMemo(() => {
    const used = sampleLeaves
      .filter((l) => l.status === 'done')
      .reduce(
        (acc, l) =>
          acc +
          (differenceInCalendarDays(parseISO(l.end), parseISO(l.start)) + 1),
        0,
      );
    const planned = sampleLeaves
      .filter((l) => l.status === 'planned')
      .reduce(
        (acc, l) =>
          acc +
          (differenceInCalendarDays(parseISO(l.end), parseISO(l.start)) + 1),
        0,
      );
    const balance = 30 - used; // пример: годовая норма 30
    return { used, planned, balance };
  }, []);

  return (
    <Box sx={{background: '#fff', p: 2}}>
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
        <Grid item xs={12} md={3}>
          <Card variant="outlined" sx={{ position: 'sticky', top: 16 }}>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="body2">
                  Количество уже использованных дней ежегодного отпуска —{' '}
                  <b>{leftStats.used}</b>
                </Typography>
                <Typography variant="body2">
                  Остаток дней ежегодного отпуска на текущую дату —{' '}
                  <b>{leftStats.balance}</b>
                </Typography>
                <Typography variant="body2">
                  Запланировано дней ежегодного отпуска на будущие периоды —{' '}
                  <b>{leftStats.planned}</b>
                </Typography>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <List dense>
                {sampleLeaves.map((l, i) => (
                  <ListItem
                    key={i}
                    disableGutters
                    sx={{ alignItems: 'flex-start' }}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <EventAvailableIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`Очередной ежегодный отпуск (${
                        differenceInCalendarDays(
                          parseISO(l.end),
                          parseISO(l.start),
                        ) + 1
                      } дней)`}
                      secondary={
                        <Stack spacing={0.5}>
                          <span>
                            {l.start} — {l.end}
                          </span>
                          <Chip
                            size="small"
                            label={
                              l.status === 'done'
                                ? 'ЗАВЕРШЕНА'
                                : 'ЗАПЛАНИРОВАНО'
                            }
                            color={l.status === 'done' ? 'success' : 'info'}
                            variant="outlined"
                            sx={{ alignSelf: 'flex-start' }}
                          />
                        </Stack>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={9}>
          <Grid container spacing={2}>
            {Array.from({ length: 12 }).map((_, m) => (
              <Grid key={m} item xs={12} sm={6} md={4}>
                <MonthCalendar
                  year={year}
                  monthIndex0={m}
                  leaves={sampleLeaves}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
