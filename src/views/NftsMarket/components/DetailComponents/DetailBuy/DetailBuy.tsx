import React, { useEffect, useState } from 'react';
import { Box, Button, Snackbar, Typography, useTheme } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import ethLogo from '../../../../../assets/images/network_icon/ethereum-eth-logo.png';
import klayLogo from '../../../../../assets/images/network_icon/klaytn-klay-logo.png';
import talkLogo from '../../../../../assets/images/logos/talken_icon.png';
import bnbLogo from '../../../../../assets/images/network_icon/binance-bnb-logo.png';
import { LoadingButton } from '@mui/lab';
import {
  cancelBuy,
  getUserNftSerialsData,
  rentalMetadata,
  selectSerials,
  setStopSelling,
} from '../../../../../services/nft.service';
import useActiveWeb3React from '../../../../../hooks/useActiveWeb3React';
import useMarket from '../../../../../hooks/useMarket';
import { useKipContract, useKipContractWithKaikas } from '../../../../../hooks/useContract';
import useSWR from 'swr';
import { nftDetail } from '../../../../../services/market.service';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useLocation } from 'react-router-dom';
import SellingClock from '../SellingClock';
import getNftPrice from '../../../../../utils/getNftPrice';
import { useSelector } from 'react-redux';
import { getChainId } from '../../../../../utils/commonUtils';
import sliceFloatNumber from '../../../../../utils/sliceFloatNumber';
import OfferDialog from '../../OfferDialog';
import { SUCCESS } from '../../../../../config';
import { getSellingSerial, setIpfsLink } from '../../../../../services/serials.service';
import WalletDialog from '../../../../../components/WalletDialog';

interface DetailBuyProps {
  id: string;
  setItemActivityMutateHandler: (b: boolean) => void;
  itemActivityMutateHandler: boolean;
}

