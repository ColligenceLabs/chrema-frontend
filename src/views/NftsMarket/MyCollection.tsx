import React, { useEffect, useState } from 'react';
import MarketLayout from '../../layouts/market-layout/MarketLayout';
import { styled } from '@mui/material/styles';
import { Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import useActiveWeb3React from '../../hooks/useActiveWeb3React';
import login, { register } from '../../services/auth.service';
import { useSelector } from 'react-redux';
import { StoreTypes } from './types';
import WalletDialog from '../../components/WalletDialog';

const MyCollectionContainer = styled(Container)`
  max-width: 646px !important;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 10rem;
`;

const TitleWrapper = styled(Typography)`
  font-size: 40px;
  font-weight: 600;
  letter-spacing: 0px;
  margin-top: 2rem;
  //margin-bottom: 1rem;
`;

const SubTitleWrapper = styled(Typography)`
  font-weight: 400;
  color: rgb(53, 56, 64);
`;

const FieldWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const CreateButton = styled(Button)`
  max-width: 200px;
  font-weight: 400;
  padding: 15px 15px;
  font-size: 16px;
  font-weight: 600;
`;

const MyCollection = () => {
  const navigate = useNavigate();

  const { account, activate } = useActiveWeb3React();
  const [isOpenConnectModal, setIsOpenConnectModal] = useState(false);

  const handleCloseModal = async () => {
    setIsOpenConnectModal(false);
  };

  const moveToPage = () => {
    navigate('/market/collection/create');
  };

  return (
    <MarketLayout>
      <MyCollectionContainer>
        <TitleWrapper>My Collections</TitleWrapper>
        <SubTitleWrapper>
          Create, curate, and manage collections of unique NFTs to share and sell.
        </SubTitleWrapper>
        <FieldWrapper>
          {account ? (
            <CreateButton variant="contained" onClick={moveToPage}>
              Create a collection
            </CreateButton>
          ) : (
            <CreateButton variant="contained" onClick={() => setIsOpenConnectModal(true)}>
              Connect Wallet
            </CreateButton>
          )}
        </FieldWrapper>
      </MyCollectionContainer>
      <WalletDialog
        isOpenConnectModal={isOpenConnectModal}
        handleCloseModal={handleCloseModal}
        activate={activate}
      />
    </MarketLayout>
  );
};

export default MyCollection;
