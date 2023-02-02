import React from 'react';
import Box from '@mui/material/Box';
import twt_icon from '../../../../assets/images/logos/twt_icon.png';
import fb_icon from '../../../../assets/images/logos/fb_icon.png';
import ytb_icon from '../../../../assets/images/logos/ytb_icon.png';
import dsc_icon from '../../../../assets/images/logos/dsd_icon.png';

const SNSButtons = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '30px' }}>
      <img src={twt_icon} alt="twitter" width="20px" />
      <img src={fb_icon} alt="facebook" width="20px" />
      <img src={ytb_icon} alt="youtube" width="20px" />
      <img src={dsc_icon} alt="discord" width="20px" />
    </Box>
  );
};

export default SNSButtons;