interface WalletsTypes {
  wallets: {
    ethereum: {
      wallet: string;
      address: string;
    };
    klyatn: {
      wallet: string;
      address: string;
    };
    solana: {
      wallet: string;
      address: string;
    };
  };
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const TitleBox = ({
  title,
  deadline,
  checkSellingQuantity,
  checkListingQuantity,
}: string | any) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant={'h4'}>{title}</Typography>
      <SellingClock
        deadline={deadline}
        checkSellingQuantity={checkSellingQuantity}
        checkListingQuantity={checkListingQuantity}
      />
    </Box>
  );
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const DetailBuy: React.FC<DetailBuyProps> = ({
  id,
  setItemActivityMutateHandler,
  itemActivityMutateHandler,
}) => {
  const theme = useTheme();
  const { library, account, activate } = useActiveWeb3React();
  // @ts-ignore
  const { ethereum, klaytn, solana, binance } = useSelector<WalletsTypes>(
    (state: WalletsTypes) => state.wallets,
  );

  const [selectedNetworkId, setSelectedNetworkId] = useState(1);

  const [openOffer, setOpenOffer] = useState(false);

  const { buyNFT, sellNFT, listNFT, stopSelling } = useMarket();
  const params = useLocation();

  const smDown = useMediaQuery(theme.breakpoints.down('sm'), {
    defaultMatches: true,
  });

  const mdDown = useMediaQuery(theme.breakpoints.down('md'), {
    defaultMatches: true,
  });

  // dapp route
  let API_URL;
  if (params.state === null) {
    API_URL = `${process.env.REACT_APP_API_SERVER}/admin-api/nft/detail/${id}`;
  } else {
    console.log('from talken app');
  }
  const list_url = `${process.env.REACT_APP_API_SERVER}/admin-api/market/saleList/${id}?page=1&size=5`;

  const { data, error, mutate } = useSWR(API_URL, () => nftDetail(id));
  const { data: listingData, mutate: listingMutate } = useSWR(list_url, fetcher);
  const {
    data: myNftData,
    error: myNftError,
    mutate: myNftMutate,
  } = useSWR(`${API_URL}/user-serials?nft_id=${id}&owner_id=${account}`, () =>
    getUserNftSerialsData(id, account),
  );

  const contractAddress = data?.data?.collection_id?.contract_address;
  const nftContract = useKipContract(contractAddress, 'KIP17');
  const nftContractWithKaikas = useKipContractWithKaikas(contractAddress, 'KIP17');

  const [sellingQuantity, setSellingQuantity] = useState(0);
  const [buyFlag, setBuyFlag] = useState(false);
  const [amount, setAmount] = useState('1');
  const [days, setDays] = useState('1');
  const [isOpenConnectModal, setIsOpenConnectModal] = useState(false);
  const [krwMessage, setKrwMessage] = useState({
    open: false,
    vertical: 'top',
    horizontal: 'right',
  });
  const [seller, setSeller] = useState('');

  console.log('=====>', data);
  const { vertical, horizontal, open } = krwMessage;

  const getSeller = async () => {
    const tokenId = `0x${data.data.metadata.tokenId.toString(16)}`;
    const serial = await getSellingSerial(data.data._id, tokenId);
    console.log(serial);
    if (serial) setSeller(serial.data.seller);
  };

  const stop = async () => {
    setBuyFlag(true);
    try {
      const result = await stopSelling(
        data.data.collection_id.contract_address,
        parseInt(data.data.metadata.tokenId, 10),
        data.data.sell_amount,
        data.data.price,
        data.data.quote,
        getChainId(data.data.collection_id.network),
      );

      if (result === SUCCESS) {
        const res = await setStopSelling(data.data._id, false, account);

        if (res.data.status !== 1) {
          console.log('!!! stop selling ... failed');
        }
        console.log('!!! stop selling ... success');
      }
    } catch (err) {
      console.log('!! stop selling error : ', err);
    }
    setBuyFlag(false);
    await mutate();
  };

  const buy = async () => {
    // console.log(`days: ${days}`);
    console.log(`amount: ${amount}`);

    if (data?.data?.quote === 'krw') {
      // setKrwMessage({ ...krwMessage, open: true });
      window.open('https://forms.gle/oFfSPSnWYR1xVoxD6');
      return;
    }

    setBuyFlag(true);
    setSellingQuantity((curr: number) => curr - parseInt(amount));
    const isKaikas =
      library.connection.url !== 'metamask' && library.connection.url !== 'eip-1193:';
    // tokenId ??? ????????????.
    const serials = await selectSerials(id, account, amount);

    if (serials.status === 0) {
      setBuyFlag(false);
      return;
    }
    try {
      const price = data?.data?.price;
      const quote = data?.data?.quote;
      const quantity = data?.data?.sell_amount;
      const seller = serials.data[0].seller;
      const serialId = serials.data[0]._id;
      const ipfs_link = data?.data?.ipfs_link;
      // tokenId ??? ?????? ?????? ??????.
      // V3 : function buyToken(address _nft, uint256 _tokenId, uint256 _maximumPrice) external;
      // V4 : function buyToken(address _nft, uint256 _tokenId, address _seller, uint256 _quantity, uint256 _maximumPrice, address _quote) external;

      // const reqBody = {
      //   filename: data?.data?.filename,
      //   expires: days,
      //   vault_name: 'nfts',
      //   name: data?.data?.metadata.name,
      //   description: data?.data?.metadata.description,
      //   external_url: '',
      //   attributes: [],
      // };

      // const vault = await rentalMetadata(reqBody);
      // const ipfs_link = vault?.data?.data?.result.metaLink;
      // const image_link = vault?.data?.data?.result.metaData.image;z
      console.log('serial id : ', serialId);
      // console.log('new ipfs link : ', ipfs_link);
      // console.log('presigned url : ', image_link);

      const result = await buyNFT(
        isKaikas ? nftContractWithKaikas : nftContract,
        parseInt(serials.data[0].token_id, 16),
        seller,
        quantity,
        // TODO : KIP17 = 1, KIP37 = GUI?????? ?????? ?????? ????????? ?????? (????????? ????????? ?????? ???????????? ????????? ???.)
        // quantity_selling??? ????????? ????????? ???????????? ???????????? ????????? ??? ??????????????? quantity ??? ???
        // GUI?????? ???????????? amount + quantity_selling > quantity ?????? GUI??? ?????? ???????????? ??? ???...
        // TODO : Rental Duration
        amount,
        // days,
        price,
        quote,
        getChainId(data?.data?.collection_id?.network),
        ipfs_link,
      );

      if (result === SUCCESS) {
        // TODO : update serial ipfs_url
        // const resp = await setIpfsLink(serialId, ipfs_link, image_link);
        // if (!resp?.data?.status) {
        //   console.log('Error: update serial ipfs_link failed...');
        // } else {
        //   console.log('Notice: update serial ipfs_link success...');
        // }
      }
    } catch (e) {
      // ????????? ?????? ??????.
      console.log('=====>', serials.data, parseInt(serials.data[0].token_id, 16));
      await cancelBuy(id, serials.data[0].token_id, account);
      setSellingQuantity((curr: number) => curr + parseInt(amount));
    }
    await mutate();
    await myNftMutate();
    setItemActivityMutateHandler(true);
    setAmount('1');
    setBuyFlag(false);
  };

  const handleCloseModal = async () => {
    setIsOpenConnectModal(false);
  };

  const handleOpenOffer = () => {
    setOpenOffer(true);
  };

  const handleCloseOffer = () => {
    setOpenOffer(false);
  };

  useEffect(() => {
    if (account) getSeller();
  }, [data, account]);

  useEffect(() => {
    setSellingQuantity(data?.data?.quantity_selling);
    myNftMutate();
  }, [data?.data?.quantity_selling]);

  useEffect(() => {
    setTimeout(() => {
      mutate();
      listingMutate();
      myNftMutate();
    }, 2000);
  }, [itemActivityMutateHandler]);

  return (
    <Box sx={{ backgroundColor: '#F7FBFD', padding: '30px', borderRadius: '10px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            <Typography sx={{ fontSize: '16px', fontWeight: 400, lineHeight: '20px' }}>
              Current price
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Box>
                {data?.data?.quote === 'klay' && <img src={ethLogo} alt="klay" height="30px" />}
                {data?.data?.quote === 'talk' && <img src={talkLogo} alt="talk" height="30px" />}
                {data?.data?.quote === 'bnb' && <img src={bnbLogo} alt="bnb" height="30px" />}
              </Box>
              <Typography sx={{ fontSize: '24px', fontWeight: 500, lineHeight: '26px' }}>
                {sellingQuantity === 0 && !buyFlag
                  ? getNftPrice(
                      data?.data?.price,
                      data?.data?.floor_price,
                      data?.data?.user_quantity_selling,
                      data?.data?.quantity_selling,
                      data?.data?.last_price,
                    )
                  : sliceFloatNumber(data?.data?.price.toString())}{' '}
                {data?.data?.quote === 'klay'
                  ? 'Eth'
                  : data?.data?.quote.replace(/^[a-z]/, (char: string) => char.toUpperCase())}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            <Typography sx={{ fontSize: '16px', fontWeight: 400, lineHeight: '20px' }}>
              Selling Quantity
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <Typography sx={{ fontSize: '24px', fontWeight: 500, lineHeight: '26px' }}>
                {sellingQuantity}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
          {account !== undefined || data?.data?.quote === 'krw' ? (
            <Box sx={{ width: '100%' }}>
              {data?.data?.collection_id?.contract_type === 'KIP37' ? (
                <LoadingButton
                  sx={{ height: '54px', fontSize: '16px', fontWeight: 700, lineHeight: '24px' }}
                  onClick={account === seller ? stop : buy}
                  disabled={
                    sellingQuantity === 0 ||
                    sellingQuantity < parseInt(amount) ||
                    parseInt(amount) === 0 ||
                    isNaN(parseInt(amount))
                  }
                  loading={buyFlag}
                  variant="contained"
                  fullWidth
                >
                  {sellingQuantity === 0 ? 'Sold out' : account === seller ? 'Stop Selling' : 'Buy'}
                </LoadingButton>
              ) : (
                <LoadingButton
                  sx={{ height: '54px', fontSize: '16px', fontWeight: 700, lineHeight: '24px' }}
                  onClick={account === seller ? stop : buy}
                  disabled={sellingQuantity === 0}
                  loading={buyFlag}
                  variant="contained"
                  fullWidth
                >
                  {sellingQuantity === 0 ? 'Sold out' : account === seller ? 'Stop Selling' : 'Buy'}
                </LoadingButton>
              )}
            </Box>
          ) : (
            <Button
              sx={{ height: '54px', fontSize: '16px', fontWeight: 700, lineHeight: '24px' }}
              variant="contained"
              onClick={() => setIsOpenConnectModal(true)}
              fullWidth
            >
              Connect Wallet
            </Button>
          )}
          {/*<Button*/}
          {/*  sx={{ height: '54px', fontSize: '16px', fontWeight: 700, lineHeight: '24px' }}*/}
          {/*  fullWidth*/}
          {/*  variant="outlined"*/}
          {/*>*/}
          {/*  Offer*/}
          {/*</Button>*/}
        </Box>
      </Box>
      {/*<Box sx={{ maxWidth: mdDown ? '100%' : '100%' }}>*/}
      {/*  {data?.data?.collection_id?.contract_type === 'KIP17' && (*/}
      {/*    <Box*/}
      {/*      sx={{*/}
      {/*        pt: 2,*/}
      {/*        px: 2,*/}
      {/*      }}*/}
      {/*    >*/}
      {/*      <Box*/}
      {/*        sx={{*/}
      {/*          display: 'flex',*/}
      {/*          justifyContent: 'space-between',*/}
      {/*          alignItems: 'center',*/}
      {/*          marginBottom: 2,*/}
      {/*        }}*/}
      {/*      >*/}
      {/*        <Typography variant={'subtitle2'} color={'primary'} sx={{ flex: 1 }}>*/}
      {/*          Selling Quantity*/}
      {/*        </Typography>*/}
      {/*        <Box*/}
      {/*          display={'flex'}*/}
      {/*          justifyContent={'flex-start'}*/}
      {/*          alignItems={'center'}*/}
      {/*          gap={'0.5rem'}*/}
      {/*        >*/}
      {/*          <Typography variant={'h3'}>{sellingQuantity}</Typography>*/}
      {/*        </Box>*/}
      {/*      </Box>*/}
      {/*    </Box>*/}
      {/*  )}*/}

      {/*  <Box sx={{ py: 1, px: 2, mt: 1 }}>*/}
      {/*    <Box*/}
      {/*      sx={{*/}
      {/*        display: 'flex',*/}
      {/*        justifyContent: 'space-between',*/}
      {/*        alignItems: 'center',*/}
      {/*        marginBottom: 2,*/}
      {/*      }}*/}
      {/*    >*/}
      {/*      <Typography variant={'subtitle2'} color={'primary'}>*/}
      {/*        {sellingQuantity === 0 ? 'Current Price (per day)' : 'Price (per day)'}*/}
      {/*      </Typography>*/}
      {/*      <Box*/}
      {/*        display={'flex'}*/}
      {/*        justifyContent={'flex-start'}*/}
      {/*        alignItems={'center'}*/}
      {/*        gap={'0.5rem'}*/}
      {/*      >*/}
      {/*        {data?.data?.quote === 'klay' && <img src={klayLogo} alt="klay" height="18px" />}*/}
      {/*        {data?.data?.quote === 'talk' && <img src={talkLogo} alt="talk" height="18px" />}*/}
      {/*        {data?.data?.quote === 'bnb' && <img src={bnbLogo} alt="bnb" height="18px" />}*/}
      {/*        {data?.data?.quote === 'krw' && (*/}
      {/*          <Typography variant={'h3'} color={'text.primary'}>*/}
      {/*            ???*/}
      {/*          </Typography>*/}
      {/*        )}*/}
      {/*        <Typography variant={'h3'}>*/}
      {/*          {sellingQuantity === 0 && !buyFlag*/}
      {/*            ? getNftPrice(*/}
      {/*                data?.data?.price,*/}
      {/*                data?.data?.floor_price,*/}
      {/*                data?.data?.user_quantity_selling,*/}
      {/*                data?.data?.quantity_selling,*/}
      {/*                data?.data?.last_price,*/}
      {/*              )*/}
      {/*            : sliceFloatNumber(data?.data?.price.toString())}*/}
      {/*        </Typography>*/}
      {/*      </Box>*/}
      {/*    </Box>*/}

      {/*    <Box*/}
      {/*      sx={{*/}
      {/*        display: 'flex',*/}
      {/*        justifyContent: 'space-between',*/}
      {/*        alignItems: 'center',*/}
      {/*        marginBottom: 4,*/}
      {/*      }}*/}
      {/*    >*/}
      {/*      <Typography variant={'subtitle2'} color={'primary'}>*/}
      {/*        Rental Duration (in Days)*/}
      {/*      </Typography>*/}
      {/*      <CustomTextField*/}
      {/*        id="days"*/}
      {/*        name="days"*/}
      {/*        variant="outlined"*/}
      {/*        type="number"*/}
      {/*        size="small"*/}
      {/*        value={days}*/}
      {/*        inputProps={{ min: 1, step: 1 }}*/}
      {/*        sx={{ textAlign: 'right' }}*/}
      {/*        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {*/}
      {/*          const validated = e.target.value.match(/^(\s*|\d+)$/);*/}
      {/*          if (validated && parseInt(e.target.value) <= 0) {*/}
      {/*            setDays('1'); // Default Rental Duration at least*/}
      {/*          } else {*/}
      {/*            setDays(e.target.value);*/}
      {/*          }*/}
      {/*        }}*/}
      {/*        onBlur={(e: React.ChangeEvent<HTMLInputElement>) =>*/}
      {/*          parseInt(e.target.value) <= 0 ? '1' : setDays(e.target.value)*/}
      {/*        }*/}
      {/*      />*/}
      {/*    </Box>*/}

      {/*    {account !== undefined || data?.data?.quote === 'krw' ? (*/}
      {/*      <Box sx={{ display: 'flex', flex: 1, gap: 2 }}>*/}
      {/*        {data?.data?.collection_id?.contract_type === 'KIP37' ? (*/}
      {/*          <Box*/}
      {/*            sx={{*/}
      {/*              width: '100%',*/}
      {/*              display: 'flex',*/}
      {/*              justifyContent: 'flex-end',*/}
      {/*              alignItems: 'center',*/}
      {/*            }}*/}
      {/*          >*/}
      {/*            <LoadingButton*/}
      {/*              onClick={buy}*/}
      {/*              disabled={*/}
      {/*                sellingQuantity === 0 ||*/}
      {/*                sellingQuantity < parseInt(amount) ||*/}
      {/*                parseInt(amount) === 0 ||*/}
      {/*                isNaN(parseInt(amount))*/}
      {/*              }*/}
      {/*              loading={buyFlag}*/}
      {/*              variant="contained"*/}
      {/*              fullWidth*/}
      {/*              // sx={{ width: smDown ? '120px' : '190px' }}*/}
      {/*            >*/}
      {/*              {sellingQuantity === 0 ? 'Sold out' : 'Buy'}*/}
      {/*            </LoadingButton>*/}
      {/*          </Box>*/}
      {/*        ) : (*/}
      {/*          <Box*/}
      {/*            sx={{*/}
      {/*              width: '100%',*/}
      {/*              display: 'flex',*/}
      {/*              // justifyContent: 'center',*/}
      {/*              justifyContent: 'left',*/}
      {/*            }}*/}
      {/*          >*/}
      {/*            <LoadingButton*/}
      {/*              // fullWidth*/}
      {/*              onClick={buy}*/}
      {/*              disabled={sellingQuantity === 0}*/}
      {/*              loading={buyFlag}*/}
      {/*              variant="contained"*/}
      {/*              // sx={{ width: smDown ? '50px' : '120px', height: '40px', marginRight: 5 }}*/}
      {/*              // sx={{ width: smDown ? '50px' : '160px', height: '40px' }}*/}
      {/*              fullWidth*/}
      {/*            >*/}
      {/*              {sellingQuantity === 0 ? 'Sold out' : 'Buy'}*/}
      {/*            </LoadingButton>*/}
      {/*          </Box>*/}
      {/*        )}*/}
      {/*      </Box>*/}
      {/*    ) : (*/}
      {/*      <Button variant="contained" onClick={() => setIsOpenConnectModal(true)} fullWidth>*/}
      {/*        Connect Wallet*/}
      {/*      </Button>*/}
      {/*    )}*/}
      {/*  </Box>*/}
      {/*</Box>*/}
      <WalletDialog
        isOpenConnectModal={isOpenConnectModal}
        handleCloseModal={handleCloseModal}
        activate={activate}
      />

      <OfferDialog open={openOffer} handleCloseOffer={handleCloseOffer} nft={data?.data} />
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={open}
        onClose={() => setKrwMessage({ ...krwMessage, open: false })}
        // message="Payment in KRW is currently only possible through bank transfer. Please contact nftsales@taal.fi"
        key={vertical + horizontal}
      >
        <Alert severity="error">
          Payment in KRW is currently only possible through bank transfer. Please contact
          nftsales@taal.fi
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DetailBuy;
