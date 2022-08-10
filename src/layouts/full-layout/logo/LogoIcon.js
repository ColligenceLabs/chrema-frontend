import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled, useTheme } from '@mui/material/styles';
import ntal_logo from '../../../assets/images/logos/ntal_logo.png';

const LogoWrapper = styled(Link)`
  text-decoration: none;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 10px;
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
        {/*<Box sx={{ padding: 1, display: 'flex', alignItems: 'center', gap: 1 }}>*/}
        {/*{customizer.activeMode === 'dark' ? (*/}
        {/*  <img src={marketLogo} width={smDown ? '130' : '150'} alt="logo" />*/}
        {/*) : (*/}
        {/*  <img src={marketLogo} width={smDown ? '130' : '150'} alt="logo" />*/}
        {/*)}*/}
        <img src={ntal_logo} width="40px" alt="logo" />
        <Typography style={{ fontSize: '33px' }} fontWeight={700} color={'primary'}>
          N-Tal
        </Typography>
        {/*</Box>*/}
      </LogoWrapper>
    </>
  );
};

export default LogoIcon;
