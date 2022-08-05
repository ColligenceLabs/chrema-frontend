import React, { useState } from 'react';
import { Box, experimentalStyled, Popover, Typography } from '@mui/material';
import WalletConnectorDialog from '../WalletConnectorDialog';
import { useSelector } from 'react-redux';
import WalletDetail from '../WalletDetail/WalletDetail';
import eth_icon from '../../assets/images/network_icon/ethereum-eth-logo.png';
import klay_icon from '../../assets/images/network_icon/klaytn-klay-logo.png';
import sol_icon from '../../assets/images/network_icon/solana-sol-logo.png';
import bnb_icon from '../../assets/images/network_icon/binance-bnb-logo.png';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const WalletIconWrapper = experimentalStyled('div')(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '10px',
  backgroundColor: '#e3e2e2',
  padding: '0px 10px',
}));

const StyledWalletIcon = experimentalStyled('div')(({ cursor_pointer, address, theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'white',
  margin: '5px 5px',
  padding: '5px 5px',
  borderRadius: '100px',
  cursor: cursor_pointer === 'true' ? 'pointer' : 'default',
  opacity: `${address !== undefined ? 100 : 0.5}`,
  border: `${address !== undefined ? `1px solid ${theme.palette.primary.main}` : ''}`,
  [theme.breakpoints.down('sm')]: {
    margin: '5px 2px',
    padding: '5px 5px',
  },
}));

const WalletConnector = ({ activate }) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'), {
    defaultMatches: true,
  });

  const { ethereum, klaytn, solana, binance } = useSelector((state) => state.wallets);

  const [isOpenConnectModal, setIsOpenConnectModal] = useState(false);
  const [isOpenDetailModal, setIsOpenDetailModal] = useState(false);
  const [selectedNetworkIndex, setSelectedNetworkIndex] = useState(0);
  const [connectedWallet, setConnectedWallet] = useState();
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleCloseConnectModal = () => {
    setIsOpenConnectModal(false);
  };

  const hanleCloseDetailModal = () => {
    setIsOpenDetailModal(false);
  };

  const handleSwitchWallet = () => {
    setIsOpenDetailModal(false);
    setIsOpenConnectModal(true);
  };
  const onClickWalletIcon = (id, chain, wallet) => {
    console.log(id);
    setSelectedNetworkIndex(id);
    if (wallet.address === undefined) {
      setIsOpenConnectModal(true);
    } else {
      setConnectedWallet({ ...wallet, chain: chain });
      setIsOpenDetailModal(true);
    }
  };

  return (
    <>
      <WalletIconWrapper>
        <StyledWalletIcon
          aria-owns={open ? 'mouse-over-popover' : undefined}
          address={ethereum.address}
          onMouseOver={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
          cursor_pointer={'false'}
        >
          <img src={eth_icon} alt={'eth_icon'} width={smDown ? '14px' : '20px'} />
        </StyledWalletIcon>
        <StyledWalletIcon
          address={klaytn.address}
          // onMouseOver={handlePopoverOpen}
          // onMouseLeave={handlePopoverClose}
          onClick={() => onClickWalletIcon(1, 'klaytn', klaytn)}
          cursor_pointer={'true'}
        >
          <img src={klay_icon} alt={'klay_icon'} width={smDown ? '14px' : '20px'} />
        </StyledWalletIcon>
        <StyledWalletIcon
          aria-owns={open ? 'mouse-over-popover' : undefined}
          address={solana.address}
          cursor_pointer={'false'}
          onMouseOver={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
        >
          <img src={sol_icon} alt={'sol_icon'} width={smDown ? '14px' : '20px'} />
        </StyledWalletIcon>
        <StyledWalletIcon
          address={binance.address}
          cursor_pointer={'true'}
          onClick={() => onClickWalletIcon(3, 'binance', binance)}
        >
          <img src={bnb_icon} alt={'bnb_icon'} width={smDown ? '14px' : '20px'} />
        </StyledWalletIcon>
      </WalletIconWrapper>
      <WalletConnectorDialog
        selectedNetworkIndex={selectedNetworkIndex}
        isOpenConnectModal={isOpenConnectModal}
        handleCloseModal={handleCloseConnectModal}
        activate={activate}
        ethereum={ethereum}
        klaytn={klaytn}
        solana={solana}
        binance={binance}
      />
      <WalletDetail
        isOpenDetailModal={isOpenDetailModal}
        handleCloseDetailModal={hanleCloseDetailModal}
        handleSwitchWallet={handleSwitchWallet}
        connectedWallet={connectedWallet}
      />
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: 'none',
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Box sx={{ backgroundColor: 'primary.main', color: 'white' }}>
          <Typography variant={'subtitle2'} sx={{ p: 1 }}>
            Coming soon
          </Typography>
        </Box>
      </Popover>
    </>
  );
};

export default WalletConnector;
