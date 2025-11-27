'use client';

import { Card, CardHeader, CardContent, useTheme } from '@mui/material';
import { format, isSameMonth, isWeekend } from 'date-fns';
import { ru } from 'date-fns/locale';
import { monthMatrix, dayInAnyLeave } from '@/libs/calendar';
import { calendarLeaves, SubjectMode } from '@/types/common';

type Props = {
  mode?: SubjectMode;
  year: number;
  monthIndex0: number;
  leaves: calendarLeaves[];
  backOpacity?: boolean;
  onDateClick?: (d: Date) => void;
};

export default function MonthCalendar({
  mode = 'view',
  year,
  monthIndex0,
  leaves,
  backOpacity = false,
  onDateClick,
}: Props) {
  const theme = useTheme();
  const days = monthMatrix(year, monthIndex0, 1);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const current = leaves?.[0];
  const start = current?.start_date ? new Date(current.start_date) : null;
  const end = current?.end_date ? new Date(current.end_date) : null;

  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return (
    <Card variant="outlined" sx={{ height: '100%', background: '#f5f6fa' }}>
      <CardHeader
        title={format(new Date(year, monthIndex0, 1), 'LLLL', { locale: ru })}
        titleTypographyProps={{
          textTransform: 'capitalize',
          fontWeight: 600,
          fontSize: 16,
          align: 'center',
        }}
        sx={{ pb: 0.5 }}
      />
      <CardContent sx={{ pt: 1 }}>
        <table
          style={{
            borderCollapse: 'collapse',
            tableLayout: 'fixed',
            width: '100%',
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
                  const isStart =
                    start && d.toDateString() === start.toDateString();

                  const isPastDay = d < today;

                  const color = out // день не в этом месяце
                    ? 'transparent'
                    : isWeekend(d) //выходной
                      ? theme.palette.warning.main
                      : '#333';

                  let bg = 'transparent';

                  if (!out) {
                    if (start && !end && isStart) {
                      bg = '#bdc4eaff';
                    }

                    if (lv === 'done') {
                      bg = '#c1e7a7';
                    } else if (lv === 'planned') {
                      bg = '#bdc4eaff';
                    }
                  }

                  return (
                    <td
                      key={di}
                      onClick={() => mode === 'edit' && onDateClick?.(d)}
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
                        cursor: mode === 'edit' ? 'pointer' : 'default',
                        opacity: backOpacity && isPastDay ? 0.45 : 1,
                        pointerEvents:
                          backOpacity && isPastDay ? 'none' : 'auto',
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
