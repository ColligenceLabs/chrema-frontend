import React from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  useTheme,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { injected, kaikas, talkenwallet, walletconnect } from '../connectors';
import { setActivatingConnector } from '../redux/slices/wallet';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import talkenIcon from '../assets/images/wallet_icons/wallet_icon_talk.png';
import bibanceIcon from '../assets/images/wallet_icons/wallet_icon_binance.png';
import decntIcon from '../assets/images/wallet_icons/wallet_icon_dcent.png';
import crmcIcon from '../assets/images/wallet_icons/wallet_icon_crmc.svg';

import metamaskIcon from '../assets/images/wallet_icons/wallet_icon_metamask.png';
import walletconnectIcon from '../assets/images/wallet_icons/wallet_icon_walletconnect.png';
import useActiveWeb3React from '../hooks/useActiveWeb3React';
import { logout } from '../redux/slices/auth';
import splitAddress from '../utils/splitAddress';
import { useNavigate } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';

const useStyles = makeStyles((theme) => ({
  root: {},
  button: {
    width: '100px',
  },
  dialogTitle: {
    textAlign: 'center',
    fontSize: 20,
    background: theme.palette.primary.main,
    color: theme.palette.primary.light,
  },

  walletBoxWrapper: {
    borderRadius: '1rem',
    border: '1px solid',
    borderColor: theme.palette.primary.main,
    justifyContent: 'space-between',
    alignItems: 'center',
    display: 'flex',
    height: '80px',
    '&:hover': {
      cursor: 'pointer',
    },
  },

  walletBoxIcon: {
    alignItems: 'center',
  },
  walletBoxContent: {
    minWidth: 135,
    padding: '0rem 0.5rem 0rem 0.5rem',
  },

  chipWrapper: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: '1rem',
    gap: '0.15rem',
  },
}));

const walletEBHList = [
  {
    name: 'CHREMA WALLET',
    icons: crmcIcon,
  },
  {
    name: 'MetaMask',
    icons: metamaskIcon,
  },
  {
    name: 'WalletConnect',
    icons: walletconnectIcon,
  },
];

const EthChip = () => (
  <Chip
    label="ETH"
    color="warning"
    size="string"
    style={{ height: '15px', width: '45px', fontSize: '8px' }}
  />
);

const WalletDialog = ({ isOpenConnectModal, handleCloseModal, activate }) => {
  const theme = useTheme();
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { account, deactivate } = useActiveWeb3React();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'), {
    defaultMatches: true,
  });

  const onClickWallet = async (wallet) => {
    try {
      if (wallet.name === 'MetaMask') {
        await activate(injected, null, true);
        dispatch(setActivatingConnector(injected));
        window.localStorage.setItem('wallet', 'injected');
      } else if (wallet.name === 'Kaikas') {
        await activate(kaikas, null, true);
        dispatch(setActivatingConnector(kaikas));
        window.localStorage.setItem('wallet', 'kaikas');
      } else if (wallet.name === 'WalletConnect') {
        console.log('####################################');
        const wc = walletconnect(true);
        await activate(wc, undefined, true);
        window.localStorage.setItem('wallet', 'walletconnect');
      } else if (wallet.name === 'CHREMA WALLET') {
        console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        const wc = talkenwallet(true);
        await activate(wc, undefined, true);
        window.localStorage.setItem('wallet', 'walletconnect');
      }
    } catch (e) {
      console.log('connect wallet error', e);
    }

    handleCloseModal(wallet.name);
  };

  return (
    <React.Fragment>
      <Dialog
        maxWidth="xs"
        fullWidth
        open={isOpenConnectModal}
        onClose={handleCloseModal}
        aria-labelledby="max-width-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          className={classes.dialogTitle}
          id="customized-dialog-title"
          onClose={handleCloseModal}
        >
          <Box className={classes.dialogTitle} id="dialog_title">
            {t('Connect Wallet')}
          </Box>
        </DialogTitle>
        {account ? (
          <DialogContent>
            <Box
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: smDown ? 'column' : 'rows',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <span>{splitAddress(account, 10)}</span>
              <Button
                variant={'contained'}
                onClick={async () => {
                  await deactivate();
                  await dispatch(logout());
                  handleCloseModal();
                  navigate('/');
                }}
              >
                Logout
              </Button>
            </Box>
          </DialogContent>
        ) : (
          <DialogContent>
            {walletEBHList.map((wallet, index) => (
              <Card
                key={index}
                className={classes.walletBoxWrapper}
                onClick={() => onClickWallet(wallet)}
              >
                <Box className={classes.chipWrapper}>
                  <EthChip />
                  {/*<BscChip />*/}
                  {/*<HecoChip />*/}
                </Box>
                <Box
                  component="img"
                  alt="logo"
                  src={wallet.icons}
                  height={30}
                  className={classes.walletBoxIcon}
                  id="logo_icon"
                />
                <Box className={classes.walletBoxContent}>
                  <Typography>{wallet.name}</Typography>
                </Box>
                <ArrowForwardIosIcon />
              </Card>
            ))}

            {/*{walletETHList.map((wallet, index) => (*/}
            {/*  <Card*/}
            {/*    key={index}*/}
            {/*    className={classes.walletBoxWrapper}*/}
            {/*    onClick={() => onClickWallet(wallet)}*/}
            {/*  >*/}
            {/*    <Box className={classes.chipWrapper}>*/}
            {/*      <EthChip />*/}
            {/*    </Box>*/}
            {/*    <Box*/}
            {/*      component="img"*/}
            {/*      alt="logo"*/}
            {/*      src={wallet.icons}*/}
            {/*      height={30}*/}
            {/*      className={classes.walletBoxIcon}*/}
            {/*      id="logo_icon"*/}
            {/*    />*/}
            {/*    <Box className={classes.walletBoxContent}>*/}
            {/*      <Typography>{wallet.name}</Typography>*/}
            {/*    </Box>*/}
            {/*    <ArrowForwardIosIcon />*/}
            {/*  </Card>*/}
            {/*))}*/}
          </DialogContent>
        )}
      </Dialog>
    </React.Fragment>
  );
};

export default WalletDialog;
