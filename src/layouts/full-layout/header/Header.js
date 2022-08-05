import React, { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import FeatherIcon from 'feather-icons-react';
import { AppBar, Box, IconButton, Toolbar, Snackbar, Alert } from '@mui/material';
import PropTypes from 'prop-types';
import LanguageSelector from '../../../components/LanguageSelector/LanguageSelector';
import ThemeSelector from '../../../components/ThemeSelector/ThemeSelector';
import WalletDialog from '../../../components/WalletDialog';
import { useSelector } from 'react-redux';
import { useEagerConnect, useInactiveListener } from '../../../hooks/useWallet';
import { targetNetworkMsg } from '../../../config';
import { useTheme } from '@mui/styles';
import NetworkSelector from '../../../components/NetworkSelector';
import WalletConnector from '../../../components/WalletConnector';
import ProfileButton from '../../../components/ProfileButton/ProfileButton';

const Header = ({ sx, customClass, toggleSidebar, toggleMobileSidebar }) => {
  const [isOpenConnectModal, setIsOpenConnectModal] = useState(false);
  const [isOpenSnackbar, setIsOpenSnackbar] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
  });

  const { vertical, horizontal, open } = isOpenSnackbar;
  const theme = useTheme();

  const context = useWeb3React();
  const { activate } = context;
  const { activatingConnector } = useSelector((state) => state.wallet);

  const triedEager = useEagerConnect();
  useInactiveListener(!triedEager || !!activatingConnector);

  const handleCloseModal = async () => {
    setIsOpenConnectModal(false);
  };

  const handleSnackbarClose = () => {
    setIsOpenSnackbar({ ...isOpenSnackbar, open: false });
  };

  return (
    <AppBar sx={sx} elevation={0} className={customClass}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleSidebar}
          size="large"
          sx={{
            display: {
              lg: 'flex',
              xs: 'none',
            },
          }}
        >
          <FeatherIcon icon="menu" />
        </IconButton>
        <IconButton
          size="large"
          color="inherit"
          aria-label="menu"
          onClick={toggleMobileSidebar}
          sx={{
            display: {
              lg: 'none',
              xs: 'flex',
            },
          }}
        >
          <FeatherIcon icon="menu" width="20" height="20" />
        </IconButton>
        <Box flexGrow={1} />

        {/*<NetworkSelector />*/}

        <Box
          sx={{
            mr: 1,
          }}
        >
          <WalletConnector activate={activate} />
        </Box>
        <LanguageSelector />
        <ThemeSelector />
        <WalletDialog
          isOpenConnectModal={isOpenConnectModal}
          handleCloseModal={handleCloseModal}
          activate={activate}
        />

        <Box
          sx={{
            width: '1px',
            backgroundColor: 'rgba(0,0,0,0.1)',
            height: '25px',
            ml: 1,
            mr: 1,
          }}
        />
        {/* Profile Dropdown */}
        <ProfileButton />
      </Toolbar>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          severity="error"
          style={{
            background: `${theme.palette.error.main}`,
            color: `${theme.palette.error.light}`,
          }}
        >
          {targetNetworkMsg}
        </Alert>
      </Snackbar>
    </AppBar>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
  customClass: PropTypes.string,
  toggleSidebar: PropTypes.func,
  toggleMobileSidebar: PropTypes.func,
};

export default Header;
