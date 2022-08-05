import React, { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Snackbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import splitAddress from '../../utils/splitAddress';
import NETWORKS from '../NetworkSelector/networks';
import { useTheme } from '@mui/styles';
import capitalize from '../../utils/capitalize';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import useCopyToClipBoard from '../../hooks/useCopyToClipBoard';
import { styled } from '@mui/material/styles';
import { setEthereum, setKlaytn, setSolana } from '../../redux/slices/wallets';
import { useDispatch } from 'react-redux';
import { useWeb3React } from '@web3-react/core';

const StyledButton = styled(Button)(({ theme }) => ({
  padding: '10px',
  borderRadius: '10px',
  border: '1px',
  borderStyle: 'solid',
}));

const WalletDetail = ({
  isOpenDetailModal,
  handleCloseDetailModal,
  handleSwitchWallet,
  connectedWallet,
}) => {
  const context = useWeb3React();
  const { deactivate } = context;
  const theme = useTheme();
  const { copyToClipBoard, copyResult, copyMessage, copyDone, setCopyDone } = useCopyToClipBoard();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const mdDown = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const onClickDisconnect = async () => {
    if (connectedWallet.chain === 'solana') dispatch(setSolana({}));
    else if (connectedWallet.chain === 'ethereum') dispatch(setEthereum({}));
    else if (connectedWallet.chain === 'klaytn') dispatch(setKlaytn({}));
    await deactivate();
    handleCloseDetailModal();
  };

  const handleViewExplorer = () => {
    let url = '';
    switch (connectedWallet.chain) {
      case 'ethereum':
        url =
          process.env.REACT_APP_MAINNET === 'true'
            ? `https://etherscan.io/address/${connectedWallet.address}`
            : `https://ropsten.etherscan.io/address/${connectedWallet.address}`;
        break;
      case 'klaytn':
        url =
          process.env.REACT_APP_MAINNET === 'true'
            ? `https://scope.klaytn.com/account/${connectedWallet.address}?tabId=txList`
            : `https://baobab.scope.klaytn.com/account/${connectedWallet.address}?tabId=txList`;
        break;
      case 'solana':
        url =
          process.env.REACT_APP_MAINNET === 'true'
            ? `https://solscan.io/account/${connectedWallet.address}?cluster=mainnet-beta`
            : `https://solscan.io/account/${connectedWallet.address}?cluster=devnet`;
        break;
    }

    window.open(url, '_blank');
  };

  return (
    <React.Fragment>
      {connectedWallet !== undefined && (
        <Dialog
          maxWidth="xs"
          fullWidth
          open={isOpenDetailModal}
          onClose={handleCloseDetailModal}
          aria-labelledby="max-width-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="customized-dialog-title" onClose={handleCloseDetailModal}>
            <Box id="dialog_title">{t('Account')}</Box>
          </DialogTitle>
          <DialogContent>
            <Grid container gap={1}>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Box
                  style={{
                    display: 'flex',
                    padding: '15px',
                    alignItems: 'center',
                    width: '100%',
                    border: `1px solid ${theme.palette.primary.main}`,
                    borderRadius: '10px',
                  }}
                >
                  <Box
                    style={{
                      // border: '1px solid red',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <img
                      src={
                        NETWORKS.find((network) => network.value === connectedWallet?.chain).icon
                      }
                      alt="klay"
                      width="40px"
                      height="auto"
                    />
                  </Box>
                  <Box
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                      paddingLeft: '10px',
                    }}
                  >
                    <Box>
                      <Typography
                        variant="subtitle1"
                        color="primary"
                        fontWeight={700}
                        marginBottom={-0.5}
                      >
                        {capitalize(connectedWallet?.chain)}
                      </Typography>
                    </Box>
                    <Box
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <Typography variant="body">
                        {splitAddress(connectedWallet?.address)}
                      </Typography>
                      <ContentCopyIcon
                        color="primary"
                        sx={{ fontSize: 16, cursor: 'pointer' }}
                        onClick={() => copyToClipBoard(connectedWallet.address)}
                      />
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: `${mdDown ? 'column' : 'row'}`,
                    gap: 1,
                  }}
                >
                  <StyledButton variant="contained" fullWidth onClick={handleViewExplorer}>
                    View on Explorer
                  </StyledButton>
                  <StyledButton variant="contained" fullWidth onClick={handleSwitchWallet}>
                    Switch Wallet
                  </StyledButton>
                </Box>
              </Grid>
              {/*<Grid container marginTop={1} marginBottom={1}>*/}
              {/*  <Grid item lg={6} md={6} sm={12} xs={12}>*/}
              {/*    <Box>*/}
              {/*      <StyledButton variant="contained" fullWidth onClick={handleViewExplorer}>*/}
              {/*        View on Explorer*/}
              {/*      </StyledButton>*/}
              {/*    </Box>*/}
              {/*  </Grid>*/}
              {/*  <Grid item lg={6} md={6} sm={12} xs={12}>*/}
              {/*    <StyledButton variant="contained" fullWidth onClick={handleSwitchWallet}>*/}
              {/*      Switch Wallet*/}
              {/*    </StyledButton>*/}
              {/*  </Grid>*/}
              {/*</Grid>*/}
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <StyledButton variant="contained" fullWidth onClick={onClickDisconnect}>
                  Disconnect
                </StyledButton>
              </Grid>
            </Grid>
          </DialogContent>
          <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={copyDone}
            autoHideDuration={2000}
            onClose={() => {
              setCopyDone(false);
            }}
          >
            <Alert
              variant="filled"
              severity={copyResult ? 'success' : 'error'}
              sx={{ width: '100%' }}
            >
              {copyMessage}
            </Alert>
          </Snackbar>
        </Dialog>
      )}
    </React.Fragment>
  );
};

export default WalletDetail;
