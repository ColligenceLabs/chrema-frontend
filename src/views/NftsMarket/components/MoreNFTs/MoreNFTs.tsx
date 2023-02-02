import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Grid, Typography, useTheme } from '@mui/material';
import useSWR from 'swr';
import { NFTResponse, NFTType } from '../../types';
import NFTItem from '../NFTItem';
import { Link } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import SectionWrapper from '../DetailComponents/SectionWrapper';
import AppsIcon from '@mui/icons-material/Apps';

interface MoreNFTsProps {
  collection_id: string;
  nft_id: string;
  name: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const MoreNFTs: React.FC<MoreNFTsProps> = ({ collection_id, name, nft_id }) => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'), {
    defaultMatches: true,
  });
  const { data, error, mutate } = useSWR<NFTResponse>(
    `${process.env.REACT_APP_API_SERVER}/admin-api/nft/indexsR?onchain=true&collection_id=${collection_id}&nft_id=${nft_id}&type=0&status=active`,
    fetcher,
  );

  useEffect(() => {
    mutate();
  }, [name, mutate]);

  return (
    // <SectionWrapper title={'More From This Collection'} icon={<AppsIcon />} toggled={true}>
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: '15px',
          marginTop: '70px',
          marginBottom: '50px',
        }}
      >
        <Typography
          sx={{ fontSize: '24px', fontWeight: 700, lineHeight: '24px', color: '#706C83' }}
        >
          More from this collection
        </Typography>
        <Button variant={'contained'} component={Link} to={`/market/collection/${collection_id}`}>
          More +
        </Button>
      </Box>

      <Box
        sx={{
          p: 0,
          overflow: 'hidden',
          overflowY: 'scroll',
          // backgroundColor: '#f0faf5',
        }}
      >
        <Box>
          <Grid container>
            {!error &&
              data &&
              data.data?.items.map((item: NFTType, index) => (
                <Grid item xs={6} sm={6} md={4} lg={3} key={index}>
                  <NFTItem item={item} />
                </Grid>
              ))}

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
          </Grid>
        </Box>
      </Box>
      {/*<Box sx={{ borderTop: 0.5, borderColor: '#d6d6d6', p: 2, textAlign: 'center' }}>*/}
      {/*  <Button component={Link} to={`/market/collection/${collection_id}`} variant={'outlined'}>*/}
      {/*    View NFTs in this Collection*/}
      {/*  </Button>*/}
      {/*</Box>*/}
    </>
    // </SectionWrapper>
  );
};

export default MoreNFTs;
