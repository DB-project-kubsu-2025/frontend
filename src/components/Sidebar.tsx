import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
} from '@mui/material';
import { Home } from '@mui/icons-material';
import PersonIcon from '@mui/icons-material/Person';
import { MdOutlineLocalHospital } from "react-icons/md";

interface NestedItem {
  name: string;
  iconLeft?: React.ReactNode;
  link: string;
}

interface SidebarItem {
  name: string;
  iconLeft?: React.ReactNode;
  link: string;
  nested?: NestedItem[];
}

interface SidebarSection {
  section: string;
  items: SidebarItem[];
}

const sidebarItems: SidebarSection[] = [
  {
    section: 'Реестр',
    items: [
      {
        name: 'Главная',
        iconLeft: <Home />,
        link: '/',
      },
      {
        name: 'Больничные',
        iconLeft: <MdOutlineLocalHospital />,
        link: '/sickLeave',
        nested: [
          {
            name: 'Отпуска',
            iconLeft: <PersonIcon />,
            link: '/vacation',
          }
        ],
      }
    ],
  },
];

interface SidebarProps {
  sidebar_open: boolean;
  DrawerHeader: React.ComponentType<any>;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebar_open, DrawerHeader }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const pathname = usePathname();
  const locationBase = `/${pathname?.split('/')[1]}`;
  const drawerWidth = sidebar_open ? 200 : 0;

  return (
    <Drawer
      className="sidebar"
      variant="permanent"
      sx={{
        width: drawerWidth,
        '& .MuiDrawer-paper': {
          flexShrink: 0,
          width: drawerWidth,
          transition: 'width 0.4s',
          whiteSpace: 'nowrap',
          overflow: 'visible',
        },
      }}
      data-sidebar-open={sidebar_open.toString()}
    >
      <DrawerHeader />
      <Box>
        {sidebarItems.map((section, index) => (
          <Box key={index}>
            <Typography variant="h6" className="moreText" sx={{ pl: 2, pt: 1, opacity: 0.6 }}>
              {section.section}
            </Typography>
            <List sx={{ py: 0.5 }}>
              {section.items.map((item, idx) => (
                <React.Fragment key={idx}>
                  <ListItem
                    sx={{
                      px: 0,
                      py: 0.5,
                      background:
                        item.link === locationBase ? 'rgba(0, 0, 0, 0.04)' : 'transparent',
                      transition: '.5s',
                      '&:hover': { backgroundColor: 'action.hover' },
                    }}
                    onMouseEnter={() => setHoveredItem(`${index}${idx}`)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <Link
                      href={item.link}
                      passHref
                      style={{ flex: '1' }}
                      onClick={() => {
                        document.dispatchEvent(new Event('ajaxStart'));
                      }}
                    >
                      <ListItemButton
                        title={item.name}
                        sx={{
                          py: 0,
                          pr: sidebar_open ? 'inherit' : 0,
                          '&:hover': { backgroundColor: 'transparent' },
                        }}
                      >
                        {item.iconLeft && (
                          <ListItemIcon className="sidebar_icon">{item.iconLeft}</ListItemIcon>
                        )}
                        <ListItemText
                          primary={item.name}
                          sx={{
                            transition: '0.3s',
                            opacity: sidebar_open ? 1 : 0,
                            '& span': {
                              fontSize: sidebar_open ? 'inherit' : '0px',
                              minHeight: '1.5rem',
                            },
                          }}
                        />
                      </ListItemButton>
                    </Link>
                    {item.nested && hoveredItem === `${index}${idx}` && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: drawerWidth - 1,
                          backgroundColor: '#fff',
                          boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        <List disablePadding>
                          {item.nested.map((nestedItem, nestedIdx) => (
                            <ListItem key={nestedIdx} disablePadding>
                              <Link href={nestedItem.link} passHref style={{ flex: '1' }}>
                                <ListItemButton title={nestedItem.name} sx={{ py: 0.5, px: 1 }}>
                                  {nestedItem.iconLeft && (
                                    <ListItemIcon className="sidebar_icon">
                                      {nestedItem.iconLeft}
                                    </ListItemIcon>
                                  )}
                                  <ListItemText primary={nestedItem.name} />
                                </ListItemButton>
                              </Link>
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
            <Divider />
          </Box>
        ))}
      </Box>
    </Drawer>
  );
};

export default Sidebar;
