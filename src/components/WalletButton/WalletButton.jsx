import React, { useState } from 'react';
import { Box, Button, Menu, IconButton, Typography, Snackbar, Alert } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useWeb3React } from '@web3-react/core';
import splitAddress from '../../utils/splitAddress';
import useCopyToClipBoard from '../../hooks/useCopyToClipBoard';
import { useTheme } from '@mui/material/styles';
import WalletDialog from '../WalletDialog';
import useMediaQuery from '@mui/material/useMediaQuery';

const WalletButton = () => {
  const context = useWeb3React();
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'), {
    defaultMatches: true,
  });
  const { connector, activate, deactivate, account } = context;
  const { copyToClipBoard, copyResult, copyMessage, copyDone, setCopyDone } = useCopyToClipBoard();
  const [walletInfo, setWalletInfo] = React.useState(null);
  const [connectModal, setConnectModal] = useState(false);
  const handleOpenWalletInfo = (event) => {
    setWalletInfo(event.currentTarget);
  };

  const handleCloseWalletInfo = () => {
    setWalletInfo(null);
  };

  const handleOpenConnectModal = () => {
    setConnectModal(true);
  };

  const handleCloseConnectModal = () => {
    setConnectModal(false);
  };

  return (
    <>
      <IconButton
        sx={{ mr: 1 }}
        onClick={connector ? handleOpenWalletInfo : handleOpenConnectModal}
      >
        <AccountBalanceWalletIcon
          fontSize={'medium'}
          sx={{ color: connector ? theme.palette.primary.main : theme.palette.text.secondary }}
        />
      </IconButton>
      <Menu
        anchorEl={walletInfo}
        keepMounted
        open={Boolean(walletInfo)}
        onClose={handleCloseWalletInfo}
        sx={{
          '& .MuiMenu-paper': {
            width: smDown ? '100%' : '300px',
            right: 0,
            top: '70px !important',
          },
          '& .MuiList-padding': {
            p: '10px',
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant={'h5'}>My Wallet</Typography>
          <Typography
            variant={'h5'}
            color={'primary'}
            sx={{ cursor: 'pointer' }}
            onClick={() => copyToClipBoard(account)}
          >
            {splitAddress(account)}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            variant={'contained'}
            size={'small'}
            onClick={async () => {
              await deactivate();
              window.localStorage.removeItem('chainId');
              setWalletInfo(false);
            }}
          >
            Disconnect
          </Button>
        </Box>
      </Menu>
      <WalletDialog
        isOpenConnectModal={connectModal}
        handleCloseModal={handleCloseConnectModal}
        activate={activate}
      />
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={copyDone}
        autoHideDuration={2000}
        onClose={() => {
          setCopyDone(false);
        }}
      >
        <Alert variant="filled" severity={copyResult ? 'success' : 'error'} sx={{ width: '100%' }}>
          {copyMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default WalletButton;
