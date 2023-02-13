import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import metamask_icon from '../../assets/images/wallet_icons/wallet_icon_metamask.png';
import walletConnect_icon from '../../assets/images/wallet_icons/wallet_icon_walletconnect.png';
import talken_icon from '../../assets/images/wallet_icons/wallet_icon_talk.png';
import WalletCard from './WalletCard';
// import { injected, walletconnect } from '../../connectors';
import { setActivatingConnector } from '../../redux/slices/wallet';
import { useDispatch, useSelector } from 'react-redux';
import { useWeb3React } from '@web3-react/core';
import { setEthereum, setKlaytn } from '../../redux/slices/wallets';

const EthWalletList = [
  {
    id: 0,
    name: 'metamask',
    value: 'Metamask',
    icon: metamask_icon,
  },
  {
    id: 1,
    name: 'walletConnector',
    value: 'Wallet Connector',
    icon: walletConnect_icon,
  },
  {
    id: 2,
    name: 'talken',
    value: 'Talken',
    icon: talken_icon,
  },
  {
    id: 3,
    name: null,
    value: null,
    icon: null,
  },
];

const EthWallet = ({ ethereum }) => {
  const dispatch = useDispatch();
  const context = useWeb3React();
  const { activate, account } = context;
  // const { ethereum } = useSelector((state) => state.wallets);
  const [walletName, setWalletName] = useState('');

  useEffect(() => {
    if (walletName !== '' && account !== '') {
      dispatch(setEthereum({ wallet: walletName, address: account }));
    }
  }, [walletName, account]);

  const handleWalletCardClick = async (wallet) => {
    setWalletName(wallet.name);
    try {
      if (wallet.name === 'metamask') {
        // await activate(injected, null, true);
        dispatch(setActivatingConnector(injected));
      } else if (wallet.name === 'walletConnector') {
        // const wc = walletconnect(true);
        await activate(wc, undefined, true);
      }
    } catch (e) {
      console.log('connect wallet error', e);
    }
  };

  return (
    <Box style={{ backgroundColor: '#f2f2f2', borderRadius: '5px' }}>
      <Grid container>
        {EthWalletList.map((wallet) => (
          <Grid key={wallet.id} item lg={6} md={6} sm={12} xs={12}>
            <WalletCard
              wallet={wallet}
              network={ethereum}
              handleWalletCardClick={handleWalletCardClick}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default EthWallet;
