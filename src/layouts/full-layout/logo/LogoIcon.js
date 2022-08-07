import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled, useTheme } from '@mui/material/styles';

const LogoWrapper = styled(Link)`
  text-decoration: none;
  font-weight: bold;
`;
const LogoIcon = () => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'), {
    defaultMatches: true,
  });
  const customizer = useSelector((state) => state.CustomizerReducer);
  return (
    <>
      <LogoWrapper to="/">
        <Box sx={{ padding: 1, display: 'flex', alignItems: 'center' }}>
          {/*{customizer.activeMode === 'dark' ? (*/}
          {/*  <img src={marketLogo} width={smDown ? '130' : '150'} alt="logo" />*/}
          {/*) : (*/}
          {/*  <img src={marketLogo} width={smDown ? '130' : '150'} alt="logo" />*/}
          {/*)}*/}
          <Typography variant="h2" color={'primary'}>
            NTal
          </Typography>
        </Box>
      </LogoWrapper>
    </>
  );
};

export default LogoIcon;
