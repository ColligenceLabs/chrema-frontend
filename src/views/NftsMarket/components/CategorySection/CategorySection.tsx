import React, { useEffect } from 'react';
import { Box, Button, CircularProgress, Grid, Typography, useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import useSWRInfinite from 'swr/infinite';
import { CollectionResponse } from '../../types';
import useSWR from 'swr';
import CollectionItem from '../CollectionItem';
import { styled } from '@mui/material/styles';
import Container from '../Container';

const AllCategorySection = styled(Container)`
  max-width: 1500px;
`;

type CategorySectionProps = {
  title: string;
  category: string;
};
const fetcher = (url: string) => fetch(url).then((res) => res.json());
const CategorySection: React.FC<CategorySectionProps> = ({ title, category }) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'), {
    defaultMatches: true,
  });

  const url = `${
    process.env.REACT_APP_API_SERVER
  }/admin-api/home/indexs?page=1&perPage=4&category=${category === 'all' ? '' : category}`;
  const { data, mutate, error } = useSWR(url, fetcher);

  const isEmpty = data?.data?.items.length === 0;
  useEffect(() => {
    mutate();
  }, []);

  return (
    <AllCategorySection>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem',
          mb: '50px',
        }}
      >
        <Typography variant={smDown ? 'h3' : 'h1'} fontWeight={'700'} color={'primary'}>
          {title}
        </Typography>
      </Box>
      <Grid container>
        {!error &&
          data &&
          data.data.items.map((item: any) => (
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
          ))}

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
        {!error && data === undefined && (
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
        {/*{!isEmpty && (*/}
        {/*  <Grid item xs={12} sm={12} md={12} lg={12} sx={{ px: 2, mt: 2 }}>*/}
        {/*    {!(isLoadingMore || isReachingEnd) && (*/}
        {/*      <Button fullWidth variant={'contained'} onClick={() => setSize(size + 1)}>*/}
        {/*        {isLoadingMore ? 'Loading...' : isReachingEnd ? 'No more NFTs' : 'MORE'}*/}
        {/*      </Button>*/}
        {/*    )}*/}
        {/*  </Grid>*/}
        {/*)}*/}
      </Grid>
    </AllCategorySection>
  );
};

export default CategorySection;
