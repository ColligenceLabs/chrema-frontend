import React from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';

const Footer = () => {
  const smDown = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  return (
    <Box
      sx={{
        p: 3,
        textAlign: 'center',
        display: 'flex',
        flexDirection: `${smDown ? 'column' : 'row'}`,
        justifyContent: 'center',
        gap: `${smDown ? '' : '0.3rem'}`,
      }}
    >
      <Typography>© 2021 All rights reserved by</Typography>
      <Typography color="primary" fontWeight="500">
        Colligence Labs
      </Typography>
    </Box>
  );
};

export default Footer;
