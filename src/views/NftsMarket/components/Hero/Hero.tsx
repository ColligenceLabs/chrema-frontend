import React from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Container from '../Container';
import main from '../../../../assets/images/main_visual.png';
import ImageViewer from '../../../../components/ImageViewer';
// import ImageViewer from '../../../../components/ImageViewer';

const HeroContainer = styled(Box)`
  position: relative;
`;

const HeroSection = styled(Container)`
  display: flex;
  //max-width: 1500px;
  height: 600px;
`;

const Hero = (): JSX.Element => {
  const theme = useTheme();
  const navigate = useNavigate();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'), {
    defaultMatches: true,
  });

  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  function navigateToPage() {
    navigate('/market');
  }

  return (
    <HeroContainer>
      <HeroSection>
        <Grid container spacing={4}>
          <Grid item container xs={12} md={6} alignItems={'center'}>
            <Box data-aos={isMd ? 'fade-right' : 'fade-up'}>
              <Box marginBottom={2} sx={{ textAlign: 'left' }}>
                <Typography fontSize={'40px'} color="text.primary" sx={{ fontWeight: 700 }}>
                  NFTs with DeFi…
                  <br />
                  Get{' '}
                  <Typography color={'primary'} component={'span'} variant={'inherit'}>
                    your extra profits.
                  </Typography>
                </Typography>
              </Box>
              <Box marginBottom={3} sx={{ textAlign: 'left' }}>
                <Typography fontSize="18px" component="p">
                  Create and trade NFTs on our Rentable Marketplace or Generate additional revenue
                  through N-Tal service.
                </Typography>
              </Box>
              <Box
                display="flex"
                justifyContent={'left'}
                flexDirection={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'stretched', sm: 'flex-start' }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth={!isMd}
                  onClick={navigateToPage}
                >
                  Start now
                </Button>
              </Box>
            </Box>
          </Grid>
          <Grid item alignItems={'center'} justifyContent={'center'} xs={12} md={6}>
            <Box sx={{ px: smDown ? '0' : '30px' }}>
              <ImageViewer src={main} alt={'main'} style={{ borderRadius: '20px' }} />
            </Box>
          </Grid>
        </Grid>
      </HeroSection>
    </HeroContainer>
  );
};

export default Hero;
