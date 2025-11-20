import {
  Card,
  CardContent,
  Divider,
  Grid,
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

export default function CalendarSubHeadInfo({ data }: { data: any }) {
  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <Stack direction="row" sx={{ width: '100%' }}>
        <Stack spacing={1} sx={{ p: 2, minWidth: 200 }}>
          <Typography variant="body2">
            Использованно дней - <b>{data?.used_days}</b>
          </Typography>
          <Typography variant="body2">
            Остаток дней - <b>{data?.balance_days}</b>
          </Typography>
        </Stack>

        <Divider orientation="vertical" flexItem />

        <Stack direction="row" flexWrap="nowrap">
          {data?.calendarLeaves?.map((l: calendarLeaves, i: number) => (
            <Stack
              key={i}
              sx={{
                p: 2,
                minWidth: 190,
                gap: 0.6,
              }}
            >
              <Stack flexDirection="row">
                <EventAvailableIcon fontSize="small" />
                <Typography
                  variant="body2"
                  sx={{
                    ml: 1,
                  }}
                >
                  ({differenceDates(l.start_date, l.end_date)} дней)
                </Typography>
              </Stack>
              <Typography variant="body2">
                {formatDate(l.start_date)} - {formatDate(l.end_date)}
              </Typography>
              <Typography variant="body2">
                <Link href={`vacations/${l.id}`}>
                  <span
                    style={{
                      color: l.status === 'done' ? '#96ce70' : '#8a94d1',
                    }}
                  >
                    {l.status === 'done' ? 'ЗАВЕРШЕНА' : 'ЗАПЛАНИРОВАНО'}
                  </span>
                </Link>
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}
