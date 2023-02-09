import React, { useEffect, useCallback, useState, useMemo } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import phantom_icon from '../../assets/images/wallet_icons/wallet-phantom-logo.png';
import WalletCard from './WalletCard';
import { useDispatch } from 'react-redux';
import { useWeb3React } from '@web3-react/core';
// import { useWallet } from '@solana/wallet-adapter-react';
// import { useWalletModal } from '@colligence/metaplex-common';
import { setSolana } from '../../redux/slices/wallets';
import { getUserData } from '../../services/user.service';
// import { getPhantomWallet } from '@solana/wallet-adapter-wallets';

const SolWalletList = [
  {
    id: 0,
    name: 'phantom',
    value: 'Phantom',
    icon: phantom_icon,
  },
  {
    id: 1,
    name: null,
    value: null,
    icon: null,
  },
  {
    id: 2,
    name: null,
    value: null,
    icon: null,
  },
  {
    id: 3,
    name: null,
    value: null,
    icon: null,
  },
];
const SolWallet = ({ solana }) => {
  const wallet = useWallet();
  const { setVisible } = useWalletModal();
  const dispatch = useDispatch();
  const [walletName, setWalletName] = useState('');
  const phatomWallet = useMemo(() => getPhantomWallet(), []);

  useEffect(() => {
    if (walletName !== '') {
      dispatch(setSolana({ wallet: walletName, address: wallet.publicKey?.toBase58() }));
    }
  }, [walletName, wallet.publicKey]);

  const connectPhantom = useCallback(async () => {
    try {
      console.log('=====>', wallet);
      await wallet.select(phatomWallet.name);
      await (wallet.wallet ? wallet.connect().catch() : setVisible(true));
      setWalletName(wallet.wallet.name);
    } catch (e) {
      console.log(e);
    }
  }, [wallet.wallet, wallet.connect, setVisible]);

  const handleWalletCardClick = (wallet) => {
    if (wallet.name === 'phantom') {
      connectPhantom();
    }
  };
  return (
    <Box style={{ backgroundColor: '#f2f2f2', borderRadius: '5px' }}>
      <Grid container>
        {SolWalletList.map((wallet) => (
          <Grid key={wallet.id} item lg={6} md={6} sm={12} xs={12}>
            <WalletCard
              wallet={wallet}
              network={solana}
              handleWalletCardClick={handleWalletCardClick}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SolWallet;
