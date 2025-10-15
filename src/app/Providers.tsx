'use client';
import { ReactNode } from 'react';
import { CssBaseline, ThemeProvider, styled } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { toggleSidebar } from '@/store/sidebarOpenSlice';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import theme from '@/style/theme';
import { safeText } from '@/utils/helper';

const DrawerHeader = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

export default function Providers({ children }: { children: ReactNode }) {
  const sidebarOpen = useSelector((state: RootState) => state.sidebarOpen.isOpen);
  const dispatch = useDispatch();

  const drawerWidth = sidebarOpen ? 200 : 80;
  const ToggleDrawer = () => dispatch(toggleSidebar());

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header ToggleDrawer={ToggleDrawer} userName={safeText('Админ')} />
      <Sidebar sidebar_open={sidebarOpen} DrawerHeader={DrawerHeader} />
      <SnackbarProvider
        maxSnack={3}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {children}
      </SnackbarProvider>
    </ThemeProvider>
  );
}
