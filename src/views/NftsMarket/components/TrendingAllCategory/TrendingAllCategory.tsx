import React from 'react';
import { Box, CardMedia, Typography, useTheme } from '@mui/material';
import Slider from 'react-slick';
import useMediaQuery from '@mui/material/useMediaQuery';
import { styled } from '@mui/material/styles';
import useSWR from 'swr';
import { CollectionResponse } from '../../types';
import { Link } from 'react-router-dom';

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

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const TrendingAllCategory = () => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'), {
    defaultMatches: true,
  });
  const mdDown = useMediaQuery(theme.breakpoints.down('md'), {
    defaultMatches: true,
  });
  const { data, error } = useSWR<CollectionResponse>(
    `${process.env.REACT_APP_API_SERVER}/admin-api/market/indexsR?count=5`,
    fetcher,
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow:
      data?.data?.items !== undefined && data?.data?.items?.length < 4
        ? data?.data?.items.length
        : mdDown
        ? 1
        : 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <Box sx={{ mt: '30px' }}>
      {data && !error && (
        <>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.5rem',
              mb: '50px',
            }}
          >
            <Typography variant={smDown ? 'h3' : 'h1'} fontWeight={'700'}>
              Trending in
            </Typography>
            <Typography variant={smDown ? 'h3' : 'h1'} fontWeight={'700'} color={'primary'}>
              all collections
            </Typography>
          </Box>

          <Slider {...settings}>
            {data?.data?.items.map((item, index) => (
              <Box
                key={index}
                component={Link}
                to={`/market/collection/${item._id}`}
                sx={{ position: 'relative' }}
              >
                <CardMedia
                  component="img"
                  sx={{ px: '10px', height: '450px' }}
                  image={item.image_link}
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
                    {item.name.length > 20 ? `${item.name.slice(0, 17)}...` : item.name}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Slider>
        </>
      )}
    </Box>
  );
};

export default TrendingAllCategory;
