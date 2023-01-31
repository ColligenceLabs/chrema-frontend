import React, { useState } from 'react';
import { Box, Button, Chip, CircularProgress, Grid, Typography, useTheme } from '@mui/material';
import { CollectionResponse } from '../../types';
import CollectionItem from '../CollectionItem';
import useSWRInfinite from 'swr/infinite';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '@mui/material/styles';
import Container from '../Container';
import { COLLECTION_CATEGORY } from '../../../Collection/catetories';

const AllCategorySection = styled(Container)`
  max-width: 1500px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

// const BoxChip = styled(Box)`
//   display: flex;
//   flex-direction: row;
//   align-items: flex-start;
//   padding: 5px 20px;
//   gap: 10px;
//
//   //width: 62px;
//   height: 32px;
//
//   background: #3749e9;
//   border-radius: 16px;
//   color: ${(props) => (props.selectedItem ? 'white' : 'black')};
//   /* Inside auto layout */
//
//   flex: none;
//   order: 0;
//   flex-grow: 0;
// `;

const BoxChip = styled(Box)(({ theme, selected }: any) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  padding: '5px 20px',
  gap: '10px',
  height: '32px',
  background: selected ? '#3749e9' : '#F7FBFD',
  borderRadius: '16px',
  color: selected ? '#ffffff' : theme.palette.text.primary,
  cursor: 'pointer',
  fontWeight: selected ? '700' : '500',
  fontSize: '16px',
  lineHeight: '22px',
}));

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const PAGE_SIZE = 20;

const AllCollectionList = () => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'), {
    defaultMatches: true,
  });
  const [selectedCategory, setSelectedCategory] = useState('art');
  const { data, size, setSize, error, isValidating } = useSWRInfinite<CollectionResponse>(
    (index) =>
      `${process.env.REACT_APP_API_SERVER}/admin-api/home/indexs?page=${
        index + 1
      }&perPage=${PAGE_SIZE}`,
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
    <AllCategorySection>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Typography fontSize={'38px'} fontWeight={500} color={'text.primary'}>
          All Collections
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        {COLLECTION_CATEGORY.map((item, index) => (
          <BoxChip
            key={index}
            selected={selectedCategory === item.value}
            onClick={() => setSelectedCategory(item.value)}
          >
            {item.title}
          </BoxChip>
        ))}
      </Box>
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
          <Grid item xs={12} sm={12} md={12} lg={12} sx={{ px: 2, mt: 2 }}>
            {!(isLoadingMore || isReachingEnd) && (
              <Button fullWidth variant={'contained'} onClick={() => setSize(size + 1)}>
                {isLoadingMore ? 'Loading...' : isReachingEnd ? 'No more NFTs' : 'MORE'}
              </Button>
            )}
          </Grid>
        )}
      </Grid>
    </AllCategorySection>
  );
};

export default AllCollectionList;
