import React, { useState } from 'react';
import MarketLayout from '../../layouts/market-layout/MarketLayout';
import Container from './components/Container';
import { Box, Typography, IconButton } from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import NFTList from './components/NFTList';
import { Link, useParams } from 'react-router-dom';
import useSWR from 'swr';
import { CollectionDetailResponse } from './types';
import { getNFTsByCollectionId } from '../../services/market.service';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const NFTCollection = () => {
  const [showAll, setShowAll] = useState(false);

  const { id, onSale } = useParams();

  const { data, error } = useSWR<CollectionDetailResponse>(
    `/admin-api/collection/detail/${id}`,
    () => getNFTsByCollectionId(id),
  );
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'), {
    defaultMatches: true,
  });

  return (
    <>
      <MarketLayout>
        {!error && data && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box sx={{ width: 1, height: '350px' }}>
              <img
                src={data?.image_link}
                alt={data?.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '150px',
                height: '150px',
                marginTop: '-75px',
              }}
            >
              <img
                src={data?.creator_id?.image?.replace(
                  'https://nftbedev.talken.io/taalNft/uploads',
                  'http://localhost:4000/taalNft',
                )}
                alt={data?.creator_id?.full_name}
                style={{
                  width: '150px',
                  height: '150px',
                  objectFit: 'cover',
                  borderRadius: '100%',
                  border: '5px solid white',
                  boxSizing: 'border-box',
                }}
              />
            </Box>
            <Box
              sx={{
                maxWidth: '800px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mt: 2,
              }}
            >
              <Typography
                variant={smDown ? 'h3' : 'h1'}
                mb={smDown ? '15px' : '10px'}
                sx={{ textAlign: 'center' }}
              >
                {data?.name}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.5rem',
                  mb: '10px',
                }}
              >
                <Typography variant={'body1'}>Created by</Typography>
                <Typography
                  component={Link}
                  to={`/market/creator/${data?.creator_id?._id}`}
                  sx={{ textDecoration: 'none' }}
                  variant={'body1'}
                  color={'primary'}
                >
                  {data?.creator_id?.full_name}
                </Typography>
              </Box>

              <Typography
                sx={{
                  px: 3,
                  textAlign: 'center',
                  background: showAll
                    ? 'none'
                    : `linear-gradient(to bottom, ${theme.palette.text.secondary}, #fff)`,
                  WebkitBackgroundClip: showAll ? 'none' : 'text',
                  WebkitTextFillColor: showAll ? 'none' : 'transparent',
                }}
                variant={'body1'}
                color="text.secondary"
              >
                {showAll ? data?.description : `${data?.description.slice(0, smDown ? 150 : 300)}`}
              </Typography>
              <IconButton onClick={() => setShowAll((curr) => !curr)}>
                {showAll ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
              </IconButton>
            </Box>
          </Box>
        )}

        <Box
          sx={{ borderBottom: '1px solid', borderColor: `#d9d9d9`, width: '100%', pt: '30px' }}
        />

        <Container>
          <NFTList onSale={onSale} />
        </Container>
      </MarketLayout>
    </>
  );
};

export default NFTCollection;
