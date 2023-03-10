import React, { useState, useEffect } from 'react';
import MarketLayout from '../../layouts/market-layout/MarketLayout';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  MenuItem,
  Select,
  Snackbar,
  Typography,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ImageSelector from '../../components/ImageSelector/ImageSelector';
import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import CustomTextarea from '../../components/forms/custom-elements/CustomTextarea';
import CustomSelect from '../../components/forms/custom-elements/CustomSelect';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import { getCollectionsByCreatorId } from '../../services/collections.service';
import useActiveWeb3React from '../../hooks/useActiveWeb3React';
import useUserInfo from '../../hooks/useUserInfo';
import {
  cancelCreateNft,
  registerNFT,
  // batchRegisterNFT,
  // cancelCreateNfts,
  // registerRentalNFT,
  // registerSolanaNFT,
  // setNftOnchain,
} from '../../services/nft.service';
import { FAILURE, SUCCESS } from '../../config/constants/consts';
import { getChainId } from '../../utils/commonUtils';
// import { targetNetworkMsg } from '../../config';
import { setupNetwork } from '../../utils/wallet';
import { useKipContract, useKipContractWithKaikas } from '../../hooks/useContract';
import useNFT from '../../hooks/useNFT';
import contracts from '../../config/constants/contracts';
import { LoadingButton } from '@mui/lab';
import { getTokenURI } from '../../utils/transactions';
import { useSelector } from 'react-redux';
import useMediaQuery from '@mui/material/useMediaQuery';

const CreateNewItemContainer = styled(Container)`
  max-width: 646px !important;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 10rem;
`;

const ImportImageWrapper = styled(Box)`
  display: flex;
  align-items: flex-end;
  .ImportImageFiled {
    &:not(:last-child) {
      margin-right: 15px;
    }
  }
`;
const TitleWrapper = styled(Typography)`
  font-size: ${(props) => (props.smDown ? '32px' : '40px')};
  font-weight: 600;
  letter-spacing: 0px;
  margin-top: 2rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const FieldWrapper = styled(Box)`
  border: 1px solid #dfdfdf;
  border-radius: 10px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  //gap: 0.4rem;
`;

const FiledTitleWrapper = styled('div')`
  display: flex;
  flex-direction: ${(props) => (props.smDown ? 'column' : 'rows')};
  justify-content: ${(props) => (props.smDown ? 'center' : 'space-between')};
  align-items: ${(props) => (props.smDown ? 'flex-start' : 'center')};
  gap: 1rem;
  //margin-bottom: 20px;
  margin-bottom: 15px;
`;

const FiledTitle = styled('label')`
  color: #706c83;
  font-weight: 700;
  font-size: 24px;
  line-height: 24px;
  ${({ required }) =>
    required === true &&
    `
    &:after {
    content: " *";
    color: #3749E9
    }
  `}
`;

const FieldSubscription = styled('span')`
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  color: #b9b8bb;
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
`;

const CreateCollection = styled('div')(({ theme }) => ({
  minWidth: '100px',
  fontSize: '14px',
  fontWeight: 600,
  color: theme.palette.primary.main,
  cursor: 'pointer',
}));

const CCheckbox = styled(Checkbox)(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 600,
  color: theme.palette.primary.main,
  padding: '0 5px 0 0',
}));

const StyledMenuItem = styled(MenuItem)`
  padding: 10px;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid rgb(229, 232, 235);
  &:last-child {
    border-bottom: none;
  }
