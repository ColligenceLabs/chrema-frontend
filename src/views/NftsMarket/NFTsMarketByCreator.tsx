import React, { useState } from 'react';
import { Box, Button, CircularProgress, Grid, IconButton, Typography } from '@mui/material';
import Container from './components/Container';
import MarketLayout from '../../layouts/market-layout/MarketLayout';
import { CollectionResponse } from './types';
import { useParams } from 'react-router-dom';
import useSWRInfinite from 'swr/infinite';
import CollectionItem from './components/CollectionItem';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import userImage from '../../assets/images/users/user.png';
import bannerImage from '../../assets/images/users/banner.png';
import useSWR from 'swr';

const UserProfileLogo = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 150px;
  margin-top: -80px;

  & img {
    width: 150px;
    height: 150px;
    object-fit: cover;
    border-radius: 100%;
    border: 5px solid white;
    box-sizing: border-box;
  }
`;

const PAGE_SIZE = 20;
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const NFTsMarketByCreator = () => {
  const { id } = useParams();
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'), {
    defaultMatches: true,
  });
  const [showAll, setShowAll] = useState(false);

  const { data: creatorData, error: creatorDataError } = useSWR(
    `${process.env.REACT_APP_API_SERVER}/market/profile/${id}`,
    fetcher,
  );

  const { data, size, setSize, error } = useSWRInfinite<CollectionResponse>(
    (index) =>
      `${process.env.REACT_APP_API_SERVER}/admin-api/home/indexs?page=${
        index + 1
      }&perPage=${PAGE_SIZE}&creator_id=${id}`,
    fetcher,
  );

  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === 'undefined');
  // @ts-ignore
  const isEmpty = data?.[0]?.data?.items.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.data?.headers?.x_pages_count <= size);
  // const isRefreshing = isValidating && data && data.length === size;

  return (
    <MarketLayout>
      {creatorData && !creatorDataError && (
        <>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ width: 1, height: '350px' }}>
              <img
                src={creatorData?.data?.banner ? creatorData?.data?.banner : bannerImage}
                alt={creatorData?.data?.full_name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Box>
            <UserProfileLogo>
              <img
                src={creatorData?.data?.image ? creatorData?.data?.image : userImage}
                alt={creatorData?.data?.name}
                style={{
                  width: '150px',
                  height: '150px',
                  objectFit: 'cover',
                  borderRadius: '50%',
                  border: '5px solid white',
                  boxSizing: 'border-box',
                }}
              />
            </UserProfileLogo>

            <Box
              sx={{
                maxWidth: '800px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mt: 2,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1 }}>
                <Typography variant={'h1'} color={'primary'}>
                  {creatorData?.data?.name}
                </Typography>
              </Box>

              {/*<Typography*/}
              {/*  sx={{*/}
              {/*    px: 3,*/}
              {/*    textAlign: 'center',*/}
              {/*    background: showAll*/}
              {/*      ? 'none'*/}
              {/*      : `linear-gradient(to bottom, ${theme.palette.text.secondary}, #fff)`,*/}
              {/*    WebkitBackgroundClip: showAll ? 'none' : 'text',*/}
              {/*    WebkitTextFillColor: showAll ? 'none' : 'transparent',*/}
              {/*  }}*/}
              {/*  variant={'body1'}*/}
              {/*  color="text.secondary"*/}
              {/*>*/}
              {/*  {showAll && creatorData?.data?.description !== null*/}
              {/*    ? `${creatorData?.data?.description.slice(0, smDown ? 150 : 300)}`*/}
              {/*    : creatorData?.data?.description}*/}
              {/*</Typography>*/}
              {/*<IconButton onClick={() => setShowAll((curr) => !curr)}>*/}
              {/*  {showAll ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}*/}
              {/*</IconButton>*/}
              <Box
                sx={{
                  pt: '40px',
                  pb: '15px',
                  px: '30px',
                  width: '1500px',
                  textAlign: 'center',
                  backgroundColor: '#F7FBFD',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '18px',
                    fontWeight: 400,
                    lineHeight: '24px',
                    color: '#706C83',
                  }}
                >
                  {showAll
                    ? creatorData?.data?.description
                    : `${creatorData?.data?.description.slice(0, smDown ? 150 : 300)}`}
                </Typography>
                <Box
                  sx={{
                    borderBottom: '1px dashed #DFDFDF',
                    width: '100%',
                    height: '2px',
                    my: '10px',
                    // backgroundColor: 'red',
                  }}
                />
                <IconButton onClick={() => setShowAll((curr) => !curr)}>
                  {showAll ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                </IconButton>
              </Box>
            </Box>
          </Box>
          {/*<Box*/}
          {/*  sx={{ borderBottom: '1px solid', borderColor: `#d9d9d9`, width: '100%', pt: '30px' }}*/}
          {/*/>*/}
          {/*<Container sx={{ maxWidth: '1500px' }}>*/}
          <Container>
            <Grid container>
              {!error &&
                data &&
                data.map((result: CollectionResponse) => {
                  return result.data?.items.map((item) => (
                    <Grid item xs={6} sm={6} md={4} lg={3} key={item._id}>
                      <CollectionItem
                        id={item._id}
                        name={item.name}
                        description={item.description}
                        cover_image={item.image_link}
                        creator_image={item.logo_image}
                        creator_fullName={item?.creator_id?.full_name}
                        onSale={true}
                      />
                    </Grid>
                  ));
                })}

              {isEmpty && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    border: '1px solid #d6d6d6',
                    borderRadius: '30px',
                    height: '300px',
                    m: '15px',
                  }}
                >
                  <Typography variant={'h2'}>No items to display</Typography>
                </Box>
              )}
              {!error && data?.[size - 1] === undefined && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    width: '100%',
                    border: '1px solid #d6d6d6',
                    borderRadius: '30px',
                    height: '300px',
                    m: '15px',
                  }}
                >
                  <CircularProgress />
                  <Typography sx={{ mt: 2 }} variant={'h4'} color={'primary'}>
                    Loading...
                  </Typography>
                </Box>
              )}
              {!isEmpty && (
                <Grid item xs={12} sm={12} md={12} lg={12} sx={{ px: 2 }}>
                  {!(isLoadingMore || isReachingEnd) && (
                    <Button fullWidth variant={'contained'} onClick={() => setSize(size + 1)}>
                      {isLoadingMore ? 'Loading...' : isReachingEnd ? 'No more NFTs' : 'MORE'}
                    </Button>
                  )}
                </Grid>
              )}
            </Grid>
          </Container>
        </>
      )}
    </MarketLayout>
  );
};

export default NFTsMarketByCreator;
