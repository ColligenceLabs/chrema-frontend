import React, { useState, useEffect } from 'react';
import {
  Grid,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Button,
  Paper,
  Divider,
  Typography,
  Box,
  Alert,
  FormHelperText,
  Snackbar,
  CardMedia,
} from '@mui/material';
import { Formik } from 'formik';
import { styled } from '@mui/material/styles';
import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import CustomSelect from '../../components/forms/custom-elements/CustomSelect';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import CustomRadio from '../../components/forms/custom-elements/CustomRadio';
import DriveFileMoveOutlinedIcon from '@mui/icons-material/DriveFileMoveOutlined';
import { useTranslation } from 'react-i18next';
import { createCollection } from '../../services/collections.service';
import { LoadingButton } from '@mui/lab';
import {
  deployKIP17,
  deployKIP17WithKaikas,
  deployKIP37,
  deployKIP37WithKaikas,
} from '../../utils/deploy';
import { useWeb3React } from '@web3-react/core';
import collectionCreateSchema from '../../config/schema/collectionCreateSchema';
import useCreator from '../../hooks/useCreator';
import { deployNFT17 } from '../../services/nft.service';
import useUserInfo from '../../hooks/useUserInfo';
import NETWORKS from '../../components/NetworkSelector/networks';
import { useSelector } from 'react-redux';
import { injected, kaikas, walletconnect } from '../../connectors';
import splitAddress from '../../utils/splitAddress';
import {
  MAX_METADATA_LEN,
  useConnection,
  getAssetCostToStore,
  Creator,
  LAMPORT_MULTIPLIER,
  useConnectionConfig,
} from '@colligence/metaplex-common';
import { mintNFT } from '../../solana/actions/nft';
import { useWallet } from '@solana/wallet-adapter-react';
import { MintLayout } from '@solana/spl-token';
import CustomTextarea from '../../components/forms/custom-elements/CustomTextarea';
import { COLLECTION_CATEGORY } from './catetories';
import { setupNetwork } from '../../utils/wallet';
import { bnbTargetNetwork, targetNetwork, targetNetworkMsg } from '../../config';
import WalletConnectorDialog from '../../components/WalletConnectorDialog';

const Container = styled(Paper)(() => ({
  padding: '20px',
  borderRadius: '7px',
}));

const WarningBox = styled(Box)(({ theme }) => ({
  padding: '20px',
  borderRadius: '7px',
  border: '1px',
  borderStyle: 'solid',
  borderColor: theme.palette.error.main,
  color: theme.palette.error.main,
  margin: '20px 0px',
}));

