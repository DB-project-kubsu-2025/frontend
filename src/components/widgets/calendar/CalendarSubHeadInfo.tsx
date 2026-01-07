import { Card, Divider, Stack, Typography } from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { differenceDates, formatDate } from '@/utils/helper';
import { calendarLeaves } from '@/types/common';
import Link from 'next/link';
import StatusSpan from '@/components/UI/StatusSpan';

export default function CalendarSubHeadInfo({
  href,
  year,
  data,
}: {
  href: string;
  year: number;
  data: any;
}) {
  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <Stack direction="row" sx={{  width: '100%' }}>
        <Stack spacing={1} sx={{ p: 2, minWidth: 200 }}>
          <Typography variant="body2">
            Использованно дней - <b>{data?.used_days}</b>
          </Typography>
          <Typography variant="body2">
            Остаток дней - <b>{data?.balance_days}</b>
          </Typography>
        </Stack>

        <Divider orientation="vertical" flexItem />

        <Stack direction="row" flexWrap="wrap">
          {data?.calendarLeaves?.map((l: calendarLeaves, i: number) => (
            <Stack
              key={i}
              sx={{
                p: 2,
                minWidth: 190,
                gap: 0.6,
                backgroundColor:'#fff',
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
                {l.status === 'done' ? (
                  <StatusSpan status={l.status} />
                ) : (
                  <Link href={`${href}/${l.id}?year=${year}`}>
                    <StatusSpan status={l.status} />
                  </Link>
                )}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}
