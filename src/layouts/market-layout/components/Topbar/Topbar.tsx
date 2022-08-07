import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LogoIcon from '../../../full-layout/logo/LogoIcon';
import { IconButton, Typography, useMediaQuery } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import ProfileButton from '../../../../components/ProfileButton/ProfileButton';
import { useSelector } from 'react-redux';
import { StoreTypes } from '../../../../views/NftsMarket/types';
import { styled, useTheme } from '@mui/material/styles';
import LoginIcon from '@mui/icons-material/Login';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
// @ts-ignore
import FeatherIcon from 'feather-icons-react';
import WalletConnector from '../../../../components/WalletConnector';
import { useWeb3React } from '@web3-react/core';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

interface MenuItemWrapperProps {
  minWidth: string;
}

interface MenuItemMarkerProps {
  pathname: boolean;
  color: string;
}

const MenuItemWrapper = styled(Box)`
  position: relative;
  min-width: ${(props: MenuItemWrapperProps) => props.minWidth};
  display: flex;
  justify-content: center;
  text-align: center;
`;

const MenuItemMarker = styled(Box)`
  position: absolute;
  top: 48px;
  //length: 40px;
  border-bottom: ${(props: MenuItemMarkerProps) =>
    props.pathname ? `3px solid ${props.color}` : ''};
  width: 110%;
`;

const Topbar = ({ toggleSidebar }: any): JSX.Element => {
  // @ts-ignore
  const smDown = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const theme = useTheme();
  const { user } = useSelector((state: StoreTypes) => state.auth);
  const { pathname } = useLocation();
  const context = useWeb3React();
  const { connector, activate, deactivate, account } = context;

  return (
    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} width={1} py={0.5}>
      <LogoIcon />

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {!smDown ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <MenuItemWrapper minWidth="80px">
              <Link to="/" style={{ textDecoration: 'none' }}>
                <Typography
                  variant="subtitle1"
                  color={pathname === '/' ? 'text.primary' : 'text.secondary'}
                  fontWeight={700}
                >
                  Home
                </Typography>
              </Link>
              <MenuItemMarker pathname={pathname === '/'} color={theme.palette.primary.main} />
            </MenuItemWrapper>
            <MenuItemWrapper minWidth="100px">
              <Link to="/market" style={{ textDecoration: 'none' }}>
                <Typography
                  variant="subtitle1"
                  color={pathname === '/market' ? 'text.primary' : 'text.secondary'}
                  fontWeight={700}
                >
                  Marketplace
                </Typography>
              </Link>
              <MenuItemMarker
                pathname={pathname === '/market'}
                color={theme.palette.primary.main}
              />
            </MenuItemWrapper>
            <MenuItemWrapper minWidth="100px">
              <Link to="/market/create" style={{ textDecoration: 'none' }}>
                <Typography
                  variant="subtitle1"
                  color={pathname === '/market/create' ? 'text.primary' : 'text.secondary'}
                  fontWeight={700}
                >
                  Create
                </Typography>
              </Link>
              <MenuItemMarker
                pathname={pathname === '/market/create'}
                color={theme.palette.primary.main}
              />
            </MenuItemWrapper>
          </Box>
        ) : (
          <Box>
            <IconButton
              size="large"
              aria-label="menu"
              onClick={toggleSidebar}
              sx={{
                display: {
                  lg: 'none',
                  xs: 'flex',
                },
              }}
            >
              <FeatherIcon icon="menu" width="20" height="20" />
            </IconButton>
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: '2rem', gap: 4 }}>
          <AccountCircleOutlinedIcon
            sx={{
              color: 'text.secondary',
              fontSize: '2rem',
              cursor: 'pointer',
              '&:hover': { color: 'text.primary' },
            }}
          />
          <AccountBalanceWalletOutlinedIcon
            sx={{
              color: 'text.secondary',
              fontSize: '2rem',
              cursor: 'pointer',
              '&:hover': { color: 'text.primary' },
            }}
          />
        </Box>
        {/*<Box>*/}
        {/*  <WalletConnector activate={activate} />*/}
        {/*</Box>*/}
        {/*<Box>*/}
        {/*  {user !== null && <ProfileButton useMarket={true} />}*/}
        {/*</Box>*/}
      </Box>
    </Box>
  );
};

export default Topbar;
