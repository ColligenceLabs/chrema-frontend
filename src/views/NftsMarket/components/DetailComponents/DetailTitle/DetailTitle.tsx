import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { NFTType } from '../../../types';
// import SNSButtons from '../../SNSButtons/SNSButtons';
// import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import ShareIcon from '@mui/icons-material/Share';

interface DetailTitleProp {
  nft: NFTType;
}

const DetailTitle: React.FC<DetailTitleProp> = ({ nft }) => {
  return (
    <Box
      sx={{
        marginTop: '17px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography
        component={Link}
        to={`/market/creator/${nft?.creator_id?._id}`}
        color={'primary'}
        sx={{ textDecoration: 'none', fontSize: '20px', fontWeight: 500, lineHeight: '44px' }}
      >
        {nft.metadata.creator_name}
      </Typography>

      <Typography sx={{ fontSize: '38px', fontWeight: 700, lineHeight: '44px' }}>
        {nft.metadata.name}
      </Typography>
      {/*<Box*/}
      {/*  sx={{*/}
      {/*    display: 'flex',*/}
      {/*    justifyContent: 'center',*/}
      {/*    alignItems: 'center',*/}
      {/*    gap: '1.5rem',*/}
      {/*    marginTop: '20px',*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <Box*/}
      {/*    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.25rem' }}*/}
      {/*  >*/}
      {/*    <RemoveRedEyeOutlinedIcon sx={{ fontSize: '20px' }} />*/}
      {/*    <Typography sx={{ fontSize: '18px', fontWeight: 700, lineHeight: '24px' }}>24</Typography>*/}
      {/*    <Typography sx={{ fontSize: '18px', fontWeight: 400, lineHeight: '24px' }}>*/}
      {/*      Views*/}
      {/*    </Typography>*/}
      {/*  </Box>*/}
      {/*  <Box*/}
      {/*    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.25rem' }}*/}
      {/*  >*/}
      {/*    <FavoriteIcon sx={{ fontSize: '14px' }} />*/}
      {/*    <Typography sx={{ fontSize: '18px', fontWeight: 700, lineHeight: '24px' }}>24</Typography>*/}
      {/*    <Typography sx={{ fontSize: '18px', fontWeight: 400, lineHeight: '24px' }}>*/}
      {/*      Favorite*/}
      {/*    </Typography>*/}
      {/*  </Box>*/}
      {/*  <Box*/}
      {/*    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.25rem' }}*/}
      {/*  >*/}
      {/*    <ShareIcon sx={{ fontSize: '14px' }} />*/}
      {/*    <Typography sx={{ fontSize: '18px', fontWeight: 700, lineHeight: '24px' }}>24</Typography>*/}
      {/*    <Typography sx={{ fontSize: '18px', fontWeight: 400, lineHeight: '24px' }}>*/}
      {/*      Share*/}
      {/*    </Typography>*/}
      {/*  </Box>*/}
      {/*</Box>*/}
      {/*<Box sx={{ marginTop: '20px' }}>*/}
      {/*  <SNSButtons />*/}
      {/*</Box>*/}
    </Box>
  );
};

export default DetailTitle;
