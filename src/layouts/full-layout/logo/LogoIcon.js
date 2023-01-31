import React from 'react';
import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '@mui/material/styles';
import logo from '../../../assets/images/logos/crmc_logo.png';

const LogoWrapper = styled(Link)`
  text-decoration: none;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const LogoIcon = () => {
  const mdDown = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <>
      <LogoWrapper to="/">
        <img src={logo} height="45px" alt="logo" />
      </LogoWrapper>
    </>
  );
};

export default LogoIcon;
