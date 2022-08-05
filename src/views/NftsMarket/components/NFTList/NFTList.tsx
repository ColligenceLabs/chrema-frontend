import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material';
import NFTItem from '../NFTItem';
import { useParams } from 'react-router-dom';
import useSWRInfinite from 'swr/infinite';
import { NFTResponse } from '../../types';
import ItemFilter from '../ItemFilter';

interface FilterSetType {
  searchKeyword: string;
  createAt: string;
  price: string;
  tokenId: string;
  minPrice: string;
  maxPrice: string;
}

interface NFTListProps {
  onSale: boolean | string | undefined;
}
const fetcher = (url: string) => fetch(url).then((res) => res.json());

const NFTList: React.FC<NFTListProps> = ({ onSale }) => {
  const { id } = useParams();
  const [itemCount, setItemCount] = useState(0);
  const [showLarge, setShowLarge] = useState(true);
  const [filterSet, setFilterSet] = useState<FilterSetType>({
    searchKeyword: '',
    createAt: '',
    price: '',
    tokenId: '',
    minPrice: '',
    maxPrice: '',
  });
  const PAGE_SIZE = showLarge ? 20 : 30;
  const { data, size, setSize, error, isValidating } = useSWRInfinite<NFTResponse>(
    (index) =>
      `${process.env.REACT_APP_API_SERVER}/admin-api/nft/indexsM?type=0&page=${
        index + 1
      }&perPage=${PAGE_SIZE}&onchain=true&collection_id=${id}&onSale=${onSale}&keyword=${
        filterSet.searchKeyword
      }&createdAt=${filterSet.createAt}&price=${filterSet.price}&tokenId=${filterSet.tokenId}&low=${
        filterSet.minPrice === '' ? '0' : filterSet.minPrice
      }&high=${filterSet.maxPrice === '' ? '0' : filterSet.maxPrice}`,
    fetcher,
  );

  const isLoadingInitialData = !data && !error;
  const isLoadingMore =
    isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === 'undefined');
  // @ts-ignore
  const isEmpty = data?.[0]?.data?.items.length === 0;

  // @ts-ignore
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.data?.headers?.x_pages_count <= size);
  const isRefreshing = isValidating && data && data.length === size;

  const onClickViewMode = (flag: boolean) => {
    setShowLarge(flag);
  };

  useEffect(() => {
    data !== undefined && setItemCount(data[0].data.headers.x_total_count);
  }, [data]);

  return (
    <Grid container>
      <ItemFilter
        filterSet={filterSet}
        setFilterSet={setFilterSet}
        showLarge={showLarge}
        onClickViewMode={onClickViewMode}
      />
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <Typography
          variant={'h5'}
          sx={{
            mb: '15px',
            px: '15px',
          }}
          color={'primary'}
          // onClick={() => setShowLarge((curr) => !curr)}
        >{`${itemCount} items`}</Typography>
      </Grid>
      {!error &&
        data &&
        data.map((result: NFTResponse) => {
          return result.data?.items.map((item) => (
            <Grid
              item
              xs={showLarge ? 12 : 6}
              sm={showLarge ? 12 : 6}
              md={showLarge ? 4 : 3}
              lg={showLarge ? 3 : 2}
              key={item._id}
            >
              <NFTItem item={item} showLarge={showLarge} />
            </Grid>
          ));
        })}

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
            height: '100vh',
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
  );
};

export default NFTList;
