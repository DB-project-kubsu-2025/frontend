import { Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';

export default function CalendarHead({
  years,
  year,
  setYear,
}: {
  years: number[];
  year: number;
  setYear: Dispatch<SetStateAction<number>>;
}) {
  return (
    <Stack direction="row" justifyContent="end" alignItems="start">
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
  );
}
