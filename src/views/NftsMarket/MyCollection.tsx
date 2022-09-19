import React, { useEffect, useState } from 'react';
import MarketLayout from '../../layouts/market-layout/MarketLayout';
import { styled, useTheme } from '@mui/material/styles';
import { Avatar, Box, Button, Card, CardContent, Container, Grid, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import useActiveWeb3React from '../../hooks/useActiveWeb3React';
import login, { register } from '../../services/auth.service';
import { useSelector } from 'react-redux';
import { CollectionItemType, CollectionResponse, StoreTypes } from './types';
import WalletDialog from '../../components/WalletDialog';
import { getCollectionsByCreatorId } from '../../services/collections.service';
import useUserInfo from '../../hooks/useUserInfo';
import CollectionItem from './components/CollectionItem';
import ImageViewer from '../../components/ImageViewer';
import useMediaQuery from '@mui/material/useMediaQuery';

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

const Collection: React.FC<CollectionItemType> = ({
  id,
  name,
  cover_image,
  description,
  creator_image,
  creator_fullName,
  onSale,
}) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'), {
    defaultMatches: true,
  });

  return (
    <Link to={`/market/collection/${id}`} style={{ textDecoration: 'none' }}>
      <Card
        sx={{
          p: 0,
          m: smDown ? 0.5 : 1,
          textDecoration: 'none',
          border: '0.1px solid #d6d6d6',
          borderRadius: '25px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <ImageViewer src={cover_image} alt={name} height={smDown ? '150px' : '150px'} />
        </Box>
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography variant={smDown ? 'caption' : 'h4'}>
            {name.length > 20 ? `${name.slice(0, 20)}...` : name}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
};

const MyCollection = () => {
  const navigate = useNavigate();
  const { id } = useUserInfo();
  const { account, activate } = useActiveWeb3React();
  const [isOpenConnectModal, setIsOpenConnectModal] = useState(false);
  const [collectionList, setCollectionList] = useState<CollectionItemType[]>([]);

  const handleCloseModal = async () => {
    setIsOpenConnectModal(false);
  };

  const moveToPage = () => {
    navigate('/market/collection/create');
  };

  const getCollectionList = async () => {
    console.log(id);
    await getCollectionsByCreatorId(id)
      .then(({ data }) => {
        console.log(data);
        setCollectionList(data.filter((row: any) => row.status === 'active'));
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    console.log(collectionList);
  }, [collectionList]);

  useEffect(() => {
    if (account) getCollectionList();
  }, [account]);

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
        <Grid container>
          {collectionList &&
            collectionList.map((item: any) => (
              <Grid item xs={6} sm={6} md={6} lg={6} key={item.contract_address}>
                <Collection
                  id={item._id}
                  name={item.name}
                  description={item.description}
                  cover_image={item.image_link}
                  creator_image={item?.creator_id?.image}
                  creator_fullName={item?.creator_id?.full_name}
                  onSale={false}
                />
              </Grid>
            ))}
        </Grid>
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
