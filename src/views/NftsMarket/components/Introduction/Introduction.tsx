import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import wallet_icon from '../../../../assets/images/landing_icon/introduction_wallet.svg';
import nft_icon from '../../../../assets/images/landing_icon/introduction_nft.svg';
import taal_icon from '../../../../assets/images/landing_icon/introduction_taal.svg';
import market_icon from '../../../../assets/images/landing_icon/introduction_market.svg';

const Introduction = () => {
  const theme = useTheme();

  const smDown = useMediaQuery(theme.breakpoints.down('sm'), {
    defaultMatches: true,
  });
  return (
    <Box sx={{ mt: '30px' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: smDown ? 'column' : 'row',
          gap: '0.5rem',
          mb: '50px',
        }}
      >
        <Typography fontSize={'30px'} fontWeight={'700'} color={'white'}>
          Create and sell
        </Typography>
        <Typography fontSize={'30px'} fontWeight={'700'} color={'white'}>
          your NFTs
        </Typography>
      </Box>
      <Grid container>
        <Grid
          item
          sm={12}
          md={6}
          lg={3}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '0.5rem',
            p: '25px',
          }}
        >
          <img src={wallet_icon} width="60px" alt="wallet_icon" />
          <Typography variant={'h4'} color={'text.primary'}>
            Set up your wallet
          </Typography>
          <Typography variant={'h6'} color={'text.primary'}>
            Once you’ve set up your wallet of choice, connect it to OpenSea by clicking the wallet
            icon in the top right corner. Learn about the wallets we support.
          </Typography>
        </Grid>
        <Grid
          item
          sm={12}
          md={6}
          lg={3}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '0.5rem',
            p: '25px',
          }}
        >
          <img src={nft_icon} width="60px" alt="collection_icon" />
          <Typography variant={'h4'} color={'text.primary'}>
            Create or add your NFTs
          </Typography>
          <Typography variant={'h6'} color={'text.primary'}>
            Be a creator to make your collection and mint your NFTs.
          </Typography>
          <Typography variant={'h6'} color={'text.primary'}>
            Upload your work (image, video, audio, or 3D art), add a title and description, and
            customize your NFTs with properties, stats, and unlockable content.
          </Typography>
        </Grid>
        <Grid
          item
          sm={12}
          md={6}
          lg={3}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '0.5rem',
            p: '25px',
          }}
        >
          <img src={market_icon} width="60px" alt="nft_icon" />
          <Typography variant={'h4'} color={'text.primary'}>
            List them for sale
          </Typography>
          <Typography variant={'h6'} color={'text.primary'}>
            Choose between auctions, fixed-price listings, and declining-price listings. You choose
            how you want to sell your NFTs, and we help you sell them!
          </Typography>
        </Grid>
        <Grid
          item
          sm={12}
          md={6}
          lg={3}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '0.5rem',
            p: '25px',
          }}
        >
          <img src={taal_icon} width="60px" alt="taal_icon" />
          <Typography variant={'h4'} color={'text.primary'}>
            Staking NFTs & Support Creators
          </Typography>
          <Typography variant={'h6'} color={'text.primary'}>
            Share profits by supporting creators&apos; creative activities, or create additional
            profits in addition to trading profits through staking of NFTs.
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Introduction;
