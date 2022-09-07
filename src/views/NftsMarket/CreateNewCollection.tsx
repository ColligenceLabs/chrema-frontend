import React, { ChangeEvent, useState } from 'react';
import MarketLayout from '../../layouts/market-layout/MarketLayout';
import { styled } from '@mui/material/styles';
import {
  Box,
  Button,
  Container,
  FormControlLabel,
  Grid,
  MenuItem,
  RadioGroup,
  Typography,
} from '@mui/material';
import ImageSelector from '../../components/ImageSelector/ImageSelector';
import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import CustomTextarea from '../../components/forms/custom-elements/CustomTextarea';
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
import { useSelector } from 'react-redux';
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
import CustomRadio from '../../components/forms/custom-elements/CustomRadio';
import { MintLayout } from '@solana/spl-token';
import { Uses } from '@metaplex-foundation/mpl-token-metadata';
import { LoadingButton } from '@mui/lab';
import { COLLECTION_CATEGORY } from '../Collection/catetories';

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
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const FiledTitle = styled('label')<{ required?: boolean }>`
  color: rgb(53, 56, 64);
  font-weight: 600;
  font-size: 16px;
  ${({ required }) =>
    required === true &&
    `
    &:after {
    content: " *";
    color: rgb(235, 87, 87)
    }
  `}
`;

const FieldSubscription = styled('span')`
  display: flex;
  justify-content: space-between;
  color: rgb(112, 122, 131);
  font-size: 12px;
  font-weight: 500;
`;

const CreateNewCollection = () => {
  const { library, account, activate, chainId } = useWeb3React();
  const { level, id, full_name } = useUserInfo();
  const wallet = useWallet();
  const connection = useConnection();
  const { endpoint } = useConnectionConfig();
  const useKAS = process.env.REACT_APP_USE_KAS ?? 'false';
  // const { ethereum, klaytn, solana, binance } = useSelector((state) => state.wallets);
  const [errorMessage, setErrorMessage] = useState<string | null>('');
  const [successRegister, setSuccessRegister] = useState(false);
  const [isOpenConnectModal, setIsOpenConnectModal] = useState(false);
  const [selectedNetworkIndex, setSelectedNetworkIndex] = useState(0);
  const [cost, setCost] = useState(0);
  const [nftCreateProgress, setNFTcreateProgress] = useState(0);
  const [collection, setCollection] = useState<any>(undefined);

  const handleCloseModal = async () => {
    setIsOpenConnectModal(false);
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
          name: '',
          url: '',
          description: '',
          category: [],
          network: 'ethereum',
          contractAddress: undefined,
          type: 'KIP17',
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
          formData.append('description', values.description);
          formData.append('name', values.name);
          formData.append('symbol', values.symbol);
          formData.append('creator_id', id);
          // values['category'].forEach((category) => formData.append('category', category));
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
          } else {
            newContract = values.contractAddress;
            formData.append('typed_contract', 'true');
          }

          if (!newContract) {
            setErrorMessage('contract deploy fail.');
            setSuccessRegister(false);
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
                setSuccessRegister(true);
              } else {
                setErrorMessage(res.data.message);
                setSuccessRegister(false);
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
                <ImageSelector
                  image={values.logoImage}
                  handleImageSelect={(image: any) => setFieldValue('logoImage', image)}
                  width="160px"
                  height="160px"
                />
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
                  width="600px"
                  height="200px"
                />
              </FieldWrapper>

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
                <FieldSubscription>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Debitis, necessitatibus?
                </FieldSubscription>
                <CustomTextarea
                  name="description"
                  value={values.description}
                  onChange={handleChange}
                  maxRows={5}
                  minRows={5}
                />
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
              <FieldWrapper>
                <FiledTitle>Symbol</FiledTitle>
                <FieldSubscription>symbol</FieldSubscription>
                <CustomTextField
                  name="symbol"
                  value={values.symbol}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  size="small"
                />
              </FieldWrapper>
              <FieldWrapper>
                <RadioGroup
                  aria-label="gender"
                  defaultValue="radio1"
                  name="type"
                  value={values.type}
                  onChange={handleChange}
                >
                  <Grid container>
                    <Grid item lg={6} sm={6} xs={6}>
                      <FormControlLabel
                        value="KIP17"
                        control={<CustomRadio bgcolor="" />}
                        label="KIP17"
                      />
                    </Grid>
                    <Grid item lg={6} sm={6} xs={6}>
                      <FormControlLabel
                        value="KIP37"
                        control={<CustomRadio bgcolor="" />}
                        label="KIP37"
                      />
                    </Grid>
                  </Grid>
                </RadioGroup>
              </FieldWrapper>
              <FieldWrapper>
                {account ? (
                  <LoadingButton type="submit" loading={isSubmitting} variant="contained">
                    Create
                  </LoadingButton>
                ) : (
                  <Button variant="contained" onClick={() => setIsOpenConnectModal(true)}>
                    Connect Wallet
                  </Button>
                )}
              </FieldWrapper>
            </MyCollectionContainer>
          </form>
        )}
      </Formik>
      <WalletDialog
        isOpenConnectModal={isOpenConnectModal}
        handleCloseModal={handleCloseModal}
        activate={activate}
      />
    </MarketLayout>
  );
};

export default CreateNewCollection;
