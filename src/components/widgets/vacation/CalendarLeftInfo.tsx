import {
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { differenceDates, formatDate } from '@/utils/helper';
import { calendarLeaves } from '@/types/common';
import Link from 'next/link';

export default function MyVacationLeftInfo({ data }: { data: any }) {
  return (
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
            <ListItem key={i} disableGutters sx={{ alignItems: 'flex-start' }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <EventAvailableIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={`Очередной ежегодный отпуск (${differenceDates(
                  l.start_date,
                  l.end_date,
                )} дней)`}
                sx={{
                  color: l.status === 'done' ? '#96ce70' : '#8a94d1',
                }}
                secondary={
                  <Stack spacing={0.5}>
                    <span>
                      {formatDate(l.start_date)} - {formatDate(l.end_date)}
                    </span>
                    <Typography variant="body2">
                      <Link href={`vacations/${l.id}`}>
                        {l.status === 'done' ? 'ЗАВЕРШЕНА' : 'ЗАПЛАНИРОВАНО'}
                      </Link>
                    </Typography>
                  </Stack>
                }
                secondaryTypographyProps={{ component: 'div' }}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
