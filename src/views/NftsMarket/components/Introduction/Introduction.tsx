import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import intro_icon_01 from '../../../../assets/images/logos/intro-icon-01.png';
import intro_icon_02 from '../../../../assets/images/logos/intro-icon-02.png';
import intro_icon_03 from '../../../../assets/images/logos/intro-icon-03.png';
import intro_icon_04 from '../../../../assets/images/logos/intro-icon-04.png';
import Container from '../Container';

const IntroductionSection = styled(Container)(({ theme, smDown }) => ({
  maxWidth: '1500px',
  display: 'flex',
  backgroundColor: theme.palette.primary.main,
  borderRadius: smDown ? '0' : '38px',
  zIndex: '2000',
}));

const IntroData = [
  {
    id: 0,
    icon: intro_icon_01,
    title: 'Set up your wallet',
    description:
      'Once you’ve set up your wallet of choice, connect it to OpenSea by clicking the wallet icon in the top right corner. Learn about the wallets we support.',
  },
  {
    id: 1,
    icon: intro_icon_02,
    title: 'Create or add your NFTs',
    description:
      'Be a creator to make your collection and mint your NFTs. Upload your work (image, video, audio, or 3D art), add a title and description, and  customize your NFTs with properties, stats, and unlockable content.',
  },
  {
    id: 2,
    icon: intro_icon_03,
    title: 'List them for sale',
    description:
      'Choose between auctions, fixed-price listings, and declining-price listings. You choose how you want to sell your NFTs, and we help you sell them!',
  },
  {
    id: 3,
    icon: intro_icon_04,
    title: 'Staking NFTs & Support Creators',
    description:
      'Share profits by supporting creators&apos; creative activities, or create additional profits in addition to trading profits through staking of NFTs.',
  },
];

const Introduction = () => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'), {
    defaultMatches: true,
  });
  return (
    <IntroductionSection smDown={smDown}>
      <Grid container>
        {IntroData.map((item: any) => (
          <Grid
            key={item.id}
            item
            sm={12}
            md={6}
            lg={3}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              p: '25px',
            }}
          >
            <Box
              sx={{
                width: '130px',
                height: '130px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '30px',
              }}
            >
              <img src={item.icon} width="50px" alt="wallet_icon" />
            </Box>

            <Typography
              sx={{
                marginBottom: '15px',
                fontSize: '18px',
                fontWeight: 700,
                lineHeight: '24px',
                color: '#ffffff',
              }}
            >
              {item.title}
            </Typography>
            <Typography
              sx={{
                fontSize: '14px',
                fontWeight: 400,
                lineHeight: '20px',
                color: '#ffffff',
              }}
            >
              {item.description}
            </Typography>
          </Grid>
        ))}
        {/*<Grid*/}
        {/*  item*/}
        {/*  sm={12}*/}
        {/*  md={6}*/}
        {/*  lg={3}*/}
        {/*  sx={{*/}
        {/*    display: 'flex',*/}
        {/*    flexDirection: 'column',*/}
        {/*    alignItems: 'center',*/}
        {/*    textAlign: 'center',*/}
        {/*    gap: '0.5rem',*/}
        {/*    p: '25px',*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <img src={intro_icon_02} width="60px" alt="collection_icon" />*/}
        {/*  <Typography variant={'h4'} color={'text.primary'}>*/}
        {/*    Create or add your NFTs*/}
        {/*  </Typography>*/}
        {/*  <Typography variant={'h6'} color={'text.primary'}></Typography>*/}
        {/*  <Typography variant={'h6'} color={'text.primary'}>*/}
        {/*    Be a creator to make your collection and mint your NFTs. Upload your work (image, video,*/}
        {/*    audio, or 3D art), add a title and description, and customize your NFTs with properties,*/}
        {/*    stats, and unlockable content.*/}
        {/*  </Typography>*/}
        {/*</Grid>*/}
        {/*<Grid*/}
        {/*  item*/}
        {/*  sm={12}*/}
        {/*  md={6}*/}
        {/*  lg={3}*/}
        {/*  sx={{*/}
        {/*    display: 'flex',*/}
        {/*    flexDirection: 'column',*/}
        {/*    alignItems: 'center',*/}
        {/*    textAlign: 'center',*/}
        {/*    gap: '0.5rem',*/}
        {/*    p: '25px',*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <img src={intro_icon_03} width="60px" alt="nft_icon" />*/}
        {/*  <Typography variant={'h4'} color={'text.primary'}>*/}
        {/*    List them for sale*/}
        {/*  </Typography>*/}
        {/*  <Typography variant={'h6'} color={'text.primary'}>*/}
        {/*    Choose between auctions, fixed-price listings, and declining-price listings. You choose*/}
        {/*    how you want to sell your NFTs, and we help you sell them!*/}
        {/*  </Typography>*/}
        {/*</Grid>*/}
        {/*<Grid*/}
        {/*  item*/}
        {/*  sm={12}*/}
        {/*  md={6}*/}
        {/*  lg={3}*/}
        {/*  sx={{*/}
        {/*    display: 'flex',*/}
        {/*    flexDirection: 'column',*/}
        {/*    alignItems: 'center',*/}
        {/*    textAlign: 'center',*/}
        {/*    gap: '0.5rem',*/}
        {/*    p: '25px',*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <img src={intro_icon_04} width="60px" alt="taal_icon" />*/}
        {/*  <Typography variant={'h4'} color={'text.primary'}>*/}
        {/*    Staking NFTs & Support Creators*/}
        {/*  </Typography>*/}
        {/*  <Typography variant={'h6'} color={'text.primary'}>*/}
        {/*    Share profits by supporting creators&apos; creative activities, or create additional*/}
        {/*    profits in addition to trading profits through staking of NFTs.*/}
        {/*  </Typography>*/}
        {/*</Grid>*/}
      </Grid>
    </IntroductionSection>
  );
};

export default Introduction;
