import React from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { styled, useTheme } from '@mui/material/styles';
import ntal_logo from '../../../../assets/images/logos/ntal_logo.png';
import footerlogo_img from '../../../../assets/images/logos/footer_Logo.png';
import messege_icon from '../../../../assets/images/logos/messege_icon_w.svg';
import page_icon from '../../../../assets/images/logos/page_icon_w.svg';
import twitter_icon from '../../../../assets/images/logos/twitter_icon_w.svg';
import gitbook_icon from '../../../../assets/images/logos/gitbook_icon_w.svg';
import github_icon from '../../../../assets/images/logos/github_icon_w.svg';
import mail_icon from '../../../../assets/images/logos/mail_icon_w.svg';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Typography } from '@mui/material';

const LogoWrapper = styled(Box)`
  text-decoration: none;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Footer = (): JSX.Element => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'), {
    defaultMatches: true,
  });
  const currentLang = localStorage.getItem('cur_language') || 'en';
  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: '#161C24',
        height: '100%',
        mt: 'auto',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          margin: '0 auto',
          boxSizing: 'border-box',
          padding: '40px 24px',
        }}
      >
        {/*<LogoWrapper>*/}
        {/*  <img src={ntal_logo} alt="logo_img" width="40px" className="footer_logo" />*/}
        {/*  <Typography style={{ fontSize: '30px' }} fontWeight={700} color={'white'}>*/}
        {/*    N-Tal*/}
        {/*  </Typography>*/}
        {/*  /!* <p>&copy; All rights reserved. Made by TaalSwap. </p> *!/*/}
        {/*</LogoWrapper>*/}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: smDown ? 'column' : 'row',
            gap: 1,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
            <Box>
              <Link href="/">
                <img src={twitter_icon} alt="twitter_icon" />
              </Link>
            </Box>
            <Box>
              {currentLang === 'ko-KR' ? (
                <Link href="/">
                  <img src={page_icon} alt="page_icon" />
                </Link>
              ) : (
                <Link href="/">
                  <img src={page_icon} alt="page_icon" />
                </Link>
              )}
            </Box>
            <Box>
              <Link href="/">
                <img src={messege_icon} alt="messege_icon" />
              </Link>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
            <Box>
              <Link href="/">
                <img src={gitbook_icon} alt="gitbook_icon" />
              </Link>
            </Box>
            <Box>
              <Link href="/">
                <img src={github_icon} alt="github_icon" />
              </Link>
            </Box>
            <Box>
              <Link href="/">
                <img src={mail_icon} alt="github_icon" />
              </Link>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
