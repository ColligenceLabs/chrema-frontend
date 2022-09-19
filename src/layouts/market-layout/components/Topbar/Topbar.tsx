import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import LogoIcon from '../../../full-layout/logo/LogoIcon';
import {
  Avatar,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { StoreTypes } from '../../../../views/NftsMarket/types';
import { styled, useTheme } from '@mui/material/styles';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
// @ts-ignore
import FeatherIcon from 'feather-icons-react';
import { useWeb3React } from '@web3-react/core';
import AppsIcon from '@mui/icons-material/Apps';
import { Logout, PersonAdd, Settings } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import WalletDialog from '../../../../components/WalletDialog';
import { logout } from '../../../../redux/slices/auth';
import marketService from '../../../../services/market.service';
import { useEagerConnect, useInactiveListener } from '../../../../hooks/useWallet';
import useUserInfo from '../../../../hooks/useUserInfo';

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

const StyledMenuItem = styled(MenuItem)`
  padding: 15px;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid rgb(229, 232, 235);
  &:last-child {
    border-bottom: none;
  }
`;

const Topbar = ({ toggleSidebar }: any): JSX.Element => {
  // @ts-ignore
  const smDown = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const { image: userImage } = useUserInfo();

  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { pathname } = useLocation();
  const context = useWeb3React();
  const { activate, deactivate, account } = context;
  const [anchorProfileEl, setAnchorProfileEl] = React.useState<null | HTMLElement>(null);
  const [isOpenConnectModal, setIsOpenConnectModal] = useState(false);
  const { activatingConnector } = useSelector((state) => state.wallet);

  const openProfile = Boolean(anchorProfileEl);

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();
  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);

  const handleCloseModal = () => {
    setIsOpenConnectModal(false);
  };

  const handleClickProfile = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorProfileEl(event.currentTarget);
  };
  const handleCloseProfile = () => {
    setAnchorProfileEl(null);
  };

  const moveToPage = (path: string) => {
    navigate(path);
  };

  useEffect(() => {
    const authProcess = async () => {
      await marketService.loginWidthAddress(account, process.env.REACT_APP_CHAIN_ID);
    };

    if (account) authProcess();
  }, [account]);
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
          <IconButton
            onClick={handleClickProfile}
            size="small"
            sx={{ ml: 2, cursor: 'pointer' }}
            aria-controls={openProfile ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={openProfile ? 'true' : undefined}
          >
            {/*<Avatar sx={{ width: 32, height: 32 }}>M</Avatar>*/}
            {userImage ? (
              <Avatar src={userImage} sx={{ width: 32, height: 32 }} />
            ) : (
              <AccountCircleOutlinedIcon
                sx={{
                  color: account ? `${theme.palette.primary.main}` : 'text.secondary',
                  fontSize: '2rem',

                  '&:hover': { color: account ? `${theme.palette.primary.main}` : 'text.primary' },
                }}
              />
            )}
          </IconButton>
          <Menu
            anchorEl={anchorProfileEl}
            id="account-menu"
            open={openProfile}
            onClose={handleCloseProfile}
            onClick={handleCloseProfile}
            PaperProps={{
              elevation: 0,
              sx: {
                minWidth: '250px',
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 2.2,
                '& .MuiMenu-list': {
                  p: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: 'center', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}
          >
            <StyledMenuItem onClick={() => moveToPage('/market/profile')}>
              <ListItemIcon>
                <AccountCircleOutlinedIcon />
              </ListItemIcon>
              Profile
            </StyledMenuItem>
            <StyledMenuItem onClick={() => moveToPage('/market/mycollection')}>
              <ListItemIcon>
                <AppsIcon />
              </ListItemIcon>
              My Collections
            </StyledMenuItem>
            <StyledMenuItem>
              <ListItemIcon>
                <Settings />
              </ListItemIcon>
              Settings
            </StyledMenuItem>
            <StyledMenuItem
              onClick={async () => {
                await deactivate();
                await dispatch(logout());
                window.localStorage.removeItem('user');
                navigate('/');
              }}
            >
              <ListItemIcon>
                <Logout />
              </ListItemIcon>
              Logout
            </StyledMenuItem>
          </Menu>
          <AccountBalanceWalletOutlinedIcon
            onClick={() => setIsOpenConnectModal(true)}
            sx={{
              color: 'text.secondary',
              fontSize: '2rem',
              cursor: 'pointer',
              '&:hover': { color: 'text.primary' },
            }}
          />

          <WalletDialog
            isOpenConnectModal={isOpenConnectModal}
            handleCloseModal={handleCloseModal}
            activate={activate}
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
