import { Button, Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';
import Link from 'next/link';
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
    <Stack
      direction="row"
      justifyContent="end"
      alignItems="center"
      sx={{ mb: 2 }}
    >
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
