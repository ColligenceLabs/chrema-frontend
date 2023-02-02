import React from 'react';
import { Box, Typography } from '@mui/material';
import SectionWrapper from '../SectionWrapper';

const DetailOfficial = () => {
  return (
    <SectionWrapper title={'Official'} icon={'align-left'} maxHeight={'200px'}>
      <Box
        sx={{
          backgroundColor: '#F7FBFD',
          borderRadius: '5px',
          margin: '20px 30px',
          padding: '10px',
        }}
      >
        <Typography variant={'body2'} sx={{ paddingX: 1 }}>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
          been the industrys standard dummy text ever since the 1500s, when an unknown printer took
          a galley of type and scrambled it to make a type specimen book.
        </Typography>
      </Box>
    </SectionWrapper>
  );
};

export default DetailOfficial;