`;

const QUOTE_TOKEN = [{ value: 'klay', caption: 'ETH' }];

const CreateNewItem = () => {
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'), {
    defaultMatches: true,
  });

  const navigate = useNavigate();
  const { id } = useUserInfo();
  const { account, library, chainId } = useActiveWeb3React();

  const { ethereum, klaytn, solana, binance } = useSelector((state) => state.wallets);

  const [collectionList, setCollectionList] = useState([]);
  const [isOpenConnectModal, setIsOpenConnectModal] = useState(false);
  const [targetNetwork, setTargetNetwork] = useState('klaytn');
  const [contractAddr, setContractAddr] = useState(contracts.kip17[1]);
  const [contractType, setContractType] = useState('');
  const kipContract = useKipContract(contractAddr, contractType);
  const kasContract = useKipContractWithKaikas(contractAddr, contractType);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  // const [useImport, setUseImport] = useState('select');
  const [useImport, setUseImport] = useState(false);
  const [isImport, setIsImport] = useState(false);
  const [isBatchMint, setIsBatchMint] = useState(false);

  const {
    mintNFT17,
    mintNFT17WithKaikas,
    mintNFT37,
    mintNFT37WithKaikas,
    isMinting,
    mintNFTBatch,
  } = useNFT(kipContract, kasContract, account);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const moveToPage = () => {
    navigate('/market/mycollection');
  };

  const getCollectionList = async () => {
    await getCollectionsByCreatorId(id)
      .then(({ data }) => {
        setCollectionList(data.filter((row) => row.status === 'active'));
      })
      .catch((error) => console.log(error));
  };

  const getImageFromURL = async (contract, tokenId) => {
    console.log(`contract : ${contract}`);
    console.log(`tokenId : ${tokenId}`);
    console.log('get image url,,,,,,,');

    // TODO : ????????? ?????? ????????? ?????? ??????
    let meta_link = await getTokenURI(
      contract,
      parseInt(tokenId, 10),
      'KIP17', // ERC1155??? ?
      account,
      library,
      parseInt(chainId, 10),
    );
    if (meta_link === '') return undefined;
    let encodeData = [];
    if (meta_link.startsWith('ipfs://')) {
      meta_link = meta_link.replace('ipfs://', 'https://taalfi.infura-ipfs.io/ipfs/');
    } else if (meta_link.startsWith('data:application/json')) {
      encodeData = meta_link.split(',');
    }

    let imageUrl;
    if (encodeData.length !== 0) {
      const metadata = JSON.parse(
        Buffer.from(encodeData[encodeData.length - 1], 'base64').toString(),
      );
      imageUrl = metadata.image.replace('ipfs://', 'https://taalfi.infura-ipfs.io/ipfs/');
    } else {
      await fetch(meta_link.replace('https://ipfs.io', 'https://taalfi.infura-ipfs.io'))
        .then((res) => res.json())
        .then((out) => (imageUrl = out.image))
        .catch((err) => {
          throw err;
        });
    }

    imageUrl.replace('https://ipfs.io', 'https://taalfi.infura-ipfs.io');
    console.log(`image url : ${imageUrl}`);

    const response = await fetch(imageUrl);
    const data = await response.blob();
    const ext = imageUrl.split('.').pop();
    const filename = imageUrl.split('/').pop();
    const metadata = { type: `image/${ext}`, path: filename };

    return new File([data], filename, metadata);
  };

  useEffect(() => {
    getCollectionList();
  }, []);

  return (
    <MarketLayout>
      <Formik
        initialValues={{
          url: '',
          tokenID: '',
          name: '',
          description: '',
          collection: '',
          nftItem: null,
          albumJacket: null,
          contract_type: '',
          // category: categories[0].value,
          price: '',
          type: '0',
          quote: 'klay',
          externalURL: '',
        }}
        onSubmit={async (values, actions) => {
          console.log('Mint start!');
          console.log({ values });
          if (account === undefined) {
            setIsOpenConnectModal(true);
            return;
          }

          let formData = new FormData();
          for (let value in values) {
            if (
              [
                'name',
                'price',
                'contract_type',
                'auto',
                'type',
                'description',
                'quote',
                'batch',
              ].includes(value)
            ) {
              formData.append(value, values[value]);
            }
          }

          formData.append('album_jacket', values['albumJacket']);
          formData.append('quantity', values['quantity']);
          if (values['contract_type'] === 'KIP17' && values['quantity'] > 1) {
            formData.append('batch', values['quantity']);
          }
          formData.append('collection_id', values['collection']);
          formData.append('file', values['nftItem']);
          // formData.append('quote', 'klay');
          if (values['thumbnail'] === null) {
            formData.append('thumbnail', values['nftItem']);
          } else {
            formData.append('thumbnail', values['thumbnail']);
          }

          formData.append('category', values['category']);
          formData.append('external_url', values['externalURL']);

          let result = SUCCESS;
          // console.log(ethereum, klaytn, solana, binance);
          // TODO : ?????? ??????????????? ???????????? ???????????? ??? ????????? ?????????....!!!!
          // if (
          //   (targetNetwork === 'binance' && binance.address === undefined) ||
          //   (targetNetwork === 'klaytn' && klaytn.address === undefined) ||
          //   (targetNetwork === 'ethereum' && ethereum.address === undefined)
          // ) {
          //   // todo ???????????? ?????? targetNetowrk ?????? ????????? ?????? ??????.
          //   console.log('????????? ???????????????.');
          // }
          const targetChainId = getChainId(targetNetwork);
          if (chainId !== targetChainId) {
            if (targetNetwork === 'klaytn' && klaytn.wallet === 'kaikas') {
              // setErrorMessage(targetNetworkMsg);
              // setSuccessRegister(false);
            } else await setupNetwork(targetChainId);
          }
          // check minter
          const isKaikas =
            library.connection.url !== 'metamask' && library.connection.url !== 'eip-1193:';

          let test;
          if (!isKaikas) test = await kipContract.isMinter(account);
          else test = await kasContract.methods.isMinter(account).call();
          if (!test) {
            setErrorMessage(account + ' is not a Minter');
            setSuccessRegister(false);
            return;
          }

          if (isBatchMint) {
            console.log(`batch count :  ${values.batch}`);
            for (var pair of formData.entries()) {
              console.log(pair[0] + ', ' + pair[1]);
            }
          }

          await registerNFT(formData)
            // await registerRentalNFT(formData)
            .then(async (res) => {
              console.log(res);
              if (res.data.status === 1) {
                let nftId, tokenId, tokenUri, quantity;
                if (!isBatchMint) {
                  nftId = res.data.data._id;
                  tokenId = res.data.data.metadata.tokenId;
                  tokenUri = res.data.data.ipfs_link;
                  quantity = res.data.data.quantity;
                }

                // Actual NFT Minting here
                if (contractType === 'KIP17') {
                  if (isBatchMint) {
                    // TODO : Batch mint is ok but sell & buy gets failed. Need to Check later....
                    console.log('=== start batch mint ===');
                    const data = res.data.data;
                    result = await mintNFTBatch(
                      data.tokenIds,
                      data.tokenUris,
                      data.quantities,
                      data.nftIds,
                      contractType,
                      isKaikas,
                    );
                  } else {
                    if (isKaikas) {
                      result = await mintNFT17WithKaikas(tokenId, tokenUri, nftId);
                    } else {
                      result = await mintNFT17(tokenId, tokenUri, nftId);
                    }
                  }
                } else {
                  if (isKaikas) {
                    result = await mintNFT37WithKaikas(tokenId, quantity, tokenUri, nftId);
                  } else {
                    result = await mintNFT37(tokenId, quantity, tokenUri, nftId);
                  }
                }
                if (result === FAILURE) {
                  // delete nft and serials
                  await cancelCreateNft(nftId);

                  setErrorMessage('Transaction failed or cancelled.');
                  setOpenSnackbar(true);
                } else {
                  setOpenSnackbar(true);
                }
              }
            })
            .catch((error) => {
              console.log(error);
              setErrorMessage('Failed NFT mint.');
              setOpenSnackbar(true);
            });
          // setSubmitting(false);
        }}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          errors,
          setFieldValue,
          resetForm,
        }) => (
          <form onSubmit={handleSubmit}>
            <CreateNewItemContainer>
              <TitleWrapper smDown={smDown}>Create New Item</TitleWrapper>
              <FieldWrapper>
                <FiledTitleWrapper smDown={smDown}>
                  <FiledTitle required={true}>Image, Video, Audio</FiledTitle>
                  {/*<FormControlLabel*/}
                  {/*  value={useImport}*/}
                  {/*  onChange={() => setUseImport((cur) => !cur)}*/}
                  {/*  control={<CCheckbox size="small" />}*/}
                  {/*  label="Import Image"*/}
                  {/*/>*/}
                </FiledTitleWrapper>
                <FieldSubscription variant="h6">
                  File type supported: JPG, PNG, GIF, MP4, WAV. Max size: 100 MB
                </FieldSubscription>
                <ImageSelector
                  image={values.nftItem}
                  handleImageSelect={(image) => {
                    console.log(image);
                    setFieldValue('nftItem', image);
                  }}
                  width="100%"
                  height="350px"
                  borderRadius="10px"
                />
              </FieldWrapper>

              {values.nftItem && values.nftItem.type === 'audio/wav' && (
                <FieldWrapper>
                  <FiledTitleWrapper>
                    <FiledTitle required={true}>Album Jacket</FiledTitle>
                  </FiledTitleWrapper>
                  <FieldSubscription variant="h6">
                    File type supported: JPG, PNG, GIF
                  </FieldSubscription>
                  <ImageSelector
                    image={values.albumJacket}
                    handleImageSelect={(image) => {
                      console.log(image);
                      setFieldValue('albumJacket', image);
                    }}
                    width="250px"
                    height="250px"
                  />
                </FieldWrapper>
              )}
              {useImport && (
                <FieldWrapper>
                  <ImportImageWrapper>
                    <Box className="ImportImageFiled" sx={{ flex: 2 }}>
                      <FiledTitleWrapper>
                        <FiledTitle>Contract Address</FiledTitle>
                      </FiledTitleWrapper>
                      <FieldSubscription>
                        Input the contract address of NFT imported
                      </FieldSubscription>
                      <CustomTextField
                        name="contract"
                        value={values.contract}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        size="small"
                      />
                    </Box>
                    <Box className="ImportImageFiled" sx={{ flex: 1 }}>
                      <FiledTitleWrapper>
                        <FiledTitle>Token ID</FiledTitle>
                      </FiledTitleWrapper>
                      <FieldSubscription>Input the token ID imported</FieldSubscription>
                      <CustomTextField
                        name="tokenId"
                        value={values.tokenId}
                        onChange={handleChange}
                        variant="outlined"
                        fullWidth
                        size="small"
                      />
                    </Box>
                    <Box>
                      <LoadingButton
                        loading={isImport}
                        disabled={isImport}
                        variant={'contained'}
                        onClick={async () => {
                          setIsImport(true);
                          const result = await getImageFromURL(values.contract, values.tokenId);
                          if (result) setFieldValue('nftItem', result);
                          setIsImport(false);
                        }}
                      >
                        Import
                      </LoadingButton>
                    </Box>
                  </ImportImageWrapper>
                </FieldWrapper>
              )}

              <FieldWrapper>
                <FiledTitleWrapper>
                  <FiledTitle>Collection</FiledTitle>
                </FiledTitleWrapper>
                <FieldSubscription variant="h6">
                  This is the collection where your item will appear.
                  <CreateCollection sx={{ flex: 1 }} onClick={moveToPage}>
                    My Collection
                  </CreateCollection>
                </FieldSubscription>
                <CustomSelect
                  name="collection"
                  value={values.collection}
                  onChange={(event) => {
                    collectionList
                      .filter((collection) => collection._id === event.target.value)
                      .map((collection) => {
                        setFieldValue('collection', event.target.value);
                        setFieldValue('category', collection.category.toString());
                        // setFieldValue('amount', '1');
                        setFieldValue(
                          'quantity',
                          collection.contract_type === 'KIP37' ? '1000' : '1',
                        );
                        setFieldValue('contract_type', collection.contract_type);
                        setContractAddr(collection.contract_address);
                        setContractType(collection.contract_type);
                      });
                  }}
                  fullWidth
                  size="small"
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      minWidth: '250px',
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                      mt: 2.2,
                      '& .MuiMenu-list': {
                        p: 0,
                      },
                    },
                  }}
                >
                  {collectionList.map((collection) => (
                    <StyledMenuItem key={collection._id} value={collection._id}>
                      {collection.name}
                    </StyledMenuItem>
                  ))}
                </CustomSelect>
              </FieldWrapper>

              <FieldWrapper>
                <FiledTitleWrapper>
                  <FiledTitle required={true}>Title</FiledTitle>
                </FiledTitleWrapper>
                <CustomTextField
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  size="small"
                />
              </FieldWrapper>

              <FieldWrapper>
                <FiledTitleWrapper>
                  <FiledTitle>Description</FiledTitle>
                </FiledTitleWrapper>
                <FieldSubscription variant="h6">
                  The description will be included on the item&apos;s detail page underneath its
                  image.
                </FieldSubscription>
                <CustomTextarea
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  maxRows={5}
                  minRows={5}
                />
              </FieldWrapper>

              {contractType === 'KIP37' ? (
                <FieldWrapper>
                  <FiledTitleWrapper>
                    <FiledTitle>Supply</FiledTitle>
                  </FiledTitleWrapper>
                  <CustomTextField
                    name="quantity"
                    value={values.quantity}
                    onChange={(event) => {
                      setFieldValue('quantity', event.target.value);
                      if (contractType === 'KIP17' && event.target.value > 1) {
                        setIsBatchMint(true);
                      } else {
                        setIsBatchMint(false);
                      }
                    }}
                    variant="outlined"
                    fullWidth
                    size="small"
                  />
                </FieldWrapper>
              ) : (
                ''
              )}

              <FieldWrapper>
                <FiledTitleWrapper>
                  <FiledTitle>External URL</FiledTitle>
                </FiledTitleWrapper>
                <CustomTextField
                  name="externalURL"
                  value={values.externalURL}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  size="small"
                />
              </FieldWrapper>

              {/*<FieldWrapper>*/}
              {/*  <FiledTitle>Category</FiledTitle>*/}
              {/*  <FieldSubscription variant="h6">*/}
              {/*    Select a category which your collection is included.*/}
              {/*  </FieldSubscription>*/}
              {/*  <CustomTextField*/}
              {/*    name="category"*/}
              {/*    value={values.category}*/}
              {/*    onChange={handleChange}*/}
              {/*    variant="outlined"*/}
              {/*    fullWidth*/}
              {/*    size="small"*/}
              {/*  />*/}
              {/*</FieldWrapper>*/}

              <FieldWrapper>
                <FiledTitleWrapper>
                  <FiledTitle>Price</FiledTitle>
                </FiledTitleWrapper>
                <FieldSubscription variant="h6">Price for rental per a day.</FieldSubscription>
                <Box sx={{ display: 'flex' }}>
                  <Select
                    sx={{
                      minWidth: 90,
                      borderColor: 'rgba(255, 255, 255, 0.12)',
                      opacity: '1',
                      marginRight: '10px',
                      backgroundColor: '#F7FBFD',
                    }}
                    value={values.quote}
                    size="small"
                    onChange={(event) => {
                      setFieldValue('quote', event.target.value);
                    }}
                  >
                    {QUOTE_TOKEN.map((item, index) => (
                      <MenuItem key={index} value={item.value}>
                        {item.caption}
                      </MenuItem>
                    ))}
                  </Select>
                  <CustomTextField
                    name="price"
                    type="number"
                    value={values.price}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                    size="small"
                  />
                </Box>
              </FieldWrapper>

              {/*<FieldWrapper>*/}
              {account ? (
                <LoadingButton
                  sx={{ height: '54px', fontSize: '18px', fontWeight: 700, lineHeight: '24px' }}
                  type="submit"
                  loading={isSubmitting}
                  variant="contained"
                >
                  Create
                </LoadingButton>
              ) : (
                <Button
                  sx={{ height: '54px', fontSize: '18px', fontWeight: 700, lineHeight: '24px' }}
                  variant="contained"
                  onClick={() => setIsOpenConnectModal(true)}
                >
                  Connect Wallet
                </Button>
              )}
              {/*</FieldWrapper>*/}
            </CreateNewItemContainer>
          </form>
        )}
      </Formik>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        {errorMessage ? (
          <Alert
            onClose={handleCloseSnackbar}
            variant="filled"
            severity="error"
            sx={{ width: '100%' }}
          >
            Failed create collection.
          </Alert>
        ) : (
          <Alert
            onClose={handleCloseSnackbar}
            variant="filled"
            severity="success"
            sx={{ width: '100%' }}
          >
            Success create collection.
          </Alert>
        )}
      </Snackbar>
    </MarketLayout>
  );
};

export default CreateNewItem;
