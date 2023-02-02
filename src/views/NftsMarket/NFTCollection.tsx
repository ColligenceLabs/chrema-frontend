import React, { useEffect, useState } from 'react';
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
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
// @ts-ignore
import ImageViewer from 'react-simple-image-viewer';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import SNSButtons from './components/SNSButtons/SNSButtons';

const CollectionInfoWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CollectionLogo = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 200px;
  margin-top: -200px;
  //margin-left: 30px;

  & img {
    border-radius: 50%;
    width: 150px;
    height: 150px;
    object-fit: cover;
    //borderr-adius: 100%;
    border: 5px solid white;
    box-sizing: border-box;
  }
`;

const CollectionName = styled(Box)`
  //max-width: 800px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  const [optionalImageList, setOptionalImageList] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  const { id, onSale } = useParams();
  const { data, error } = useSWR<CollectionDetailResponse>(
    `/admin-api/collection/detail/${id}`,
    () => getNFTsByCollectionId(id),
  );

  useEffect(() => {
    const result = data?.optional_images.map((item) => item.image);
    if (result) setOptionalImageList(result);
  }, [data?.optional_images]);

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
            <Box
              sx={{
                py: '30px',
                px: '60px',
                width: '1500px',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <SNSButtons />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '30px',
                }}
              >
                <Box
                  sx={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: '#F7FBFD',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {/*<img src={twt_icon} alt="twitter" width="20px" />*/}
                  <FavoriteIcon sx={{ color: '#706C83' }} />
                </Box>
                <Box
                  sx={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: '#F7FBFD',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {/*<img src={twt_icon} alt="twitter" width="20px" />*/}
                  <ShareIcon sx={{ color: '#706C83' }} />
                </Box>
              </Box>
            </Box>
            <CollectionLogo>
              <img src={data?.logo_image} alt="" />
            </CollectionLogo>
            <CollectionName>
              <Typography
                sx={{ fontSize: '28px', fontWeight: 700, lineHeight: '44px', color: '#191820' }}
              >
                {data?.name}
              </Typography>
              <CollectionCreator>
                <Typography sx={{ fontSize: '18px', fontWeight: 500, lineHeight: '44px' }}>
                  By
                </Typography>
                <Typography
                  component={Link}
                  to={`/market/creator/${data?.creator_id?._id}`}
                  sx={{
                    fontSize: '18px',
                    fontWeight: 500,
                    lineHeight: '44px',
                    color: '#3749E9',
                    textDecoration: 'none',
                  }}
                  variant={'caption'}
                  color={'primary'}
                >
                  {data?.creator_id?.full_name}
                </Typography>
              </CollectionCreator>

              <Box
                sx={{
                  pt: '40px',
                  pb: '15px',
                  px: '30px',
                  width: '1500px',
                  textAlign: 'center',
                  backgroundColor: '#F7FBFD',
                }}
              >
                <Typography
                  sx={{
                    fontSize: '18px',
                    fontWeight: 400,
                    lineHeight: '24px',
                    color: '#706C83',
                  }}
                >
                  {showAll
                    ? data?.description
                    : `${data?.description.slice(0, smDown ? 150 : 300)}`}
                </Typography>
                <Box
                  sx={{
                    borderBottom: '1px dashed #DFDFDF',
                    width: '100%',
                    height: '2px',
                    my: '10px',
                    // backgroundColor: 'red',
                  }}
                />
                <IconButton onClick={() => setShowAll((curr) => !curr)}>
                  {showAll ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                </IconButton>
              </Box>
            </CollectionName>
          </CollectionInfoWrapper>
        )}

        {/*<Container sx={{ maxWidth: '1500px' }}>*/}
        <Container>
          <NFTList onSale={onSale} />
        </Container>
      </MarketLayout>
      {visible && (
        <ImageViewer
          src={optionalImageList}
          currentIndex={activeIndex}
          disableScroll={false}
          closeOnClickOutside={true}
          onClose={() => {
            setVisible(false);
          }}
          backgroundStyle={{ zIndex: 2001 }}
        />
      )}
    </>
  );
};

export default NFTCollection;
