import * as React from 'react';
import { Box, IconButton, Popover, Typography } from '@mui/material';
import NETWORKS from './networks';

const NetworkSelector = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const currentNetwork = localStorage.getItem('cur_network') || 'klaytn';
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangeNetwork = (lng) => {
    setAnchorEl(null);
    localStorage.setItem('cur_network', lng);
  };

  return (
    <div>
      <IconButton onClick={handleClick}>
        <img
          src={NETWORKS.find((network) => network.value === currentNetwork).icon}
          alt="klay"
          height="20px"
        />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {NETWORKS.filter((network) => network.value !== 'ethereum').map((option) => (
          <IconButton key={option.value} onClick={() => handleChangeNetwork(option.value)}>
            <Box
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <img src={option.icon} alt="klay" height="24px" />
              <Typography variant="caption">{option.label}</Typography>
            </Box>
          </IconButton>
        ))}
      </Popover>
    </div>
  );
};

export default NetworkSelector;