const CollectionCreate = () => {
  const { library, account, activate, chainId } = useWeb3React();
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState();
  const [successRegister, setSuccessRegister] = useState(false);
  const [isOpenConnectModal, setIsOpenConnectModal] = useState(false);
  const [selectedNetworkIndex, setSelectedNetworkIndex] = useState(0);
  const creatorList = useCreator();
  const { level, id, full_name } = useUserInfo();
  const useKAS = process.env.REACT_APP_USE_KAS ?? 'false';
  const { ethereum, klaytn, solana, binance } = useSelector((state) => state.wallets);

  const wallet = useWallet();
  const connection = useConnection();
  const { endpoint } = useConnectionConfig();
  // Solana Transaction Progress Callback
  const [nftCreateProgress, setNFTcreateProgress] = useState(0);
  const [cost, setCost] = useState(0);
  const [collection, setCollection] = useState(undefined);

  const handleCloseModal = async () => {
    setIsOpenConnectModal(false);
  };

  const activateNetwork = async (name, setFieldValue) => {
    console.log('??');
    if (name === 'ethereum') {
      if (!ethereum.wallet && !ethereum.address) {
        alert('지갑연결 필요');
        return;
      }
      if (ethereum.wallet === 'metamask') {
        await activate(injected, null, true);
      } else if (ethereum.wallet === 'walletConnector') {
        const wc = walletconnect(true);
        await activate(wc, undefined, true);
      }
    } else if (name === 'klaytn') {
      if (!klaytn.wallet && !klaytn.address) {
        setSelectedNetworkIndex(1);
        setIsOpenConnectModal(true);
        return;
      }
      const network = parseInt(targetNetwork);
      if (klaytn.wallet === 'metamask') {
        if (chainId !== network) await setupNetwork(network);
        await activate(injected, null, true);
      } else if (klaytn.wallet === 'walletConnector') {
        const wc = walletconnect(true);
        await activate(wc, undefined, true);
      } else if (klaytn.wallet === 'kaikas') {
        if (chainId !== network) {
          alert(targetNetworkMsg);
          return;
        }
        await activate(kaikas, null, true);
      }
    } else if (name === 'binance') {
      if (!binance.wallet && !binance.address) {
        setSelectedNetworkIndex(3);
        setIsOpenConnectModal(true);
        return;
      }
      if (binance.wallet === 'metamask') {
        const network = parseInt(bnbTargetNetwork);
        if (chainId !== network) await setupNetwork(network);
        await activate(injected, null, true);
      } else if (binance.wallet === 'walletConnector') {
        const wc = walletconnect(true);
        await activate(wc, undefined, true);
      }
    } else if (name === 'solana') {
      if (!solana.wallet && !solana.address) {
        alert('지갑연결 필요');
        return;
      }
    } else {
      return;
    }
    setFieldValue('network', name);
    console.log('지갑연결 완료');
  };

  const calCost = (files, metadata) => {
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

  const mintCollection = async (attributes) => {
    const fixedCreators = [
      {
        key: wallet.publicKey.toBase58(),
        label: splitAddress(wallet.publicKey.toBase58()),
        value: wallet.publicKey.toBase58(),
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

    const metadata = {
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
      nimation_url: undefined,
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

    const ret = {};
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
    <PageContainer title="Collection Create" description="this is Collection Create Form page">
      <Breadcrumb title="Collection Create" subtitle="Collection Create Information" />
      <Container>
        <Formik
          validationSchema={collectionCreateSchema}
          initialValues={{
            name: '',
            network: '',
            creator_id: level.toLowerCase() === 'creator' ? id : '',
            image: null,
            category: [],
            contract_address: '',
            type: 'KIP17',
            tokenUri: '',
            symbol: '',
            maximum_supply: '',
            description: '',
            contractAddress: undefined,
            fee_percentage: '',
            fee_payout: '',
          }}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);

            if (account === undefined && useKAS === 'false') {
              setIsOpenConnectModal(true);
              return;
            }
            if (account === undefined && useKAS === 'true' && values.network !== 'klaytn') {
              setIsOpenConnectModal(true);
              return;
            }

            let formData = new FormData();
            // console.log(values.network);

            for (let value in values) {
              if (['name', 'creator_id', 'image', 'symbol'].includes(value)) {
                formData.append(value, values[value]);
              } else if (['category'].includes(value)) {
                values[value].forEach((category) => formData.append(value, category));
              } else if (['fee_percentage'].includes(value)) {
                if (values[value] === '') {
                  formData.append(value, '0');
                } else {
                  formData.append(value, (parseFloat(values[value]) * 10).toString());
                }
              } else if (['fee_payout'].includes(value)) {
                if (values[value] === '') {
                  formData.append(value, '0x0000000000000000000000000000000000000000');
                } else {
                  formData.append(value, values[value]);
                }
              }
            }
            formData.append('description', values.description);
            let directory = '';
            if (values.maximum_supply !== '') {
              formData.append('maximum_supply', values.maximum_supply);
              formData.append('contract_type', 'SPLToken');
            } else {
              formData.append('contract_type', values.type);
              if (values.type === 'KIP37') {
                directory = values.tokenUri + '-' + Math.random().toString(36).substring(7);
                formData.append('directory', directory);
              }
            }

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
                  newContract = res.data.data.address;
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

            for (var pair of formData.entries()) {
              console.log(pair[0] + ', ' + pair[1]);
            }

            await createCollection(formData)
              .then((res) => {
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
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item lg={6} md={12} sm={12} xs={12}>
                  <CustomFormLabel htmlFor="network">{t('Network')}</CustomFormLabel>
                  <CustomSelect
                    labelId="demo-simple-select-label"
                    id="network"
                    name="network"
                    value={values.network}
                    disabled={isSubmitting}
                    onChange={async (event) => {
                      if (useKAS === 'false')
                        await activateNetwork(event.target.value, setFieldValue);
                      else setFieldValue('network', event.target.value);
                    }}
                    fullWidth
                    size="small"
                  >
                    {(process.env.REACT_APP_USE_SOLANA === 'true'
                      ? NETWORKS
                      : NETWORKS.filter(
                          (item) => item.label !== 'Solana' && item.label !== 'Ethereum',
                        )
                    ).map((network) => (
                      <MenuItem key={network.id} value={network.value}>
                        {network.label}
                      </MenuItem>
                    ))}
                  </CustomSelect>
                  {touched.network && errors.network && (
                    <FormHelperText htmlFor="render-select" error>
                      {errors.network}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item lg={6} md={12} sm={12} xs={12}>
                  <CustomFormLabel htmlFor="name">
                    {t('Name (Smart Contract Name)')}
                  </CustomFormLabel>
                  <CustomTextField
                    id="name"
                    name="name"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={values.name}
                    disabled={isSubmitting}
                    onChange={handleChange}
                  />
                  {touched.name && errors.name && (
                    <FormHelperText htmlFor="render-select" error>
                      {errors.name}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item lg={6} md={12} sm={12} xs={12}>
                  <CustomFormLabel htmlFor="creator">{t('Creator')}</CustomFormLabel>
                  <CustomSelect
                    labelId="demo-simple-select-label"
                    id="creator"
                    name="creator"
                    value={values.creator_id}
                    disabled={isSubmitting}
                    onChange={(event) => {
                      setFieldValue('creator_id', event.target.value);
                    }}
                    fullWidth
                    size="small"
                  >
                    {level.toLowerCase() === 'creator' ? (
                      <MenuItem key={id} value={id}>
                        {full_name}
                      </MenuItem>
                    ) : (
                      creatorList &&
                      creatorList.map((creator) => (
                        <MenuItem key={creator._id} value={creator._id}>
                          {creator.full_name}
                        </MenuItem>
                      ))
                    )}
                  </CustomSelect>
                  {touched.creator_id && errors.creator_id && (
                    <FormHelperText htmlFor="render-select" error>
                      {errors.creator_id}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item lg={6} md={12} sm={12} xs={12}>
                  <CustomFormLabel htmlFor="category">{t('Category')}</CustomFormLabel>
                  <CustomTextField
                    select
                    id="category"
                    name="category"
                    SelectProps={{
                      multiple: true,
                      value: values.category,
                      onChange: (event) => {
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
                  {touched.category && errors.category && (
                    <FormHelperText htmlFor="render-select" error>
                      {errors.category}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item lg={6} md={12} sm={12} xs={12}>
                  <CustomFormLabel htmlFor="image">{t('Image')}</CustomFormLabel>
                  <CustomTextField
                    id="imageFiled"
                    name="imageFiled"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={values.image == null ? '' : values.image.name}
                    InputProps={{
                      startAdornment: (
                        <Button
                          component="label"
                          variant="contained"
                          size="small"
                          disabled={isSubmitting}
                          style={{ marginRight: '1rem' }}
                        >
                          <DriveFileMoveOutlinedIcon fontSize="small" />
                          <input
                            id="image"
                            style={{ display: 'none' }}
                            type="file"
                            accept="image/jpg, image/png, image/jpeg"
                            name="image"
                            onChange={(event) => {
                              setFieldValue('image', event.currentTarget.files[0]);
                            }}
                          />
                        </Button>
                      ),
                    }}
                  />
                  {touched.image && errors.image && (
                    <FormHelperText htmlFor="render-select" error>
                      {errors.image}
                    </FormHelperText>
                  )}
                  {values.image !== null && (
                    <CardMedia
                      component="img"
                      sx={{ width: 250, mt: 3 }}
                      image={URL.createObjectURL(values.image)}
                      alt="Live from space album cover"
                    />
                  )}
                </Grid>
                <Grid item lg={6} md={12} sm={12} xs={12}>
                  <CustomFormLabel htmlFor="description">{t('Description')}</CustomFormLabel>
                  <CustomTextarea
                    id="description"
                    name="description"
                    maxRows={5}
                    minRows={5}
                    // variant="outlined"
                    // fullWidth
                    // size="small"
                    disabled={isSubmitting}
                    value={values.description}
                    onChange={handleChange}
                  />
                  {touched.description && errors.description && (
                    <FormHelperText htmlFor="render-select" error>
                      {errors.description}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Divider
                    sx={{
                      mt: 5,
                      mb: 3,
                    }}
                  />
                  <Typography color="primary" variant="subtitle2">
                    {t('Creator Earnings')}
                  </Typography>
                </Grid>
                <Grid item lg={6} md={12} sm={12} xs={12}>
                  <CustomFormLabel htmlFor="symbol">{t('Percentage fee')}</CustomFormLabel>
                  <CustomTextField
                    id="fee_percentage"
                    name="fee_percentage"
                    variant="outlined"
                    type="number"
                    fullWidth
                    size="small"
                    placeholder="Must be greater than 0 percent. Default value '0'. e.g. 2.5"
                    disabled={isSubmitting}
                    value={values.fee_percentage}
                    onChange={handleChange}
                    error={touched.fee_percentage && Boolean(errors.fee_percentage)}
                    helperText={touched.fee_percentage && errors.fee_percentage}
                  />
                </Grid>
                <Grid item lg={6} md={12} sm={12} xs={12}>
                  <CustomFormLabel htmlFor="symbol">{t('Payout wallet address')}</CustomFormLabel>
                  <CustomTextField
                    id="fee_payout"
                    name="fee_payout"
                    variant="outlined"
                    fullWidth
                    size="small"
                    placeholder="Please enter on address. e.g. 0x623C7....."
                    disabled={
                      isSubmitting ||
                      values.fee_percentage === 0 ||
                      values.fee_percentage.toString() === ''
                    }
                    value={
                      values.fee_percentage === 0 || values.fee_percentage.toString() === ''
                        ? ''
                        : values.fee_payout
                    }
                    onChange={handleChange}
                    error={touched.fee_payout && Boolean(errors.fee_payout)}
                    helperText={touched.fee_payout && errors.fee_payout}
                  />
                </Grid>

                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Divider
                    sx={{
                      mt: 5,
                      mb: 3,
                    }}
                  />
                  <Typography color="primary" variant="subtitle2">
                    {t('Smart Contract Information')}
                  </Typography>
                </Grid>
                {values.network !== 'solana' ? (
                  <>
                    <Grid item lg={6} md={12} sm={12} xs={12}>
                      <CustomFormLabel>{t('Type')}</CustomFormLabel>
                      <RadioGroup
                        aria-label="gender"
                        defaultValue="radio1"
                        name="type"
                        value={values.type}
                        onChange={isSubmitting ? null : handleChange}
                      >
                        <Grid container>
                          <Grid item lg={6} sm={6} xs={6}>
                            <FormControlLabel
                              value="KIP17"
                              control={<CustomRadio />}
                              label="KIP17"
                            />
                          </Grid>
                          <Grid item lg={6} sm={6} xs={6}>
                            <FormControlLabel
                              value="KIP37"
                              control={<CustomRadio />}
                              label="KIP37"
                            />
                          </Grid>
                        </Grid>
                      </RadioGroup>
                    </Grid>

                    {(values.type === 'KIP17' || values.network === 'binance') && (
                      <Grid item lg={6} md={12} sm={12} xs={12}>
                        <CustomFormLabel htmlFor="symbol">{t('Symbol')}</CustomFormLabel>
                        <CustomTextField
                          id="symbol"
                          name="symbol"
                          variant="outlined"
                          fullWidth
                          size="small"
                          disabled={isSubmitting}
                          value={values.symbol}
                          onChange={handleChange}
                          error={touched.symbol && Boolean(errors.symbol)}
                          helperText={touched.symbol && errors.symbol}
                        />
                      </Grid>
                    )}

                    {values.type === 'KIP37' && (
                      <Grid item lg={6} md={12} sm={12} xs={12}>
                        <CustomFormLabel htmlFor="tokenUri">
                          {t('IPFS Directory Name')}
                        </CustomFormLabel>
                        <CustomTextField
                          id="tokenUri"
                          name="tokenUri"
                          variant="outlined"
                          fullWidth
                          size="small"
                          disabled={isSubmitting}
                          value={values.tokenUri}
                          onChange={handleChange}
                          error={touched.tokenUri && Boolean(errors.tokenUri)}
                          helperText={touched.tokenUri && errors.tokenUri}
                        />
                      </Grid>
                    )}

                    <Grid item lg={6} md={12} sm={12} xs={12}>
                      <CustomFormLabel htmlFor="contractAddress">
                        {t('Contract Address')}
                      </CustomFormLabel>
                      <CustomTextField
                        id="contractAddress"
                        name="contractAddress"
                        variant="outlined"
                        fullWidth
                        size="small"
                        disabled={isSubmitting}
                        value={values.contractAddress}
                        onChange={handleChange}
                        error={touched.contractAddress && Boolean(errors.contractAddress)}
                        helperText={touched.contractAddress && errors.contractAddress}
                      />
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item lg={6} md={12} sm={12} xs={12}>
                      <CustomFormLabel htmlFor="symbol">{t('Symbol')}</CustomFormLabel>
                      <CustomTextField
                        id="symbol"
                        name="symbol"
                        variant="outlined"
                        fullWidth
                        size="small"
                        disabled={isSubmitting}
                        value={values.symbol}
                        onChange={handleChange}
                        error={touched.symbol && Boolean(errors.symbol)}
                        helperText={touched.symbol && errors.symbol}
                      />
                    </Grid>

                    <Grid item lg={6} md={12} sm={12} xs={12}>
                      <CustomFormLabel htmlFor="maximum_supply">
                        {t('Maximum supply')}
                      </CustomFormLabel>
                      <CustomTextField
                        id="maximum_supply"
                        name="maximum_supply"
                        variant="outlined"
                        fullWidth
                        size="small"
                        disabled={isSubmitting}
                        value={values.maximum_supply}
                        onChange={handleChange}
                        error={touched.maximum_supply && Boolean(errors.maximum_supply)}
                        helperText={touched.maximum_supply && errors.maximum_supply}
                      />
                    </Grid>
                  </>
                )}

                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <WarningBox>
                    <Typography color="error" variant="subtitle2">
                      {t(
                        'Note: In the middle of creating a collection it is included deploying one NFT smart contract on to the blockchain which requires a small gas fee.',
                      )}
                    </Typography>
                  </WarningBox>
                </Grid>

                <Snackbar
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  open={successRegister}
                  autoHideDuration={2000}
                  onClose={() => {
                    setSuccessRegister(false);
                    resetForm();
                  }}
                >
                  <Alert
                    onClose={() => {
                      setSuccessRegister(false);
                      resetForm();
                    }}
                    variant="filled"
                    severity="success"
                    sx={{ width: '100%' }}
                  >
                    Success in Collection create!
                  </Alert>
                </Snackbar>

                {errorMessage && (
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Alert
                      sx={{
                        mt: 2,
                        mb: 2,
                      }}
                      variant="filled"
                      severity="error"
                    >
                      {errorMessage}
                    </Alert>
                  </Grid>
                )}
                <Grid item lg={12} md={12} sm={12} xs={12} textAlign="right" gap="1rem">
                  <LoadingButton type="submit" loading={isSubmitting} variant="contained">
                    {t('Confirm')}
                  </LoadingButton>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
        {/*<WalletDialog*/}
        {/*  isOpenConnectModal={isOpenConnectModal}*/}
        {/*  handleCloseModal={handleCloseModal}*/}
        {/*  activate={activate}*/}
        {/*/>*/}
        <WalletConnectorDialog
          selectedNetworkIndex={selectedNetworkIndex}
          isOpenConnectModal={isOpenConnectModal}
          handleCloseModal={handleCloseModal}
          activate={activate}
          ethereum={ethereum}
          klaytn={klaytn}
          solana={solana}
          binance={binance}
        />
      </Container>
    </PageContainer>
  );
};

export default CollectionCreate;
