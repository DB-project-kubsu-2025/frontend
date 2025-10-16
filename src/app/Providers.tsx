'use client';

import { Provider } from 'react-redux';
import { makeStore } from '@/store';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import theme from '@/style/theme';
import AppShell from './AppShell';

const store = makeStore();
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider
          maxSnack={3}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <AppShell>{children}</AppShell>
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  );
}
