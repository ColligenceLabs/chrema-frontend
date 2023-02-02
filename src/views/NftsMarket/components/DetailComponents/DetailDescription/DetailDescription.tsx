import React from 'react';
import { Box, Typography } from '@mui/material';
import SectionWrapper from '../SectionWrapper';
import { NFTType } from '../../../types';

interface DetailInformationProps {
  nft: NFTType;
}
const DetailDescription: React.FC<DetailInformationProps> = ({ nft }) => {
  return (
    <SectionWrapper title={'Description'} icon={'align-left'} maxHeight={'200px'}>
      <Box
        sx={{
          backgroundColor: '#F7FBFD',
          borderRadius: '5px',
          margin: '20px 30px',
          padding: '10px',
        }}
      >
        <Typography
          variant={'body2'}
          sx={{ fontSize: '16px', fontWeight: 400, lineHeight: '24px', color: '#706C83' }}
        >
          {nft.metadata.description}
        </Typography>
      </Box>
    </SectionWrapper>
  );
};

export default DetailDescription;
