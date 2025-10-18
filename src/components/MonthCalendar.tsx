'use client';

import {
  Card,
  CardHeader,
  CardContent,
  Box,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { format, isSameMonth, isWeekend } from 'date-fns';
import { monthMatrix, dayInAnyLeave, Leave } from '@/libs/calendar';

type Props = {
  year: number;
  monthIndex0: number;
  leaves: Leave[];
};

export default function MonthCalendar({ year, monthIndex0, leaves }: Props) {
  const theme = useTheme();
  const days = monthMatrix(year, monthIndex0, 1);

  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardHeader
        title={format(new Date(year, monthIndex0, 1), 'LLLL')}
        titleTypographyProps={{
          textTransform: 'capitalize',
          fontWeight: 600,
          fontSize: 16,
        }}
        sx={{ pb: 0.5 }}
      />
      <CardContent sx={{ pt: 1 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            mb: 0.5,
          }}
        >
          {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((d) => (
            <Typography
              key={d}
              variant="caption"
              align="center"
              sx={{ color: 'text.secondary' }}
            >
              {d}
            </Typography>
          ))}
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 0.5,
          }}
        >
          {days.map((d, i) => {
            const out = !isSameMonth(d, new Date(year, monthIndex0, 1));
            const lv = dayInAnyLeave(d, leaves);
            const bg =
              lv === 'done'
                ? alpha(theme.palette.success.main, 0.25)
                : lv === 'planned'
                  ? alpha(theme.palette.info.main, 0.25)
                  : out
                    ? alpha(theme.palette.action.disabledBackground, 0.35)
                    : isWeekend(d)
                      ? alpha(theme.palette.warning.main, 0.18)
                      : 'transparent';

            const bd = lv
              ? lv === 'done'
                ? theme.palette.success.main
                : theme.palette.info.main
              : 'divider';

            return (
              <Box
                key={i}
                sx={{
                  border: '1px solid',
                  borderColor: bd,
                  borderRadius: 1,
                  height: 34,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: bg,
                  color: out ? 'text.disabled' : 'text.primary',
                  fontSize: 13,
                  fontWeight: 500,
                }}
                aria-label={format(d, 'yyyy-MM-dd')}
              >
                {d.getDate()}
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
}
