import React, { useEffect, useState } from 'react';
import MarketLayout from '../../layouts/market-layout/MarketLayout';
import Container from '../../layouts/market-layout/components/Container';
import { Alert, Box, Button, Grid, IconButton, Snackbar, Typography } from '@mui/material';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import klayLogo from '../../assets/images/network_icon/klaytn-klay-logo.png';
import { Link } from 'react-router-dom';
import useCopyToClipBoard from '../../hooks/useCopyToClipBoard';
import { useWeb3React } from '@web3-react/core';
import splitAddress from '../../utils/splitAddress';
import WalletDialog from '../../components/WalletDialog';
import { getUserNFTs } from '../../services/nft.service';
import NFTItem from './components/NFTItem';
import userImage from '../../assets/images/users/user.png';
import bannerImage from '../../assets/images/users/banner.png';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import marketService from '../../services/market.service';
import { targetNetwork } from '../../config';

const UserProfileWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const UserProfileLogo = styled(Box)`
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

const UserProfileName = styled(Box)`
  max-width: 800px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 16px;
  //margin-left: 30px;
`;

const UserProfile = () => {
  const [userInfor, setUserInfor] = useState(() => {
    const userStr = window.localStorage.getItem('user');
    const user = JSON.parse(userStr!);
    if (user) return user.infor;
    else null;
  });

  const { copyToClipBoard, copyResult, copyMessage, copyDone, setCopyDone } = useCopyToClipBoard();
  const context = useWeb3React();
  const { activate, account } = context;
  const [isOpenConnectModal, setIsOpenConnectModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'), {
    defaultMatches: true,
  });

  const handleCloseModal = async () => {
    setIsOpenConnectModal(false);
  };
  const [myNfts, setMyNfts] = useState([]);

  useEffect(() => {
    const fetchMyNfts = async () => {
      setIsLoading(true);
      if (!account) return;
      const nfts = await getUserNFTs(account, 100);
      if (nfts !== undefined) setMyNfts(nfts.data.nfts);
      setIsLoading(false);
    };

    fetchMyNfts();
  }, [getUserNFTs, account]);

  useEffect(() => {
    const authProcess = async () => {
      const res = await marketService.loginWidthAddress(account, parseInt(targetNetwork!));

      if (res.status === 1) setUserInfor(res.data.infor);
    };

    if (account) authProcess();
  }, [account]);

  return (
    <MarketLayout>
      {userInfor ? (
        <>
          <UserProfileWrapper>
            <Box sx={{ width: 1, height: '350px' }}>
              <img
                src={userInfor.banner ? userInfor.banner : bannerImage}
                alt={userInfor.full_name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Box>
            <UserProfileLogo>
              <img src={userInfor.image ? userInfor.image : userImage} alt={userInfor.full_name} />
            </UserProfileLogo>

            <Box
              sx={{
                maxWidth: '800px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                mt: 2,
                px: 5,
              }}
            >
              <UserProfileName>
                <Typography variant={'h1'}>{userInfor.full_name}</Typography>
                <IconButton component={Link} to="/market/profile/setting">
                  <SettingsOutlinedIcon fontSize={'medium'} />
                </IconButton>
              </UserProfileName>
              {account !== undefined && account !== null ? (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    border: '1px solid #d6d6d6',
                    borderRadius: '50px',
                    py: '5px',
                    px: '10px',
                    my: '5px',
                    cursor: 'pointer',
                  }}
                  onClick={() => copyToClipBoard(account)}
                >
                  <img src={klayLogo} alt="klay" height="16px" />
                  <Typography variant={'body1'}>{splitAddress(account!)}</Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    border: '1px solid #d6d6d6',
                    borderRadius: '50px',
                    py: '5px',
                    px: '10px',
                    my: '10px',
                    cursor: 'pointer',
                  }}
                  onClick={() => setIsOpenConnectModal(true)}
                >
                  <Typography variant={'body1'}>Connect Wallet</Typography>
                </Box>
              )}

              <Typography
                sx={{
                  background: showAll
                    ? 'none'
                    : `linear-gradient(to bottom, ${theme.palette.text.secondary}, #fff)`,
                  WebkitBackgroundClip: showAll ? 'none' : 'text',
                  WebkitTextFillColor: showAll ? 'none' : 'transparent',
                }}
                variant={'body1'}
                color="text.secondary"
              >
                {showAll && userInfor?.description !== null
                  ? `${userInfor?.description.slice(0, smDown ? 150 : 300)}`
                  : userInfor?.description}
              </Typography>
              <IconButton onClick={() => setShowAll((curr) => !curr)}>
                {showAll ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
              </IconButton>
              {/*<Typography variant={'body1'}>{userInfor.description}</Typography>*/}
            </Box>
          </UserProfileWrapper>
          <Container>
            <Box
              sx={{
                borderBottom: '1px solid',
                borderColor: `#d9d9d9`,
                width: '100%',
                py: 2,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Typography variant={'h3'} fontWeight={800}>
                My NFTs
              </Typography>
            </Box>
            <Grid container sx={{ py: 3 }}>
              {myNfts !== null && myNfts.length > 0 ? (
                myNfts.map((item, index) => (
                  <Grid item xs={6} sm={6} md={4} lg={3} key={index}>
                    <NFTItem item={item} />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                      border: '1px solid #d6d6d6',
                      borderRadius: '30px',
                      minHeight: '300px',
                    }}
                  >
                    <Typography variant={'h2'}>
                      {isLoading ? 'Loading.....' : 'No items to display'}
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>

            <WalletDialog
              isOpenConnectModal={isOpenConnectModal}
              handleCloseModal={handleCloseModal}
              activate={activate}
            />
            <Snackbar
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={copyDone}
              autoHideDuration={2000}
              onClose={() => {
                setCopyDone(false);
              }}
            >
              <Alert
                variant="filled"
                severity={copyResult ? 'success' : 'error'}
                sx={{ width: '100%' }}
              >
                {copyMessage}
              </Alert>
            </Snackbar>
          </Container>
        </>
      ) : (
        <UserProfileWrapper sx={{ marginTop: '10rem' }}>
          <Button variant="contained" onClick={() => setIsOpenConnectModal(true)}>
            Connect Wallet
          </Button>
        </UserProfileWrapper>
      )}
    </MarketLayout>
  );
};

export default UserProfile;
