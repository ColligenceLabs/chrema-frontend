import React from 'react';
import Box from '@mui/material/Box';
import crmc_logo from '../../../../assets/images/logos/crmc_logo.png';
import ytb_icon from '../../../../assets/images/logos/ytb_icon.png';
import fb_icon from '../../../../assets/images/logos/fb_icon.png';
import twt_icon from '../../../../assets/images/logos/twt_icon.png';
import dsc_icon from '../../../../assets/images/logos/dsd_icon.png';
import { Typography } from '@mui/material';

type FooterProps = {
  isLanding?: boolean;
};

const Footer: React.FC<FooterProps> = ({ isLanding }): JSX.Element => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        mt: '100px',
        padding: '30px',
        paddingTop: isLanding ? '350px' : '100px',
        marginTop: isLanding ? '-250px' : '0px',
        zIndex: isLanding ? -1000 : 0,
        backgroundColor: '#F7F7F7',
      }}
    >
      <Box sx={{ marginBottom: '18px' }}>
        <img src={crmc_logo} alt="logo" width="127px" />
      </Box>
      <Box sx={{ maxWidth: '500px' }}>
        <Typography
          sx={{
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: '24px',
            color: '#565660',
            textAlign: 'center',
          }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent
          libero. Sed cursus ante dapibus diam.
        </Typography>
        <Typography
          sx={{
            fontWeight: 400,
            lineHeight: '22px',
            color: '#B9B8BB',
            textAlign: 'center',
            marginBottom: '30px',
          }}
        >
          Copyright © 2023 crmc. All rights reserved.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '30px' }}>
          <img src={twt_icon} alt="twitter" width="20px" />
          <img src={fb_icon} alt="facebook" width="20px" />
          <img src={ytb_icon} alt="youtube" width="20px" />
          <img src={dsc_icon} alt="discord" width="20px" />
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
