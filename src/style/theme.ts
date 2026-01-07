'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: 'rgba(148, 98, 17, 1)',
    },
    secondary: {
      main: '#d34d00e1',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif, #fff, 24px'

  },
});

export default theme;
