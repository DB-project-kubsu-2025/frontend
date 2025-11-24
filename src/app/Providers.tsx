'use client';

import { Provider } from 'react-redux';
import { makeStore } from '@/store';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/utils/queryClient';
import theme from '@/style/theme';
import AppShell from './AppShell';
import { ConfirmProvider } from '@/components/ConfirmDialog';

const store = makeStore();
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider
            maxSnack={3}
            autoHideDuration={3000}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <ConfirmProvider>
              <AppShell>{children}</AppShell>
            </ConfirmProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}
