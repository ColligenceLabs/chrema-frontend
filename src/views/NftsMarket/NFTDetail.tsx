import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Container from './components/Container';
import MarketLayout from '../../layouts/market-layout/MarketLayout';
// @ts-ignore
import FsLightbox from 'fslightbox-react';
import { Box, useTheme } from '@mui/material';
import useSWR from 'swr';
import { nftDetail } from '../../services/market.service';
import MoreNFTs from './components/MoreNFTs';
import useMediaQuery from '@mui/material/useMediaQuery';
// @ts-ignore
import FeatherIcon from 'feather-icons-react';
import ItemActivity from './components/ItemActivity';
import Listings from './components/Listings';
import DetailContents from './components/DetailComponents/DetailContents';
import DetailTitle from './components/DetailComponents/DetailTitle';
import DetailInformation from './components/DetailComponents/DetailInformation';
import DetailBuy from './components/DetailComponents/DetailBuy';
import DetailSell from './components/DetailComponents/DetailSell';
import OfferDialog from './components/OfferDialog';

const NFTDetail = () => {
  const [listingMutateHandler, setListingMutateHandler] = useState(false);
  const [myNftMutateHandler, setMyNftMutateHandler] = useState(false);
  const [itemActivityMutateHandler, setItemActivityMutateHandler] = useState(false);
  const [contractType, setContractType] = useState('KIP17');

  const theme = useTheme();
  const mdDown = useMediaQuery(theme.breakpoints.down('md'), {
    defaultMatches: true,
  });

  const { id } = useParams();
  const params = useLocation();

  let API_URL;

  // dapp route
  if (params.state === null) {
    API_URL = `${process.env.REACT_APP_API_SERVER}/admin-api/nft/detail/${id}`;
  } else {
    console.log('from talken app');
  }

  const { data, error } = useSWR(API_URL, () => nftDetail(id));

  useEffect(() => {
    if (data?.data) {
      setContractType(data?.data?.collection_id?.contract_type);
    }
  }, [data]);

  return (
    <MarketLayout>
      {data && !error && (
        <Container>
          {mdDown ? (
            <Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <DetailTitle nft={data?.data} />
                <DetailContents nft={data?.data} />
                <DetailInformation nft={data?.data} collection={data?.data?.collection_id} />
                <DetailBuy
                  id={id!}
                  itemActivityMutateHandler={itemActivityMutateHandler}
                  setItemActivityMutateHandler={(result) => setItemActivityMutateHandler(result)}
                />
                <Listings
                  id={id!}
                  listingMutateHandler={listingMutateHandler}
                  setItemActivityMutateHandler={(result) => setItemActivityMutateHandler(result)}
                  nft={data?.data}
                  myNftMutateHandler={myNftMutateHandler}
                  setMyNftMutateHandler={(result) => setMyNftMutateHandler(result)}
                />
                <DetailSell
                  id={id!}
                  listingMutateHandler={listingMutateHandler}
                  setListingMutateHandler={(result) => setListingMutateHandler(result)}
                  myNftMutateHandler={myNftMutateHandler}
                  setItemActivityMutateHandler={(result) => setItemActivityMutateHandler(result)}
                />
              </Box>

              <ItemActivity
                id={id!}
                contractType={contractType}
                itemActivityMutateHandler={itemActivityMutateHandler}
                setItemActivityMutateHandler={(result) => setItemActivityMutateHandler(result)}
              />
              <MoreNFTs
                nft_id={id!}
                collection_id={data?.data?.collection_id._id}
                name={data?.data?.metadata?.name}
              />
            </Box>
          ) : (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <DetailContents nft={data?.data} />
                  <DetailInformation nft={data?.data} collection={data?.data?.collection_id} />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <DetailTitle nft={data?.data} />
                  <DetailBuy
                    id={id!}
                    itemActivityMutateHandler={itemActivityMutateHandler}
                    setItemActivityMutateHandler={(result) => setItemActivityMutateHandler(result)}
                  />
                  <Listings
                    id={id!}
                    listingMutateHandler={listingMutateHandler}
                    setItemActivityMutateHandler={(result) => setItemActivityMutateHandler(result)}
                    nft={data?.data}
                    myNftMutateHandler={myNftMutateHandler}
                    setMyNftMutateHandler={(result) => setMyNftMutateHandler(result)}
                  />
                  <DetailSell
                    id={id!}
                    listingMutateHandler={listingMutateHandler}
                    setListingMutateHandler={(result) => setListingMutateHandler(result)}
                    myNftMutateHandler={myNftMutateHandler}
                    setItemActivityMutateHandler={(result) => setItemActivityMutateHandler(result)}
                  />
                </Box>
              </Box>
              <ItemActivity
                id={id!}
                contractType={contractType}
                itemActivityMutateHandler={itemActivityMutateHandler}
                setItemActivityMutateHandler={(result) => setItemActivityMutateHandler(result)}
              />
              <MoreNFTs
                nft_id={id!}
                collection_id={data?.data?.collection_id._id}
                name={data?.data?.metadata?.name}
              />
            </Box>
          )}
        </Container>
      )}
    </MarketLayout>
  );
};

export default NFTDetail;
