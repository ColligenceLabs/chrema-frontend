import React, { ChangeEvent, useState } from 'react';
import MarketLayout from '../../layouts/market-layout/MarketLayout';
import { styled } from '@mui/material/styles';
import {
  Alert,
  Box,
  Button,
  CardContent,
  Container,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  MenuItem,
  Snackbar,
  Typography,
  useTheme,
} from '@mui/material';
import ImageSelector from '../../components/ImageSelector/ImageSelector';
import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import CustomTextarea from '../../components/forms/custom-elements/CustomTextarea';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Formik } from 'formik';
import {
  deployKIP17,
  deployKIP17WithKaikas,
  deployKIP37,
  deployKIP37WithKaikas,
} from '../../utils/deploy';
import { deployNFT17 } from '../../services/nft.service';
import { createCollection } from '../../services/collections.service';
import useUserInfo from '../../hooks/useUserInfo';
import { useWeb3React } from '@web3-react/core';
import WalletDialog from '../../components/WalletDialog';
import splitAddress from '../../utils/splitAddress';
import {
  Attribute,
  Creator,
  getAssetCostToStore,
  LAMPORT_MULTIPLIER,
  MAX_METADATA_LEN,
  useConnection,
  useConnectionConfig,
} from '@colligence/metaplex-common';
import { mintNFT } from '../../solana/actions/nft';
import { useWallet } from '@solana/wallet-adapter-react';
import { MintLayout } from '@solana/spl-token';
import { Uses } from '@metaplex-foundation/mpl-token-metadata';
import { LoadingButton } from '@mui/lab';
import { COLLECTION_CATEGORY } from '../Collection/catetories';
import { addMinter } from '../../utils/transactions';
import { targetNetwork } from '../../config';
import useMediaQuery from '@mui/material/useMediaQuery';

type metadataTypes = {
  name: string;
  symbol: string;
  description: string;
  image: string | undefined;
  animation_url: string | undefined;
  attributes: Attribute[] | undefined;
  external_url: string;
  properties: any;
  creators: Creator[] | null;
  sellerFeeBasisPoints: number;
  collection?: string;
  uses?: Uses;
};

interface FiledTitleProps {
  required?: boolean;
}
const MyCollectionContainer = styled(Container)`
  max-width: 646px !important;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 10rem;
`;

const TitleWrapper = styled(Typography)`
  font-size: 40px;
  font-weight: 600;
  letter-spacing: 0px;
  margin-top: 2rem;
`;

const FieldWrapper = styled(Box)`
  border: 1px solid #dfdfdf;
  border-radius: 10px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  //gap: 0.4rem;
`;

const FiledTitle = styled('label')<{ required?: boolean }>`
  margin-bottom: 20px;
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
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  color: #b9b8bb;
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
`;

const AddOptionalImage = styled('div')(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 600,
  color: theme.palette.primary.main,
  cursor: 'pointer',
}));

const OptionalImageWrapper = styled(Box)`
  display: flex;
  width: 100%;
`;

const CardContentWrapper = styled(CardContent)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NFT_TYPES = [
  { value: 'KIP17', title: 'ERC-721' },
  { value: 'KIP37', title: 'ERC-1155' },
];

