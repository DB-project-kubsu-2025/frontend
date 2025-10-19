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

  // Разбиваем дни на недели по 7
  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return (
    <Card variant="outlined" sx={{ height: '100%', background: '#f5f6fa' }}>
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
        <table
          style={{
            borderCollapse: 'collapse',
            tableLayout: 'fixed',
          }}
        >
          <thead>
            <tr>
              {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((d) => (
                <td
                  key={d}
                  align="center"
                  style={{ color: '#555', fontWeight: 'bold', fontSize: 13 }}
                >
                  {d}
                </td>
              ))}
            </tr>
          </thead>
          <tbody
            style={{
              background: '#fff',
            }}
          >
            {weeks.map((week, wi) => (
              <tr key={wi}>
                {week.map((d, di) => {
                  const out = !isSameMonth(d, new Date(year, monthIndex0, 1));
                  const lv = dayInAnyLeave(d, leaves);

                  const color = out // день не в этом месяце
                    ? 'transparent'
                    : isWeekend(d) //выходной
                      ? theme.palette.warning.main
                      : '#333';

                  const bg =
                    lv === 'done' //завершенный отпуск
                      ? '#c1e7a7'
                      : lv === 'planned' //запланированный отпуск
                        ? '#bdc4eaff'
                        : 'transparent';

                  return (
                    <td
                      key={di}
                      style={{
                        border: `1px solid ${theme.palette.divider}`,
                        height: 28,
                        width: 28,
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        fontSize: 13,
                        fontWeight: 500,
                        backgroundColor: bg,
                        color: color,
                      }}
                      aria-label={format(d, 'yyyy-MM-dd')}
                    >
                      {!out ? d.getDate() : ''}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
