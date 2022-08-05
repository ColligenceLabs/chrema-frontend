import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import { alpha, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Slider from 'react-slick';
import nft1 from '../../../../assets/images/products/landing_nft1.png';
import nft2 from '../../../../assets/images/products/landing_nft2.png';
import { useNavigate } from 'react-router-dom';

const Hero = (): JSX.Element => {
  const theme = useTheme();
  const navigate = useNavigate();
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 5000,
  };

  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  function navigateToPage() {
    // navigate('/market/detail', {
    //   state: { contract_address: '0x92b3f5bd683a5f0b1bcd2160043d08a73d938fbb', token_id: '0x9' },
    // });
    navigate('/market');
  }

  return (
    <Grid container spacing={4}>
      <Grid item container xs={12} md={6} alignItems={'center'}>
        <Box data-aos={isMd ? 'fade-right' : 'fade-up'}>
          <Box marginBottom={2} sx={{ textAlign: 'center' }}>
            <Typography fontSize={'40px'} color="text.primary" sx={{ fontWeight: 700 }}>
              NFTs with DeFi…
              <br />
              <Typography
                color={'primary'}
                component={'span'}
                variant={'inherit'}
                sx={{
                  background: `linear-gradient(180deg, transparent 82%, ${alpha(
                    theme.palette.secondary.main,
                    0.3,
                  )} 0%)`,
                }}
              >
                Get your extra profits.
              </Typography>
            </Typography>
          </Box>
          <Box marginBottom={3} sx={{ textAlign: 'center' }}>
            <Typography variant="h2" component="p" color="text.secondary">
              Create and trade NFTs on the TaalSwap Marketplace or generate additional revenue
              through TaalSwap&apos;s DeFi service.
            </Typography>
          </Box>
          <Box
            display="flex"
            justifyContent={'center'}
            flexDirection={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'stretched', sm: 'flex-start' }}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth={isMd ? false : true}
              onClick={navigateToPage}
            >
              Start now
            </Button>
            {/*<Box*/}
            {/*  component={Button}*/}
            {/*  variant="outlined"*/}
            {/*  color="primary"*/}
            {/*  size="large"*/}
            {/*  marginTop={{ xs: 2, sm: 0 }}*/}
            {/*  marginLeft={{ sm: 2 }}*/}
            {/*  fullWidth={isMd ? false : true}*/}
            {/*  onClick={navigateToPage}*/}
            {/*>*/}
            {/*  Learn more*/}
            {/*</Box>*/}
          </Box>
        </Box>
      </Grid>
      <Grid item alignItems={'center'} justifyContent={'center'} xs={12} md={6}>
        <Box sx={{ px: '30px' }}>
          <Slider {...settings}>
            {[nft1, nft2].map((item, index) => (
              <Box
                key={index}
                component={LazyLoadImage}
                height={1}
                width={1}
                src={item}
                alt="..."
                effect="blur"
                boxShadow={3}
                borderRadius={2}
                // maxWidth={600}
                sx={{
                  filter: theme.palette.mode === 'dark' ? 'brightness(0.7)' : 'none',
                }}
              />
            ))}
          </Slider>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Hero;
