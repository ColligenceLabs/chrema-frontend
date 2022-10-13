import React, { useState } from 'react';
import MarketLayout from '../../layouts/market-layout/MarketLayout';
import Container from './components/Container';
import { Box, Typography, IconButton, CardMedia } from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import NFTList from './components/NFTList';
import { Link, useParams } from 'react-router-dom';
import useSWR from 'swr';
import { CollectionDetailResponse } from './types';
import { getNFTsByCollectionId } from '../../services/market.service';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Slider from 'react-slick';

const StyledPrevArrow = styled(Box)`
  z-index: 1000;
`;

function PrevArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <StyledPrevArrow
      className={className}
      style={{
        ...style,
        left: '25px',
      }}
      onClick={onClick}
    />
  );
}

function NextArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <StyledPrevArrow
      className={className}
      style={{
        ...style,
        right: '25px',
      }}
      onClick={onClick}
    />
  );
}

const CollectionInfoWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const CollectionLogo = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 150px;
  margin-top: -130px;
  margin-left: 30px;

  & img {
    width: 150px;
    height: 150px;
    object-fit: cover;
    borderr-adius: 100%;
    border: 5px solid white;
    box-sizing: border-box;
  }
`;

const CollectionName = styled(Box)`
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 30px;
  margin-bottom: 16px;
  margin-left: 30px;
`;

const CollectionCreator = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 10px;
`;
const NFTCollection = () => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'), {
    defaultMatches: true,
  });
  const [showAll, setShowAll] = useState(false);
  const { id, onSale } = useParams();
  const { data, error } = useSWR<CollectionDetailResponse>(
    `/admin-api/collection/detail/${id}`,
    () => getNFTsByCollectionId(id),
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    // data?.optional_images !== undefined && data?.optional_images?.length < 2
    //   ? data?.optional_images.length
    //   : mdDown
    //   ? 1
    //   : 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <>
      <MarketLayout>
        {!error && data && (
          <CollectionInfoWrapper>
            <Box sx={{ width: 1, height: '350px' }}>
              <img
                src={data?.image_link}
                alt={data?.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Box>
            <CollectionLogo>
              {/*<img*/}
              {/*  src={data?.creator_id?.image?.replace(*/}
              {/*    'https://nftbedev.talken.io/taalNft/uploads',*/}
              {/*    'http://localhost:4000/taalNft',*/}
              {/*  )}*/}
              {/*  alt={data?.creator_id?.full_name}*/}
              {/*/>*/}
              <img src={data?.logo_image} />
            </CollectionLogo>
            <CollectionName>
              <Typography
                variant={smDown ? 'h3' : 'h1'}
                mb={smDown ? '15px' : '5px'}
                // sx={{ textAlign: 'center' }}
              >
                {data?.name}
              </Typography>
              <CollectionCreator>
                <Typography variant={'caption'}>by</Typography>
                <Typography
                  component={Link}
                  to={`/market/creator/${data?.creator_id?._id}`}
                  sx={{ textDecoration: 'none' }}
                  variant={'caption'}
                  color={'primary'}
                >
                  {data?.creator_id?.full_name}
                </Typography>
              </CollectionCreator>

              <Typography
                sx={{
                  // px: 3,
                  textAlign: 'left',
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
            </CollectionName>
          </CollectionInfoWrapper>
        )}

        <Box sx={{ px: 10, my: 2 }}>
          <Slider {...settings}>
            {data?.optional_images.map((item, index) => (
              <Box
                key={index}
                // component={Link}
                // to={`/market/collection/${item._id}`}
                sx={{ position: 'relative' }}
              >
                <CardMedia
                  component="img"
                  sx={{ px: '10px', width: '100%', maxHeight: '500px', objectFit: 'cover' }}
                  image={item.image}
                  alt="Live from space album cover"
                />
                <Box
                  sx={{
                    position: 'absolute',
                    right: '20px',
                    bottom: '10px',
                    p: 1,
                    // backgroundColor: 'rgba(240, 250, 245, 0.5)',
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  }}
                >
                  <Typography color={'white'} fontSize={'x-large'} fontWeight={800}>
                    {item.description.length > 20
                      ? `${item.description.slice(0, 17)}...`
                      : item.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Slider>
        </Box>

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
