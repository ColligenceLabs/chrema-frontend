import React, { useState } from 'react';
import { Box, Button, CircularProgress, Grid, Typography, useTheme } from '@mui/material';
import { CollectionResponse } from '../../types';
import CollectionItem from '../CollectionItem';
import useSWRInfinite from 'swr/infinite';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '@mui/material/styles';
import Container from '../Container';
import CategorySelector from '../CategorySelector/CategorySelector';

const AllCategorySection = styled(Container)`
  max-width: 1500px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  margin-top: ${(props) => props.smdown && '180px'};
`;

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const PAGE_SIZE = 12;

const AllCollectionList = () => {
  const theme = useTheme();
  const smdown = useMediaQuery(theme.breakpoints.down('sm'), {
    defaultMatches: true,
  });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { data, size, setSize, error, isValidating } = useSWRInfinite<CollectionResponse>(
    (index) =>
      `${process.env.REACT_APP_API_SERVER}/admin-api/home/indexs?page=${
        index + 1
      }&perPage=${PAGE_SIZE}&category=${selectedCategory === 'all' ? '' : selectedCategory}`,
    fetcher,
  );

  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === 'undefined');
  // @ts-ignore
  const isEmpty = data?.[0]?.data?.items.length === 0;
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.data?.headers?.x_pages_count <= size);

  return (
    <AllCategorySection smdown={smdown.toString()}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Typography fontSize={smdown ? '30px' : '38px'} fontWeight={500} color={'text.primary'}>
          All Collections
        </Typography>
      </Box>
      <CategorySelector
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <Grid container>
        {!error &&
          data &&
          data.map((result: CollectionResponse) => {
            return result.data?.items.map((item) => (
              <Grid item xs={12} sm={12} md={4} lg={3} key={item._id}>
                <CollectionItem
                  id={item._id}
                  name={item.name}
                  description={item.description}
                  cover_image={item.image_link}
                  creator_image={item?.creator_id?.image}
                  creator_fullName={item?.creator_id?.full_name}
                  onSale={false}
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
          // <Grid item xs={12} sm={12} md={12} lg={12} sx={{ px: 2, mt: 2 }}>
          //   {!(isLoadingMore || isReachingEnd) && (
          //     <Button variant={'contained'} onClick={() => setSize(size + 1)}>
          //       {isLoadingMore ? 'Loading...' : isReachingEnd ? 'No more NFTs' : 'MORE'}
          //     </Button>
          //   )}
          // </Grid>
          <Box sx={{ width: '100%', textAlign: 'center', marginTop: '1rem' }}>
            {!(isLoadingMore || isReachingEnd) && (
              <Button
                variant={'contained'}
                sx={{
                  width: '150px',
                  height: '60px',
                  fontsSize: '16px',
                  fontWeight: 500,
                  lineHeight: '19.5px',
                }}
                onClick={() => setSize(size + 1)}
              >
                {isLoadingMore ? 'Loading...' : isReachingEnd ? 'No more NFTs' : 'More'}
              </Button>
            )}
          </Box>
        )}
      </Grid>
    </AllCategorySection>
  );
};

export default AllCollectionList;
