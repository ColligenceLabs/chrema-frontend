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

  const params = useLocation();
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'), {
    defaultMatches: true,
  });

  const { sellNFT } = useMarket();

  const [myNFT, setMyNFT] = useState(null);
  const [myNFTCount, setMyNFTCount] = useState('0');
  const [sellAmount, setSellAmount] = useState('1');
  const [sellPrice, setSellPrice] = useState('0');
  const [totalPrice, setTotalPrice] = useState(0);
  const [sellStatus, setSellStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [minPriceCheck, setMinPriceCheck] = useState(false);

  let API_URL;

  // dapp route
  if (params.state === null) {
    API_URL = `${process.env.REACT_APP_API_SERVER}/admin-api/nft/detail/${id}`;
  } else {
    console.log('from talken app');
  }

  const { data, error, mutate } = useSWR(API_URL, () => nftDetail(id));
  const {
    data: myNftData,
    error: myNftError,
    mutate: myNftMutate,
  } = useSWR(`${API_URL}/user-serials?nft_id=${id}&owner_id=${account}`, () =>
    getUserNftSerialsData(id, account),
  );

  const sell = async () => {
    setSellStatus(true);
    // console.log(myNftData, myNftData.data.length, sellAmount);
    if (parseFloat(sellPrice) < 0.000001) {
      setMinPriceCheck(true);
      setSellStatus(false);
      return;
    }
    if (myNftData.data.length < sellAmount) {
      setErrorMessage('클수없다..');
      setSellStatus(false);
      return;
    }
    try {
      // 사용자 지갑을 사용 마켓에 readyToSell 실행
      const nftContract = getNftContract(
        library,
        myNftData.data[0].contract_address,
        data?.data?.collection_id?.contract_type,
      );
      const nftType = data?.data?.collection_id?.contract_type === 'KIP17' ? 721 : 1155;
      const payout =
        data?.data?.collection_id?.fee_payout ?? '0x0000000000000000000000000000000000000000';
      const rate = data?.data?.collection_id?.fee_percentage ?? 0;
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
      // console.log(sellSerials);
      const serialIds = sellSerials.map((serial: { _id: any }) => serial._id);
      // console.log(serialIds);
      // 사용자 판매 내역을 등록 api 호출 (sale collection 에 등록, serials 의 상태를 판매상태로 변경, nft 컬렉션에 user_selling_quantity 추가)
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
      // console.log(result);
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
    setTimeout(() => {
      myNftMutate().then((res) => {
        if (myNftData && myNftData?.data !== null) {
          setMyNFT(myNftData?.data);
          setMyNFTCount(myNftData?.data.length);
        } else {
          setMyNFT(null);
          setMyNFTCount('0');
        }
      });
    }, 2000);
  }, [myNftMutateHandler, myNftData?.data]);

  useEffect(() => {
    setTotalPrice(parseInt(sellAmount) * parseFloat(sellPrice));
  }, [sellAmount, sellPrice]);

  return (
    <>
      {myNFT !== null && (
        <SectionWrapper title={'Sell My NFT'} icon={'tag'}>
          <Box sx={{ pt: 2, px: 2 }}>
            <Typography variant={'subtitle2'} color={'primary'}>
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
                <Typography variant={'h1'}>{myNFTCount}</Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              py: 1,
              px: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'end',
              gap: '1rem',
            }}
          >
            {data?.data?.collection_id?.contract_type === 'KIP37' && (
              <Box sx={{ flex: 2 }}>
                <Typography variant={'subtitle2'} color={'primary'}>
                  Amount
                </Typography>

                <CustomTextField
                  id="amount"
                  name="amount"
                  variant="outlined"
                  type="number"
                  size="small"
                  value={sellAmount}
                  inputProps={{ min: 0, step: 1 }}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSellAmount(e.target.value)
                  }
                  onBlur={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSellAmount(parseInt(e.target.value).toString())
                  }
                  fullWidth
                />
              </Box>
            )}
            <Box sx={{ flex: 2 }}>
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
                fullWidth
              />
            </Box>
            <Box sx={{ flex: 1, width: smDown ? '50px' : '100px' }}>
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
      )}
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
    </>
  );
};

export default DetailSell;
