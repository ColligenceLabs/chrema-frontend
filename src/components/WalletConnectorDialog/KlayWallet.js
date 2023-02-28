import React, { useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import metamask_icon from '../../assets/images/wallet_icons/wallet_icon_metamask.png';
import walletConnect_icon from '../../assets/images/wallet_icons/wallet_icon_walletconnect.png';
import talken_icon from '../../assets/images/wallet_icons/wallet_icon_talk.png';
import kaikas_icon from '../../assets/images/wallet_icons/wallet_icon_kaikas.png';
import WalletCard from './WalletCard';
import { useDispatch, useSelector } from 'react-redux';

import { setActivatingConnector } from '../../redux/slices/wallet';
import { setKlaytn } from '../../redux/slices/wallets';
import { loginWithAddress } from '../../redux/slices/auth';

import { metaMask } from '../../connectors/metaMask';
import { walletConnectV2 } from '../../connectors/walletConnect';
import { kaikas } from '../../connectors/kaikas';
import { getConnectorHooks } from '../../utils';
import { getAddChainParameters } from '../../chains';

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

  const chainId = parseInt(process.env.REACT_APP_KLAYTN_TARGET_NETWORK ?? '0x2019', 10);
  const { useAccounts } = getConnectorHooks();
  const accounts = useAccounts();
  const account = accounts && accounts[0];

  const { user } = useSelector((state) => state.auth);

  const [walletName, setWalletName] = useState('');

  useEffect(() => {
    if (walletName !== '' && account !== '') {
      dispatch(setKlaytn({ wallet: walletName, address: account }));
    }
  }, [walletName, account]);

  const handleWalletCardClick = async (wallet) => {
    setWalletName(wallet.name);
    await window.localStorage.setItem('wallet', wallet.name);

    try {
      if (wallet.name === 'metamask') {
        await metaMask.activate(1001);
        await dispatch(setActivatingConnector(metaMask));
      } else if (wallet.name === 'walletConnector') {
        await walletConnectV2.activate(1001);
        await dispatch(setActivatingConnector(walletConnectV2));
      } else if (wallet.name === 'kaikas') {
        console.log('##############################################', getAddChainParameters(1001));
        await kaikas.activate(getAddChainParameters(1001));
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
