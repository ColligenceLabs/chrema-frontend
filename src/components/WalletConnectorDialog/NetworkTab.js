import React, { useState } from 'react';
import { Box, Grid, Popover, Typography } from '@mui/material';
import eth_icon from '../../assets/images/network_icon/ethereum-eth-logo.png';
import klay_icon from '../../assets/images/network_icon/klaytn-klay-logo.png';
import sol_icon from '../../assets/images/network_icon/solana-sol-logo.png';
import bnb_icon from '../../assets/images/network_icon/binance-bnb-logo.png';
import { useTheme } from '@mui/styles';

const NetworkList = [
  {
    id: 0,
    network: 'ethereum',
    network_name: 'Ethereum',
    icon: eth_icon,
  },
  {
    id: 1,
    network: 'klaytn',
    network_name: 'Klaytn',
    icon: klay_icon,
  },
  {
    id: 2,
    network: 'solana',
    network_name: 'Solana',
    icon: sol_icon,
  },
  {
    id: 3,
    network: 'binance',
    network_name: 'Binance',
    icon: bnb_icon,
  },
];

const NetworkTab = ({ selectedNetwork, changeNetwork, connectedNetwork }) => {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box style={{ backgroundColor: '#f2f2f2', borderRadius: '5px' }}>
      <Grid container>
        {NetworkList.map((network) => (
          <Grid item key={network.id} lg={3} md={3} sm={12} xs={12}>
            <Box
              aria-owns={open ? 'mouse-over-popover' : undefined}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '8px',
                padding: '16px',
                border: `1px solid ${
                  selectedNetwork === network.id ? theme.palette.primary.main : 'white'
                }`,

                backgroundColor: `${
                  connectedNetwork.includes(network.network)
                    ? `${theme.palette.thirdary.main}`
                    : `${theme.palette.background.paper}`
                }`,

                borderRadius: '5px',
                gap: '0.35rem',
                cursor: network.id === 1 || network.id === 3 ? 'pointer' : 'default',
              }}
              onClick={() => {
                if (network.id === 1 || network.id === 3) changeNetwork(network.id);
              }}
              onMouseOver={(event) => {
                if (network.id === 0 || network.id === 2) handlePopoverOpen(event);
              }}
              onMouseLeave={() => {
                if (network.id === 0 || network.id === 2) handlePopoverClose();
              }}
            >
              <img src={network.icon} alt={network.name} width="16px" />
              <Typography variant="subtitle2"> {network.network_name}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
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
    </Box>
  );
};

export default NetworkTab;
