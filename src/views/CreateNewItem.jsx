import React from 'react';
import MarketLayout from '../layouts/market-layout/MarketLayout';
import { Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const CreateNewItemContainer = styled(Container)`
  max-width: 646px;
`;

const TitleWrapper = styled(Typography)`
  font-size: 40px;
  font-weight: 600;
  letter-spacing: 0px;
  margin-top: 4rem;
`;

const CreateNewItem = () => {
  return (
    <MarketLayout>
      <CreateNewItemContainer style={{ marginTop: '-30px' }}>
        <TitleWrapper>Create New Item</TitleWrapper>
      </CreateNewItemContainer>
    </MarketLayout>
  );
};

export default CreateNewItem;