type OptionalImageListTypes = {
  id: number;
  image: object | Blob | null;
  description: string;
};
const CreateNewCollection = () => {
  const { library, account, activate, chainId } = useWeb3React();
  const { level, id, full_name } = useUserInfo();
  const wallet = useWallet();
  const connection = useConnection();
  const { endpoint } = useConnectionConfig();
  const theme = useTheme();
  const smDown = useMediaQuery(theme.breakpoints.down('sm'), {
    defaultMatches: true,
  });
  const useKAS = process.env.REACT_APP_USE_KAS ?? 'false';
  // const { ethereum, klaytn, solana, binance } = useSelector((state) => state.wallets);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isOpenConnectModal, setIsOpenConnectModal] = useState(false);
  const [optionalImage, setOptionalImage] = useState(null);
  const [optionalImageID, setOptionalImageID] = useState(0);
  const [optionalImageDesc, setOptionalImageDesc] = useState('');
  const [optionalImageList, setOptionalImageList] = useState<OptionalImageListTypes[]>([]);
  const [selectedNetworkIndex, setSelectedNetworkIndex] = useState(0);
  const [cost, setCost] = useState(0);
  const [nftCreateProgress, setNFTcreateProgress] = useState(0);
  const [collection, setCollection] = useState<any>(undefined);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleCloseModal = async () => {
    setIsOpenConnectModal(false);
  };

  const handleAddOptionalList = (id: number, image: object, description: string) => {
    setOptionalImageList([...optionalImageList, { id: id, image, description }]);
  };

  const handleRemoveOptionalList = (id: number) => {
    const newList = optionalImageList.filter((item) => item.id !== id);
    console.log(newList);
    setOptionalImageList(newList);
  };

  const calCost = (files: any, metadata: metadataTypes) => {
    const rentCall = Promise.all([
      connection.getMinimumBalanceForRentExemption(MintLayout.span),
      connection.getMinimumBalanceForRentExemption(MAX_METADATA_LEN),
    ]);
    if (files.length)
      getAssetCostToStore([...files, new File([JSON.stringify(metadata)], 'metadata.json')]).then(
        async (lamports) => {
          const sol = lamports / LAMPORT_MULTIPLIER;

          // TODO: cache this and batch in one call
          const [mintRent, metadataRent] = await rentCall;

          // const uriStr = 'x';
          // let uriBuilder = '';
          // for (let i = 0; i < MAX_URI_LENGTH; i++) {
          //   uriBuilder += uriStr;
          // }

          const additionalSol = (metadataRent + mintRent) / LAMPORT_MULTIPLIER;

          // TODO: add fees based on number of transactions and signers
          setCost(sol + additionalSol);
        },
      );
  };

  const mintCollection = async (attributes: any) => {
    const fixedCreators = [
      {
        key: wallet.publicKey!.toBase58(),
        label: splitAddress(wallet.publicKey!.toBase58()),
        value: wallet.publicKey!.toBase58(),
      },
    ];
    // TODO : artCreate/index.tsx 1091 라인 참고하여 share 값 계산 등등 처리할 것
    const creatorStructs = [...fixedCreators].map(
      (c) =>
        new Creator({
          address: c.value,
          verified: c.value === wallet.publicKey?.toBase58(),
          share: 100, // TODO: UI에서 입력받게 할 것인지?
          // share:
          //   royalties.find(r => r.creatorKey === c.value)?.amount ||
          //   Math.round(100 / royalties.length),
        }),
    );

    const metadata: metadataTypes = {
      name: attributes.name,
      symbol: attributes.symbol,
      // creators: attributes.creators,
      creators: creatorStructs,
      // collection: attributes.collection,
      collection: '',
      description: attributes.description,
      // sellerFeeBasisPoints: attributes.seller_fee_basis_points,
      sellerFeeBasisPoints: 500,
      // image: attributes.image,
      image: attributes.image.name,
      // animation_url: attributes.animation_url,
      animation_url: undefined,
      // attributes: attributes.attributes,
      attributes: undefined,
      // external_url: attributes.external_url,
      external_url: '',
      properties: {
        // files: attributes.properties.files,
        files: [{ uri: attributes.image.name, type: attributes.image.type }],
        // category: attributes.properties?.category,
        category: 'image',
      },
    };

    const files = [];
    files.push(attributes.image);

    calCost(files, metadata);

    const ret: any = {};
    let newCollection;
    try {
      newCollection = await mintNFT(
        connection,
        wallet,
        endpoint.name,
        files,
        metadata,
        setNFTcreateProgress,
        attributes.maximum_supply,
      );

      if (newCollection) {
        setCollection(newCollection);
        ret.address = newCollection.metadataAccount;
      }
    } catch (e) {
      console.log('mintCollection error : ', e);
    } finally {
      console.log('mintCollection success : ', newCollection);
    }

    return ret;
  };

  return (
    <MarketLayout>
      <Formik
        initialValues={{
          logoImage: null,
          bannerImage: null,
          optionalImage: [],
          name: '',
          url: '',
          description: '',
          category: [],
          network: 'klaytn',
          contractAddress: undefined,
          type: '',
          symbol: '',
        }}
        onSubmit={async (values, { setSubmitting }) => {
          console.log('create collection');
          setSubmitting(true);

          if (account === undefined && useKAS === 'false') {
            setIsOpenConnectModal(true);
            return;
          }
          if (account === undefined && useKAS === 'true' && values.network !== 'klaytn') {
            setIsOpenConnectModal(true);
            return;
          }

          const formData: any = new FormData();
          formData.append('image', values.bannerImage);
          formData.append('logo', values.logoImage);
          formData.append('url', values.url);
          formData.append('description', values.description);
          formData.append('name', values.name);
          formData.append('symbol', values.symbol);
          formData.append('creator_id', id);
          formData.append('fee_payout', account);
          formData.append('fee_percentage', '2');
          formData.append('type', values.type);
          console.log(optionalImageList);
          // formData.append('optional_images', optionalImageList);
          optionalImageList.forEach((image) => formData.append('optional_images', image.image));
          formData.append('optional_image_list', JSON.stringify(optionalImageList));

          values['category'].forEach((category) => formData.append('category', category));
          // formData.append('logoImage', values.logoImage)
          // formData.append('url', values.url)

          const directory = '';

          // formData 에 contract_address 추가(test data 로 실행되도록 하드코딩)
          // const contractAddress = '0xda90e97c376c5d51c82d7346e39b4b79af82d7ff'; // kas api
          // const contractAddress = '0xE1C53Ab564de73C181DF56aa350677297B857662'; // metamask??

          let newContract;
          if (!values.contractAddress && values.contractAddress !== '') {
            if (useKAS === 'false') {
              // TODO: 스미트컨트랙 배포하고 새로운 스마트컨트랙 주소 획득
              let result;
              if (values.network === 'solana') {
                // TODO : Call Solana mint collection here ...
                // console.log('== create solana collection ==>', values);
                result = await mintCollection(values);
              } else {
                if (values.type === 'KIP17') {
                  if (
                    library.connection.url !== 'metamask' &&
                    library.connection.url !== 'eip-1193:'
                  ) {
                    result = await deployKIP17WithKaikas(
                      values.name,
                      values.symbol,
                      account,
                      library,
                    );
                  } else {
                    result = await deployKIP17(values.name, values.symbol, account, library);
                  }
                } else if (values.type === 'KIP37') {
                  if (
                    library.connection.url !== 'metamask' &&
                    library.connection.url !== 'eip-1193:'
                  ) {
                    result = await deployKIP37WithKaikas(directory, account, library);
                  } else {
                    result = await deployKIP37(
                      values.symbol, // TODO : ERC-1155 for Binance
                      values.name,
                      directory,
                      account,
                      library,
                    );
                    // result = await deployKIP37(values.name, account, library);
                  }
                }
              }
              newContract = result.address;
            } else {
              // TODO: KAS로 스마트컨트랙 배포
              const alias = `${values.symbol.toLowerCase()}-${Math.floor(Math.random() * 1000)}`;
              await deployNFT17({
                name: values.name,
                symbol: values.symbol,
                alias,
              }).then((res) => {
                newContract = res?.data.data.address;
              });
            }

            console.log('add market contract as a minter');
            await addMinter(
              newContract,
              values.type,
              account,
              library,
              chainId ?? parseInt(targetNetwork ?? '1001'), // TODO : check for multiple chains support
            );
          } else {
            newContract = values.contractAddress;
            formData.append('typed_contract', 'true');
          }

          if (!newContract) {
            setErrorMessage('contract deploy fail.');
            setOpenSnackbar(true);
            setSubmitting(false);
            return;
          }

          // console.log('newContract == ', newContract);
          formData.append('contract_address', newContract);
          formData.append('network', values.network);
          formData.append('contract_type', values.type);

          for (const pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
          }

          await createCollection(formData)
            .then((res) => {
              console.log(res);
              if (res.data.status === 1) {
                setErrorMessage(null);
                setOpenSnackbar(true);
              } else {
                setErrorMessage(res.data.message);
                setOpenSnackbar(true);
              }
            })
            .catch((error) => console.log(error));

          setSubmitting(false);
        }}
      >
        {({ values, handleSubmit, setFieldValue, handleChange, isSubmitting }) => (
          <form onSubmit={handleSubmit}>
            <MyCollectionContainer>
              <TitleWrapper>Create a Collection</TitleWrapper>

              <FieldWrapper>
                <FiledTitle required={true}>Logo image</FiledTitle>
                <FieldSubscription>
                  This image will also be used for navigation. 350 x 350 recommended.
                </FieldSubscription>
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <ImageSelector
                    image={values.logoImage}
                    handleImageSelect={(image: any) => setFieldValue('logoImage', image)}
                    width="250px"
                    height="250px"
                    viewerMode={false}
                  />
                </Box>
              </FieldWrapper>

              <FieldWrapper>
                <FiledTitle required={true}>Banner image</FiledTitle>
                <FieldSubscription>
                  This image will appear at the top of your collection page. Avoid including too
                  much text in this banner image, as the dimensions change on different devices.
                  1400 x 350 recommended.
                </FieldSubscription>
                <ImageSelector
                  image={values.bannerImage}
                  handleImageSelect={(image: any) => setFieldValue('bannerImage', image)}
                  width="100%"
                  height="200px"
                  viewerMode={false}
                />
              </FieldWrapper>

              {/*<FieldWrapper>*/}
              {/*  <FiledTitle>Optional Image</FiledTitle>*/}
              {/*  <FieldSubscription*/}
              {/*    onClick={() => {*/}
              {/*      console.log(values.optionalImage);*/}
              {/*    }}*/}
              {/*  >*/}
              {/*    This is the collection where your item will appear. /!*<AddOptionalImage*!/*/}
              {/*  </FieldSubscription>*/}
              {/*  <OptionalImageWrapper>*/}
              {/*    <ImageSelector*/}
              {/*      image={optionalImage}*/}
              {/*      handleImageSelect={(image: any) => setOptionalImage(image)}*/}
              {/*      width="200px"*/}
              {/*      height="200px"*/}
              {/*      viewerMode={false}*/}
              {/*    />*/}
              {/*    <Box*/}
              {/*      sx={{*/}
              {/*        flex: 1,*/}
              {/*        marginLeft: 2,*/}
              {/*        textAlign: 'right',*/}
              {/*        width: '100%',*/}
              {/*      }}*/}
              {/*    >*/}
              {/*      <CustomTextarea*/}
              {/*        name="description"*/}
              {/*        value={optionalImageDesc}*/}
              {/*        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>*/}
              {/*          setOptionalImageDesc(e.target.value)*/}
              {/*        }*/}
              {/*        maxRows={5}*/}
              {/*        minRows={5}*/}
              {/*      />*/}
              {/*      <Button*/}
              {/*        variant="contained"*/}
              {/*        disabled={optionalImage === null || optionalImageDesc === ''}*/}
              {/*        onClick={() => {*/}
              {/*          handleAddOptionalList(optionalImageID, optionalImage!, optionalImageDesc);*/}

              {/*          setOptionalImageID(optionalImageID + 1);*/}
              {/*          setOptionalImage(null);*/}
              {/*          setOptionalImageDesc('');*/}
              {/*        }}*/}
              {/*      >*/}
              {/*        Add*/}
              {/*      </Button>*/}
              {/*    </Box>*/}
              {/*  </OptionalImageWrapper>*/}
              {/*  <ImageList sx={{ width: '100%', maxHeight: 500 }}>*/}
              {/*    {optionalImageList.map((item) => (*/}
              {/*      <ImageListItem key={item.id} cols={smDown ? 2 : 1}>*/}
              {/*        <ImageSelector*/}
              {/*          image={item.image}*/}
              {/*          handleImageSelect={() => null}*/}
              {/*          width="100%"*/}
              {/*          // height="200px"*/}
              {/*          viewerMode={true}*/}
              {/*        />*/}
              {/*        <ImageListItemBar*/}
              {/*          title={*/}
              {/*            item.description?.length > 30*/}
              {/*              ? `${item.description.slice(0, 30)}...`*/}
              {/*              : item.description*/}
              {/*          }*/}
              {/*          subtitle={''}*/}
              {/*          actionIcon={*/}
              {/*            <IconButton*/}
              {/*              onClick={() => handleRemoveOptionalList(item.id)}*/}
              {/*              sx={{ color: 'rgba(255, 255, 255, 0.54)' }}*/}
              {/*            >*/}
              {/*              <HighlightOffIcon sx={{ color: 'white' }} />*/}
              {/*            </IconButton>*/}
              {/*          }*/}
              {/*        />*/}
              {/*      </ImageListItem>*/}
              {/*    ))}*/}
              {/*  </ImageList>*/}
              {/*</FieldWrapper>*/}

              <FieldWrapper>
                <FiledTitle required={true}>Name</FiledTitle>
                <CustomTextField
                  value={values.name}
                  name="name"
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  size="small"
                />
              </FieldWrapper>

              <FieldWrapper>
                <FiledTitle>Url</FiledTitle>
                <FieldSubscription>
                  Customize your URL on OpenSea. Must only contain lowercase letters, numbers, and
                  hyphens.
                </FieldSubscription>
                <CustomTextField
                  name="url"
                  value={values.url}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  size="small"
                />
              </FieldWrapper>
              <FieldWrapper>
                <FiledTitle>Description</FiledTitle>
                <FieldSubscription>Enter a description of your collection.</FieldSubscription>
                <CustomTextarea
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  maxRows={5}
                  minRows={5}
                />
              </FieldWrapper>
              <FieldWrapper>
                <FiledTitle>NFT Type</FiledTitle>
                <FieldSubscription>the type of NFT</FieldSubscription>
                <CustomTextField
                  select
                  id="type"
                  name="category"
                  SelectProps={{
                    multiple: false,
                    value: values.type,
                    onChange: (event: ChangeEvent<HTMLSelectElement>) => {
                      setFieldValue('type', event.target.value);
                    },
                  }}
                  disabled={isSubmitting}
                  fullWidth
                  size="small"
                >
                  {NFT_TYPES.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.title}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </FieldWrapper>
              <FieldWrapper>
                <FiledTitle>Category</FiledTitle>
                <FieldSubscription>category</FieldSubscription>
                <CustomTextField
                  select
                  id="category"
                  name="category"
                  SelectProps={{
                    multiple: true,
                    value: values.category,
                    onChange: (event: ChangeEvent<HTMLSelectElement>) => {
                      setFieldValue('category', event.target.value);
                    },
                  }}
                  disabled={isSubmitting}
                  fullWidth
                  size="small"
                >
                  {COLLECTION_CATEGORY.map((category) => (
                    <MenuItem key={category.value} value={category.value}>
                      {category.title}
                    </MenuItem>
                  ))}
                </CustomTextField>
              </FieldWrapper>
              {/*<FieldWrapper>*/}
              {/*  <FiledTitle>Symbol</FiledTitle>*/}
              {/*  <FieldSubscription>symbol</FieldSubscription>*/}
              {/*  <CustomTextField*/}
              {/*    name="symbol"*/}
              {/*    value={values.symbol}*/}
              {/*    onChange={handleChange}*/}
              {/*    variant="outlined"*/}
              {/*    fullWidth*/}
              {/*    size="small"*/}
              {/*  />*/}
              {/*</FieldWrapper>*/}
              {/*<FieldWrapper>*/}
              {/*  <RadioGroup*/}
              {/*    aria-label="gender"*/}
              {/*    defaultValue="radio1"*/}
              {/*    name="type"*/}
              {/*    value={values.type}*/}
              {/*    onChange={handleChange}*/}
              {/*  >*/}
              {/*    <Grid container>*/}
              {/*      <Grid item lg={6} sm={6} xs={6}>*/}
              {/*        <FormControlLabel*/}
              {/*          value="KIP17"*/}
              {/*          control={<CustomRadio bgcolor="" />}*/}
              {/*          label="KIP17"*/}
              {/*        />*/}
              {/*      </Grid>*/}
              {/*      <Grid item lg={6} sm={6} xs={6}>*/}
              {/*        <FormControlLabel*/}
              {/*          value="KIP37"*/}
              {/*          control={<CustomRadio bgcolor="" />}*/}
              {/*          label="KIP37"*/}
              {/*        />*/}
              {/*      </Grid>*/}
              {/*    </Grid>*/}
              {/*  </RadioGroup>*/}
              {/*</FieldWrapper>*/}

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
            </MyCollectionContainer>
          </form>
        )}
      </Formik>
      <WalletDialog
        isOpenConnectModal={isOpenConnectModal}
        handleCloseModal={handleCloseModal}
        activate={activate}
      />
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

export default CreateNewCollection;
