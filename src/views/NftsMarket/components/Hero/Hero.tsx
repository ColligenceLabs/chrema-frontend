import React from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Container from '../Container';
import main from '../../../../assets/images/collery_main.png';
// import ImageViewer from '../../../../components/ImageViewer';

const HeroContainer = styled(Box)`
  position: relative;
`;

const BackGroundImage = styled(Box)`
  position: absolute;
  width: 100vw;
  height: 100%;
  background-image: url(${main});
  background-position: top;
  background-size: cover;
  //opacity: 0.5;
  z-index: -1;
  .overlay {
    width: 100vw;
    height: 100vh;
    background: rgba(333, 444, 331, 0.1);
  }
`;
const HeroSection = styled(Container)`
  display: flex;
  max-width: 1500px;
  height: 550px;
`;

const Hero = (): JSX.Element => {
  const theme = useTheme();
  const navigate = useNavigate();

  const isMd = useMediaQuery(theme.breakpoints.up('md'), {
    defaultMatches: true,
  });

  function navigateToPage() {
    navigate('/market');
  }

  return (
    <HeroContainer>
      <BackGroundImage />
      <HeroSection>
        <Grid container spacing={4}>
          <Grid item container xs={12} md={6} alignItems={'center'}>
            <Box data-aos={isMd ? 'fade-right' : 'fade-up'}>
              <Box marginBottom={2} sx={{ textAlign: 'left' }}>
                <Typography fontSize={'40px'} color="white" sx={{ fontWeight: 700 }}>
                  Global First Rental NFT
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
              <Box marginBottom={3} sx={{ textAlign: 'left' }}>
                <Typography variant="h2" component="p" color="white">
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
                  fullWidth={isMd ? false : true}
                  onClick={navigateToPage}
                >
                  Start now
                </Button>
              </Box>
            </Box>
          </Grid>
          <Grid item alignItems={'center'} justifyContent={'center'} xs={12} md={6}>
            <Box sx={{ px: '30px' }}>
              {/*<ImageViewer src={main} alt={'main'} style={{ borderRadius: '20px' }} />*/}
            </Box>
          </Grid>
        </Grid>
      </HeroSection>
    </HeroContainer>
  );
};

export default Hero;
