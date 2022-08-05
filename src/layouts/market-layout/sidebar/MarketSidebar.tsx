import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
// @ts-ignore
import FeatherIcon from 'feather-icons-react';
import { SidebarWidth } from '../../../assets/global/Theme-variable';
import LogoIcon from '../../full-layout/logo/LogoIcon';
import { Menuitems } from './Menuitems';

const MarketSidebar = ({ onSidebarClose, isSidebarOpen }: any) => {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(true);
  const { pathname } = useLocation();
  const pathDirect = pathname;

  const handleClick = (index: any) => {
    if (open === index) {
      setOpen((prevopen) => !prevopen);
    } else {
      setOpen(index);
    }
  };

  const SidebarContent = (
    <Box style={{ height: 'calc(100vh - 5px)' }}>
      <Box sx={{ p: 2 }}>
        <LogoIcon />
        <Box>
          <List>
            {Menuitems.map((item, index) => {
              return (
                <List component="li" disablePadding key={item.title}>
                  <ListItem
                    onClick={() => handleClick(index)}
                    button
                    component={NavLink}
                    to={item.href}
                    selected={pathDirect === item.href}
                    sx={{
                      mb: 1,
                      ...(pathDirect === item.href && {
                        color: 'white',
                        backgroundColor: (theme) => `${theme.palette.primary.main}!important`,
                      }),
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        ...(pathDirect === item.href && { color: 'white' }),
                      }}
                    >
                      {/*<FeatherIcon icon={item.icon} width="20" height="20" />*/}
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText onClick={onSidebarClose}>{t(`${item.title}`)}</ListItemText>
                  </ListItem>
                </List>
              );
            })}
          </List>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Drawer
      anchor="left"
      open={isSidebarOpen}
      onClose={onSidebarClose}
      PaperProps={{
        sx: {
          width: SidebarWidth,
          border: '0 !important',
        },
      }}
      variant="temporary"
    >
      {SidebarContent}
    </Drawer>
  );
};

MarketSidebar.propTypes = {
  isMobileSidebarOpen: PropTypes.bool,
  onSidebarClose: PropTypes.func,
  isSidebarOpen: PropTypes.bool,
};

export default MarketSidebar;
