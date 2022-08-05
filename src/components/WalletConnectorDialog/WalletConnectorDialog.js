import React, { useEffect, useState } from 'react';
import { Box, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';
import NetworkTab from './NetworkTab';
import KlayWallet from './KlayWallet';
import EthWallet from './EthWallet';
import SolWallet from './SolWallet';
import BinanceWallet from './BinanceWallet';

const WalletConnectorDialog = ({
  isOpenConnectModal,
  handleCloseModal,
  activate,
  selectedNetworkIndex,
  ethereum,
  klaytn,
  solana,
  binance,
}) => {
  const { t } = useTranslation();
  const [selectedNetwork, setSelectedNetwork] = useState(selectedNetworkIndex);
  const [connectedNetwork, setConnectedNetwork] = useState([]);
  const changeNetwork = (id) => {
    setSelectedNetwork(id);
  };
  useEffect(() => {
    setSelectedNetwork(selectedNetworkIndex);
    // return () => setSelectedNetwork(0);
  }, [selectedNetworkIndex]);

  useEffect(() => {
    const array = [
      ethereum.address !== undefined ? 'ethereum' : null,
      klaytn.address !== undefined ? 'klaytn' : null,
      solana.address !== undefined ? 'solana' : null,
      binance.address !== undefined ? 'binance' : null,
    ];

    setConnectedNetwork(array);
  }, [ethereum, klaytn, solana, binance]);

  return (
    <React.Fragment>
      <Dialog
        maxWidth="sm"
        fullWidth
        open={isOpenConnectModal}
        onClose={handleCloseModal}
        aria-labelledby="max-width-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="customized-dialog-title" onClose={handleCloseModal}>
          <Box id="dialog_title">{t('Connect Wallet')}</Box>
        </DialogTitle>
        <DialogContent>
          <NetworkTab
            selectedNetwork={selectedNetwork}
            connectedNetwork={connectedNetwork}
            changeNetwork={changeNetwork}
          />
          <Box style={{ width: '100%', height: '1rem' }} />
          {selectedNetwork === 0 && <EthWallet ethereum={ethereum} />}
          {selectedNetwork === 1 && <KlayWallet klaytn={klaytn} />}
          {selectedNetwork === 2 && <SolWallet solana={solana} />}
          {selectedNetwork === 3 && <BinanceWallet binance={binance} />}
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default WalletConnectorDialog;
