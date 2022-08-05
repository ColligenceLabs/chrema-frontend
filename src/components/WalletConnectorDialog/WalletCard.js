import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/styles';
import splitAddress from '../../utils/splitAddress';

const WalletCard = ({ wallet, network, handleWalletCardClick, children }) => {
  const theme = useTheme();
  return (
    <>
      {wallet.name !== null ? (
        <Box
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            margin: '8px',
            padding: '16px',

            backgroundColor: `${
              network?.wallet?.toLowerCase() === wallet?.name
                ? `${theme.palette.thirdary.main}`
                : `${theme.palette.background.paper}`
            }`,
            borderRadius: '5px',
            gap: '0.5rem',
            cursor: 'pointer',
            height: '55px',
            border: `${
              network?.wallet?.toLowerCase() === wallet?.name
                ? `1px solid ${theme.palette.primary.main}`
                : ''
            }`,
          }}
          onClick={() => handleWalletCardClick(wallet)}
        >
          <img src={wallet.icon} alt="metamask" width="16px" />
          <Typography variant="subtitle2">
            {network?.wallet?.toLowerCase() === wallet?.name
              ? splitAddress(network.address)
              : wallet?.value}
          </Typography>
        </Box>
      ) : (
        <Box
          style={{
            margin: '8px',
            padding: '16px',
            backgroundColor: `${theme.palette.background.paper}`,
            borderRadius: '5px',
            height: '55px',
          }}
        />
      )}
    </>
  );
};

export default WalletCard;
