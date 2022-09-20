import React from 'react';
import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '@mui/material/styles';
import ntal_logo from '../../../assets/images/logos/ntal_logo.png';

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
        <img src={ntal_logo} width="40px" alt="logo" />
        <Typography
          style={{ fontSize: mdDown ? '20px:' : '33px' }}
          fontWeight={700}
          color={'primary'}
        >
          NTal
        </Typography>
      </LogoWrapper>
    </>
  );
};

export default LogoIcon;
