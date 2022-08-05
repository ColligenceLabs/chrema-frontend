import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import metamask_icon from '../../assets/images/wallet_icons/wallet_icon_metamask.png';
import walletConnect_icon from '../../assets/images/wallet_icons/wallet_icon_walletconnect.png';
import talken_icon from '../../assets/images/wallet_icons/wallet_icon_talk.png';
import kaikas_icon from '../../assets/images/wallet_icons/wallet_icon_kaikas.png';
import WalletCard from './WalletCard';
import { useDispatch, useSelector } from 'react-redux';
import { useWeb3React } from '@web3-react/core';
import { injected, kaikas, walletconnect } from '../../connectors';
import { setActivatingConnector } from '../../redux/slices/wallet';
import { setKlaytn } from '../../redux/slices/wallets';
import { loginWithAddress } from '../../redux/slices/auth';

const KlayWalletList = [
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
    name: 'kaikas',
    value: 'Kaikas',
    icon: kaikas_icon,
  },
];

const KlayWallet = ({ klaytn }) => {
  const dispatch = useDispatch();
  const context = useWeb3React();
  const { activate, account, chainId } = context;

  const { user } = useSelector((state) => state.auth);

  const [walletName, setWalletName] = useState('');

  useEffect(() => {
    if (walletName !== '' && account !== '') {
      dispatch(setKlaytn({ wallet: walletName, address: account }));
    }
  }, [walletName, account]);

  const handleWalletCardClick = async (wallet) => {
    setWalletName(wallet.name);

    try {
      if (wallet.name === 'metamask') {
        await activate(injected, null, true);
        await dispatch(setActivatingConnector(injected));
      } else if (wallet.name === 'walletConnector') {
        const wc = walletconnect(true);
        await activate(wc, undefined, true);
      } else if (wallet.name === 'kaikas') {
        await activate(kaikas, null, true);
        await dispatch(setActivatingConnector(kaikas));
      }
    } catch (e) {
      console.log('connect wallet error', e);
    }
  };

  useEffect(() => {
    if (account !== undefined) {
      if (user?.infor?.level !== 'administrator') {
        dispatch(loginWithAddress({ address: account, chainId }));
      }
      // dispatch(loginWithAddress({ address: account, chainId }));
    }
  }, [account]);
  return (
    <Box style={{ backgroundColor: '#f2f2f2', borderRadius: '5px' }}>
      <Grid container>
        {KlayWalletList.map((wallet) => (
          <Grid key={wallet.id} item lg={6} md={6} sm={12} xs={12}>
            <WalletCard
              wallet={wallet}
              network={klaytn}
              handleWalletCardClick={handleWalletCardClick}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default KlayWallet;
