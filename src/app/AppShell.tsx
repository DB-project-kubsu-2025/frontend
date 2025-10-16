'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleSidebar, setSidebar } from '@/store/sidebarOpenSlice';
import { login as loginAction } from '@/store/userSlice';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { styled } from '@mui/material';

const DrawerHeader = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? '/';
  const dispatch = useAppDispatch();

  const sidebarOpen = useAppSelector((s) => s.sidebarOpen.isOpen);
  const ToggleDrawer = () => dispatch(toggleSidebar());

  const noLayoutPaths = ['/login', '/waybills'];
  const hideLayout = useMemo(
    () => noLayoutPaths.some((p) => pathname.startsWith(p)),
    [pathname],
  );

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (!res.ok) return;
        const data = await res.json();
        if (data?.authenticated && data.user) {
          dispatch(loginAction(data.user));
        }
      } catch {}
    })();
  }, [dispatch]);

  useEffect(() => {
    const saved = localStorage.getItem('sidebarOpen');
    if (saved !== null) dispatch(setSidebar(saved === 'true'));
  }, [dispatch]);

  return (
    <>
      {!hideLayout && (
        <>
          <Header ToggleDrawer={ToggleDrawer} />
          <Sidebar sidebar_open={sidebarOpen} DrawerHeader={DrawerHeader} />
        </>
      )}
      {children}
    </>
  );
}
