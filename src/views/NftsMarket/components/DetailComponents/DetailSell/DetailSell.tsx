import React, { useEffect, useState } from 'react';
import { Alert, Box, CircularProgress, Snackbar, Typography, useTheme } from '@mui/material';
import CustomTextField from '../../../../../components/forms/custom-elements/CustomTextField';
import { LoadingButton } from '@mui/lab';
import useSWR from 'swr';
import { getUserNftSerialsData } from '../../../../../services/nft.service';
import useActiveWeb3React from '../../../../../hooks/useActiveWeb3React';
import { useLocation } from 'react-router-dom';
import { nftDetail, sellUserNft } from '../../../../../services/market.service';
import useMediaQuery from '@mui/material/useMediaQuery';
import SectionWrapper from '../SectionWrapper';
import useMarket from '../../../../../hooks/useMarket';
import { getNftContract } from '../../../../../utils/contract';
import { getChainId } from '../../../../../utils/commonUtils';
import ScheduleDialog from '../../../../NFTs/ScheduleDialog';
import useCopyToClipBoard from '../../../../../hooks/useCopyToClipBoard';

interface DetailSellProps {
  id: string;
  listingMutateHandler: boolean;
  setListingMutateHandler: (b: boolean) => void;
  setItemActivityMutateHandler: (b: boolean) => void;
  myNftMutateHandler: boolean;
}

