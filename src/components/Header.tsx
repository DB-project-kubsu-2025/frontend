import React from 'react';
import Link from 'next/link';
// import Image from 'next/image';
import { useAppSelector } from '@/store/hooks';
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface HeaderProps {
  ToggleDrawer: () => void;
}

const Header: React.FC<HeaderProps> = ({ ToggleDrawer }) => {
  const userData = useAppSelector((state) => state.userData);
  const appBarStyle = {
    width: '100%',
    transition: 'width 0.4s ease',
    zIndex: 999999,
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: '#3e454c',
  };

  return (
    <AppBar sx={appBarStyle}>
      <Toolbar sx={{ justifyContent: 'space-between', width: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={ToggleDrawer}
            edge="start"
          >
            <MenuIcon sx={{ width: '28px', height: 'unset', fill: '#888' }} />
          </IconButton>
          <Link href="/" passHref>
            <Typography variant="h5" component="div" className="logo">
              {/* <Image src="/img/logo.png" alt="Логотип" width={40} height={40} /> */}
              <span className="logoName">CRM</span>
            </Typography>
          </Link>
        </Box>
        <Typography
          className="moreText"
          sx={{ maxWidth: '300px', pl: 4, flex: 1, textAlign: 'right' }}
        >
          {userData.user_name}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
