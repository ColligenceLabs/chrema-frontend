import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { NFTType } from '../../../types';

interface DetailTitleProp {
  nft: NFTType;
}

const DetailTitle: React.FC<DetailTitleProp> = ({ nft }) => {
  return (
    <Box sx={{ p: 1 }}>
      <Typography
        component={Link}
        to={`/market/collection/${nft.collection_id._id}`}
        variant={'h4'}
        color={'primary'}
        sx={{ textDecoration: 'none' }}
      >
        {nft.collection_id?.name}
      </Typography>

      <Typography variant={'h1'}>{nft.metadata.name}</Typography>
      <Box display={'flex'} sx={{ mt: 2 }}>
        <Typography variant={'h4'}>Created by</Typography>
        <Typography
          variant={'h4'}
          color={'primary'}
          sx={{ ml: 1, fontWeight: 800, textDecoration: 'none' }}
          component={Link}
          to={`/market/creator/${nft?.creator_id?._id}`}
        >
          {nft.metadata.creator_name}
        </Typography>
      </Box>
    </Box>
  );
};

export default DetailTitle;
