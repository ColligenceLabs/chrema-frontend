import React, { useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import metamask_icon from '../../assets/images/wallet_icons/wallet_icon_metamask.png';
import WalletCard from './WalletCard';
import { injected } from '../../connectors';
import { setActivatingConnector } from '../../redux/slices/wallet';
import { setBinance } from '../../redux/slices/wallets';
import { useDispatch, useSelector } from 'react-redux';
import { useWeb3React } from '@web3-react/core';
import { loginWithAddress } from '../../redux/slices/auth';

const BinanceWalletList = [
  {
    id: 0,
    name: 'metamask',
    value: 'Metamask',
    icon: metamask_icon,
  },
];

const BinanceWallet = ({ binance }) => {
  const dispatch = useDispatch();
  const context = useWeb3React();
  const { user } = useSelector((state) => state.auth);
  const { activate, account, chainId } = context;
  const [walletName, setWalletName] = useState('');

  useEffect(() => {
    if (walletName !== '' && account !== '') {
      dispatch(setBinance({ wallet: walletName, address: account }));
    }
  }, [walletName, account]);
  const handleWalletCardClick = async (wallet) => {
    setWalletName(wallet.name);
    try {
      // Todo change bsc target network chain id to config
      // await setupNetwork(97);
      await activate(injected, null, true);
      await dispatch(setActivatingConnector(injected));
      console.log(wallet);
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
        {BinanceWalletList.map((wallet) => (
          <Grid key={wallet.id} item lg={6} md={6} sm={12} xs={12}>
            <WalletCard
              wallet={wallet}
              network={binance}
              handleWalletCardClick={handleWalletCardClick}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BinanceWallet;