const DetailSell: React.FC<DetailSellProps> = ({
  id,
  listingMutateHandler,
  setListingMutateHandler,
  myNftMutateHandler,
  setItemActivityMutateHandler,
}) => {
  const { account, library } = useActiveWeb3React();
  const { copyToClipBoard, copyResult, copyMessage, copyDone, setCopyDone } = useCopyToClipBoard();
  const params = useLocation();
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'), {
    defaultMatches: true,
  });

  const { sellNFT } = useMarket();

  const [myNFT, setMyNFT] = useState<any>(null);
  const [myNFTCount, setMyNFTCount] = useState('0');
  const [sellAmount, setSellAmount] = useState('1');
  const [sellPrice, setSellPrice] = useState('0');
  const [totalPrice, setTotalPrice] = useState(0);
  const [sellStatus, setSellStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [minPriceCheck, setMinPriceCheck] = useState(false);
  const [openScheduleModal, setOpenScheduleModal] = useState(false);
  const [isCheckingMyNFT, setIsCheckingMyNFT] = useState(false);

  let API_URL;

  // dapp route
  if (params.state === null) {
    API_URL = `${process.env.REACT_APP_API_SERVER}/admin-api/nft/detail/${id}`;
  }

  const mdDown = useMediaQuery(theme.breakpoints.down('md'), {
    defaultMatches: true,
  });

  const { data, mutate } = useSWR(API_URL, () => nftDetail(id));

  const { data: myNftData, mutate: myNftMutate } = useSWR(
    `${API_URL}/user-serials?nft_id=${id}&owner_id=${account}`,
    () => getUserNftSerialsData(id, account),
  );

  const openSchedule = () => {
    setOpenScheduleModal(true);
  };

  const handleCloseModal = () => {
    setOpenScheduleModal(false);
    mutate();
    myNftMutate();
  };

  const sell = async () => {
    setSellStatus(true);

    if (parseFloat(sellPrice) < 0.000001) {
      setMinPriceCheck(true);
      setSellStatus(false);
      return;
    }
    if (myNftData.data.length < sellAmount) {
      setErrorMessage('????????????..');
      setSellStatus(false);
      return;
    }
    try {
      // ????????? ????????? ?????? ????????? readyToSell ??????
      const nftContract = getNftContract(
        library,
        myNftData.data[0].contract_address,
        data?.data?.collection_id?.contract_type,
      );
      // TODO : Rental NFT Type ?
      const nftType = data?.data?.collection_id?.contract_type === 'KIP17' ? 721 : 1155;
      // const nftType = data?.data?.collection_id?.contract_type === 'KIP37' ? 4907 : 721;
      const payout =
        data?.data?.collection_id?.fee_payout ?? '0x0000000000000000000000000000000000000000';
      const rate = data?.data?.collection_id?.fee_percentage ?? 0;

      // here
      setOpenScheduleModal(true);

      await sellNFT(
        nftContract,
        nftType,
        parseInt(myNftData.data[0].token_id, 16),
        sellAmount,
        parseFloat(sellPrice),
        myNftData.data[0].quote,
        payout,
        rate,
        getChainId(data.data.collection_id.network),
      );

      const sellSerials = myNftData.data.slice(0, sellAmount);
      const serialIds = sellSerials.map((serial: { _id: any }) => serial._id);
      // ????????? ?????? ????????? ?????? api ?????? (sale collection ??? ??????, serials ??? ????????? ??????????????? ??????, nft ???????????? user_selling_quantity ??????)
      const result = await sellUserNft(
        account,
        sellAmount,
        sellPrice,
        myNftData.data[0].quote,
        data?.data?.collection_id?._id,
        myNftData.data[0].nft_id,
        myNftData.data[0].token_id,
        serialIds,
      );
      if (result.status === 0) {
        // error
        console.log(result.message);
        setErrorMessage(result.message);
      }
      await myNftMutate();
      setListingMutateHandler(true);
      setItemActivityMutateHandler(true);
    } catch (e) {
      // @ts-ignore
      setErrorMessage(e.message);
      console.log(e);
    }
    setSellStatus(false);
    setSellAmount('1');
    setSellPrice('0');
  };

  useEffect(() => {
    mutate();
  }, [data.data]);

  useEffect(() => {
    setIsCheckingMyNFT(true);
    setTimeout(() => {
      myNftMutate().then((res) => {
        if (myNftData && myNftData?.data !== null) {
          console.log(myNftData?.data);
          setMyNFT(myNftData?.data);
          setMyNFTCount(myNftData?.data.length);
        } else {
          setMyNFT(null);
          setMyNFTCount('0');
        }
        setIsCheckingMyNFT(false);
      });
    }, 2000);
  }, [myNftMutateHandler, myNftData?.data]);

  useEffect(() => {
    setTotalPrice(parseInt(sellAmount) * parseFloat(sellPrice));
  }, [sellAmount, sellPrice]);

  return (
    <>
      {myNFT !== null && !isCheckingMyNFT ? (
        <SectionWrapper title={'My NFTs'} icon={'tag'}>
          <>
            {data?.data?.collection_id?.contract_type === 'KIP17' && (
              <Box sx={{ maxWidth: '100%' }}>
                <Box sx={{ pt: 2, px: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: 2,
                    }}
                  >
                    <Typography variant={'subtitle2'} color={'primary'} sx={{ flex: 1 }}>
                      My NFT Count
                    </Typography>
                    {loading ? (
                      <CircularProgress size={'small'} />
                    ) : (
                      <Box
                        display={'flex'}
                        justifyContent={'flex-start'}
                        alignItems={'center'}
                        gap={'0.5rem'}
                      >
                        <Typography variant={'h3'}>{myNFTCount}</Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            )}
          </>
          <Box
            sx={{
              py: 1,
              px: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            {data?.data?.collection_id?.contract_type === 'KIP37' && (
              <Box sx={{ flex: 2 }}>
                <Typography variant={'subtitle2'} color={'primary'}>
                  Amount
                </Typography>

                <Typography variant={'h3'}>{myNFTCount}</Typography>
              </Box>
            )}
            {data?.data?.seller ? (
              <>
                <Box sx={{ flex: 1 }}>
                  <Typography variant={'subtitle2'} color={'primary'}>
                    {`Unit Price (${data?.data?.quote.toUpperCase()})`}
                  </Typography>

                  <CustomTextField
                    id="price"
                    name="price"
                    variant="outlined"
                    type="number"
                    size="small"
                    value={sellPrice}
                    inputProps={{ min: 0, maxLength: 8 }}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      const validated = event.target.value.match(/^(\d*\.{0,1}\d{0,6}$)/);
                      if (validated) {
                        setSellPrice(event.target.value);
                      }
                    }}
                    // fullWidth
                  />
                </Box>
                <Box sx={{ flex: 1, width: smDown ? '50px' : '100px', border: '2px solid red' }}>
                  <LoadingButton
                    disabled={
                      totalPrice === 0 ||
                      isNaN(totalPrice) ||
                      myNFTCount < sellAmount ||
                      data?.data?.quote === 'krw'
                    }
                    loading={sellStatus}
                    onClick={sell}
                    fullWidth
                    variant="contained"
                  >
                    Sell
                  </LoadingButton>
                </Box>
              </>
            ) : (
              <>
                {/*{myNFT[0].nft_id.creator_id.admin_address === account ? (*/}
                <LoadingButton
                  loading={loading}
                  variant="contained"
                  // fullWidth
                  onClick={openSchedule}
                >
                  Sell NFT
                </LoadingButton>
                {/*) : (*/}
                {/*  <LoadingButton*/}
                {/*    variant="contained"*/}
                {/*    onClick={() => copyToClipBoard(myNFT[0].image_link)}*/}
                {/*  >*/}
                {/*    Copy Content Lint*/}
                {/*  </LoadingButton>*/}
                {/*)}*/}
              </>
            )}
          </Box>

          <Box>
            {data?.data?.collection_id?.contract_type === 'KIP37' &&
              !isNaN(totalPrice) &&
              totalPrice !== 0 && (
                <Box
                  sx={{
                    px: 2.5,
                    pb: 1,
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'bottom',
                    gap: '0.5rem',
                  }}
                >
                  <Typography variant={'subtitle2'}>Total : </Typography>
                  <Typography variant={'subtitle2'} color={'primary'}>
                    {totalPrice}
                  </Typography>
                  <Typography variant={'subtitle2'} color={'primary'}>
                    {data?.data?.quote.toUpperCase()}
                  </Typography>
                </Box>
              )}
          </Box>

          <Box>
            {minPriceCheck && (
              <Box
                sx={{
                  px: 2.5,
                  pb: 2,
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'bottom',
                  gap: '0.5rem',
                }}
              >
                <Typography variant={'subtitle2'} color={'error'}>
                  The minimum price that can be sold is 0.000001 or more.
                </Typography>
              </Box>
            )}
          </Box>
        </SectionWrapper>
      ) : isCheckingMyNFT ? (
        <Box
          sx={{
            mt: 2,
            border: '0.5px solid #d6d6d6',
            borderRadius: 2,
          }}
        >
          <Box sx={{ maxWidth: mdDown ? '100%' : '80%' }}>
            <Box sx={{ pt: 2, px: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  marginBottom: 2,
                }}
              >
                <CircularProgress size={20} />
                <Typography variant={'subtitle2'} color={'primary'} sx={{ marginLeft: 1.5 }}>
                  Checking My NFT..
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      ) : null}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={listingMutateHandler}
        autoHideDuration={2000}
        onClose={() => {
          setListingMutateHandler(false);
          setItemActivityMutateHandler(false);
        }}
      >
        <Alert
          onClose={() => {
            setListingMutateHandler(false);
            setItemActivityMutateHandler(false);
          }}
          variant="filled"
          severity={errorMessage === '' ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {errorMessage === '' ? 'Success' : `Fail (${errorMessage})`}
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={copyDone}
        autoHideDuration={2000}
        onClose={() => {
          setCopyDone(false);
        }}
      >
        <Alert variant="filled" severity={copyResult ? 'success' : 'error'} sx={{ width: '100%' }}>
          {copyResult ? 'Copied.' : copyMessage}
        </Alert>
      </Snackbar>
      <ScheduleDialog open={openScheduleModal} handleCloseModal={handleCloseModal} selected={id} />
    </>
  );
};

export default DetailSell;
