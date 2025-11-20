import { Button, Stack, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';

export default function MyVacationHead({
  btnText,
  href,
  years,
  year,
  setYear,
}: {
  btnText: string,
  href: string,
  years: number[];
  year: number;
  setYear: Dispatch<SetStateAction<number>>;
}) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ mb: 2 }}
    >
      <Button variant="contained" color="primary" href={href}>
        {btnText}
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
  );
}
