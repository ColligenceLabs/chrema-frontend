import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import {
  Grid,
  MenuItem,
  Button,
  Paper,
  FormHelperText,
  Snackbar,
  Alert,
  Backdrop,
  CircularProgress,
  Box,
  Select,
  FormControlLabel,
  Typography,
  Checkbox,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import CustomSelect from '../../components/forms/custom-elements/CustomSelect';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import DriveFileMoveOutlinedIcon from '@mui/icons-material/DriveFileMoveOutlined';
import { useWeb3React } from '@web3-react/core';
import { useKipContract, useKipContractWithKaikas } from '../../hooks/useContract';
import useNFT from '../../hooks/useNFT';
import { useTranslation } from 'react-i18next';
import { getCollectionsByCreatorId } from '../../services/collections.service';
import contracts from '../../config/constants/contracts';
import { LoadingButton } from '@mui/lab';
import useCreator from '../../hooks/useCreator';
import nftRegisterSchema from '../../config/schema/nftMintSchema';
import {
  registerNFT,
  batchRegisterNFT,
  registerSolanaNFT,
  setNftOnchain,
  cancelCreateNft,
  cancelCreateNfts,
} from '../../services/nft.service';
import { useSelector } from 'react-redux';
import useUserInfo from '../../hooks/useUserInfo';
import WalletDialog from '../../components/WalletDialog';
import { FAILURE, SUCCESS } from '../../config/constants/consts';
import { mintEditionsToWallet } from '../../solana/actions/mintEditionsIntoWallet';
import { useArt } from '../../solana/hooks';
import { useConnection, useUserAccounts, useMeta } from '@colligence/metaplex-common';
import { useWallet } from '@solana/wallet-adapter-react';
import { setSerialsActive } from '../../services/serials.service';
import { useItems } from '../../solana/hooks/useItems';
import { ArtworkViewState } from '../../solana/hooks/types';
import CustomTextarea from '../../components/forms/custom-elements/CustomTextarea';
import { getChainId } from '../../utils/commonUtils';
import { targetNetworkMsg } from '../../config';
import { setupNetwork } from '../../utils/wallet';

const Container = styled(Paper)(({ theme }) => ({
  padding: '20px',
  borderRadius: '7px',
}));

const QUOTE_TOKEN = [
  {
    value: 'klaytn',
    types: [
      { value: 'talk', caption: 'TALK' },
      { value: 'klay', caption: 'KLAY' },
    ],
  },
  {
    value: 'ethereum',
    types: [
      { value: 'talk', caption: 'TALK' },
      { value: 'eth', caption: 'ETH' },
    ],
  },
  { value: 'solana', types: ['SOL'] },
  {
    value: 'binance',
    types: [
      { value: 'bnb', caption: 'BNB' },
      { value: 'krw', caption: 'KRW' },
    ],
  },
];

const NFTMint = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  // TODO : change for mainnet 1001 -> 8217
  const [contractAddr, setContractAddr] = useState(contracts.kip17[1001]);
  const [contractType, setContractType] = useState('');
  const { account, activate, library, chainId } = useWeb3React();
  const kipContract = useKipContract(contractAddr, contractType);
  const kasContract = useKipContractWithKaikas(contractAddr, contractType);
  const {
    mintNFT17,
    mintNFT17WithKaikas,
    mintNFT37,
    mintNFT37WithKaikas,
    isMinting,
    mintNFTBatch,
  } = useNFT(kipContract, kasContract, account);
  const [collectionList, setCollectionList] = useState([]);
  const [errorMessage, setErrorMessage] = useState();
  const [successRegister, setSuccessRegister] = useState(false);
  const [isOpenConnectModal, setIsOpenConnectModal] = useState(false);
  const [targetNetwork, setTargetNetwork] = useState('klaytn');
  const [curCount, setCurCount] = useState(0);
  const [beforeCount, setBeforeCount] = useState(0);
  const [mintAmount, setMintAmount] = useState(0);
  const [nftId, setNftId] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [priceTypes, setPriceTypes] = useState([]);

  const [isBatchMint, setIsBatch] = useState(false);

  const creatorList = useCreator();
  const { level, id, full_name } = useUserInfo();
  const useKAS = process.env.REACT_APP_USE_KAS ?? 'false';

  /*
   Source Codes for Solana
   */
  let connection, wallet, userAccounts, accountByMint, art;
  let isLoading, update, pullUserMetadata, artMintTokenAccount;
  let userItems, walletPubKey;
  const { ethereum, klaytn, solana, binance } = useSelector((state) => state.wallets);
  if (process.env.REACT_APP_USE_SOLANA === 'true') {
    connection = useConnection();
    wallet = useWallet();
    let accounts = useUserAccounts();
    userAccounts = accounts.userAccounts;
    accountByMint = accounts.accountByMint;
    let metaData = useMeta();
    isLoading = metaData.isLoading;
    update = metaData.update;
    pullUserMetadata = metaData.pullUserMetadata;
    // console.log('1=====>', accountByMint, contractAddr);
    art = useArt(contractAddr);
    // console.log('2=====>', art);
    artMintTokenAccount = accountByMint.get(art.mint);
    // console.log('3=====>', artMintTokenAccount);
    userItems = useItems({ activeKey: ArtworkViewState.Owned, pubKey: contractAddr });
    walletPubKey = wallet?.publicKey?.toString() || '';
    // const art = useArt('2mhU4vYxrtjP8bnUnjUcpWWyUnCqd5VzGg6w6ZqX7c9A');
    // const artMintTokenAccount = accountByMint.get(art.mint);
  }

  const handleCloseModal = async () => {
    setIsOpenConnectModal(false);
  };

  const getCollectionList = async (id) => {
    await getCollectionsByCreatorId(id)
      .then(({ data }) => {
        console.log(data);
        setCollectionList(data.filter((row) => row.status === 'active'));
      })
      .catch((error) => console.log(error));
  };

  if (process.env.REACT_APP_USE_SOLANA === 'true') {
    useEffect(() => {
      if (targetNetwork === 'solana') {
        if (isLoading) {
          setOpenBackdrop(true);
          // console.log('show loader.');
        } else {
          setOpenBackdrop(false);
          // console.log('hide loader.');
        }
      } else {
        setOpenBackdrop(false);
        // console.log('hide loader.');
      }
    }, [isLoading, targetNetwork]);
  }

  useEffect(() => {
    if (level.toLowerCase() === 'creator') {
      getCollectionList(id);
    }
  }, [level]);

  if (process.env.REACT_APP_USE_SOLANA === 'true') {
    useEffect(async () => {
      // Refresh meta include the collection just created
      update();
      await pullUserMetadata({ userTokenAccount: userAccounts });
    }, [collectionList]);

    useEffect(async () => {
      // console.log('-- userItems ->', userItems);
      setCurCount(userItems.length);
      // TODO: Let serials status status from inactive to active & set contract_address
      if (mintAmount > 0 && curCount === beforeCount + mintAmount) {
        const newItems = userItems.filter(
          (item) =>
            parseInt(item.edition.info.edition.words[0], 10) > userItems.length - mintAmount,
        );
        await setSerialsActive(
          nftId,
          tokenId,
          mintAmount,
          newItems.map((item) => item.metadata.pubkey),
        );
        setBeforeCount(curCount);
        setErrorMessage(null);
        setSuccessRegister(true);
      }
    }, [userItems, isLoading]);
  }

  useEffect(() => {
    console.log(`targetNetwork : ${targetNetwork}`);
    QUOTE_TOKEN.filter((item) => (item.value === targetNetwork ? setPriceTypes(item.types) : null));
  }, [targetNetwork]);

  const mintEdition = async (id, amount) => {
    const editions = amount;
    const editionNumber = undefined;

    // console.log('--->', art, artMintTokenAccount);
    try {
      await mintEditionsToWallet(
        art,
        wallet,
        connection,
        artMintTokenAccount,
        editions,
        walletPubKey,
        editionNumber,
      );
    } catch (e) {
      console.error(e);
      return FAILURE;
    } finally {
      console.log('Success...');
    }
    return SUCCESS;
  };

  return (
    <PageContainer title="NFT Mint" description="this is NFT Mint Form page">
      <Breadcrumb title="NFT Mint" subtitle="NFT Mint Information" />
      <Container>
        <Formik
          validationSchema={nftRegisterSchema}
          enableReinitialize
          initialValues={{
            name: '',
            creator_id: level.toLowerCase() === 'creator' ? id : '',
            category: '',
            collection: '',
            content: null,
            amount: '',
            thumbnail: null,
            externalURL: '',
            description: '',
            price: '',
            quote: '',
            contract_type: '',
            auto: 'false',
            type: '0',
            batch: '',
          }}
          onSubmit={async (values, { setSubmitting }) => {
            if (account === undefined) {
              setIsOpenConnectModal(true);
              return;
            }
            setSubmitting(true);
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
            formData.append('quantity', values['amount']);
            setMintAmount(values['amount']);
            formData.append('collection_id', values['collection']);
            formData.append('file', values['content']);
            if (values['thumbnail'] === null) {
              formData.append('thumbnail', values['content']);
            } else {
              formData.append('thumbnail', values['thumbnail']);
            }

            formData.append('category', values['category']);
            formData.append('external_url', values['externalURL']);

            if (useKAS === 'true') {
              await batchRegisterNFT(formData)
                .then(async (res) => {
                  if (res.data.status === 1) {
                    setErrorMessage(null);
                    setSuccessRegister(true);
                  } else {
                    setErrorMessage(res.data.message);
                    setSuccessRegister(false);
                  }
                })
                .catch((error) => console.log(error));
            } else {
              let result = SUCCESS;
              if (targetNetwork === 'solana') {
                if (art.maxSupply < art.supply + values['amount']) {
                  setErrorMessage(
                    'maximum supply exceed. maximum supply is ' +
                      art.maxSupply +
                      ' and current supply is ' +
                      art.supply,
                  );
                  setSuccessRegister(false);
                  setSubmitting(false);
                  return;
                }
                await registerSolanaNFT(formData)
                  .then(async (res) => {
                    if (res.data.status === 1) {
                      const nftId = res.data.data._id;
                      const tokenId = res.data.data.metadata.tokenId;
                      const quantity = res.data.data.quantity;
                      setNftId(nftId);
                      setTokenId(tokenId);

                      // TODO : Call Solana mintEdition here...
                      setBeforeCount(curCount);
                      result = await mintEdition(contractAddr, quantity);
                      if (result === FAILURE) {
                        // delete nft and serials
                        await cancelCreateNft(nftId);
                        setErrorMessage('Transaction failed or cancelled.');
                        setSuccessRegister(false);
                      } else {
                        await setNftOnchain(nftId);
                      }
                      // Move to useEffect to get pubkeys minted newly
                      // setErrorMessage(null);
                      // setSuccessRegister(true);
                    } else {
                      setErrorMessage(res.data.message);
                      setSuccessRegister(false);
                    }
                  })
                  .catch((error) => console.log(error));
              } else {
                console.log(ethereum, klaytn, solana, binance);
                if (
                  (targetNetwork === 'binance' && binance.address === undefined) ||
                  (targetNetwork === 'klaytn' && klaytn.address === undefined) ||
                  (targetNetwork === 'ethereum' && ethereum.address === undefined)
                ) {
                  // todo 지갑연결 창을 targetNetowrk 선택 상태로 띄워 준다.
                  console.log('지갑을 연결하시오.');
                }
                const targetChainId = getChainId(targetNetwork);
                if (chainId !== targetChainId) {
                  if (targetNetwork === 'klaytn' && klaytn.wallet === 'kaikas') {
                    setErrorMessage(targetNetworkMsg);
                    setSuccessRegister(false);
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
                  .then(async (res) => {
                    if (res.data.status === 1) {
                      if (isBatchMint) {
                        // const count = parseInt(values.batch);
                        const data = res.data.data;
                        // const nftIds = [];
                        // const tokenIds = [];
                        // const tokenUris = [];
                        // const quantities = [];
                        // for (let i = 0; i < count; i++) {
                        //   nftIds.push(nfts[i]._id);
                        //   tokenIds.push(nfts[i].metadata.tokenId);
                        //   tokenUris.push(nfts[i].ipfs_link);
                        //   quantities.push(nfts[i].quantity);
                        // }
                        console.log('000', data);
                        console.log('111', data.nftIds);
                        console.log('222', data.tokenIds);
                        console.log('333', data.tokenUris);
                        console.log('444', data.quantities);
                        // const result = FAILURE;
                        // // TODO : Actual NFT Minting here
                        const result = await mintNFTBatch(
                          data.tokenIds,
                          data.tokenUris,
                          data.quantities,
                          data.nftIds,
                          contractType,
                          isKaikas,
                        );
                        if (result === FAILURE) {
                          // delete nft and serials
                          await cancelCreateNfts(data.nftIds);
                          setErrorMessage('Transaction failed or cancelled.');
                          setSuccessRegister(false);
                        } else {
                          setErrorMessage(null);
                          setSuccessRegister(true);
                        }
                      } else {
                        const nftId = res.data.data._id;
                        const tokenId = res.data.data.metadata.tokenId;
                        const tokenUri = res.data.data.ipfs_link;
                        const quantity = res.data.data.quantity;

                        // Actual NFT Minting here
                        if (contractType === 'KIP17') {
                          if (isKaikas) {
                            result = await mintNFT17WithKaikas(tokenId, tokenUri, nftId);
                          } else {
                            result = await mintNFT17(tokenId, tokenUri, nftId);
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
                          setSuccessRegister(false);
                        } else {
                          setErrorMessage(null);
                          setSuccessRegister(true);
                        }
                      }
                    } else {
                      setErrorMessage(res.data.message);
                      setSuccessRegister(false);
                    }
                  })
                  .catch((error) => console.log(error));
              }
            }

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
                  <CustomFormLabel htmlFor="name">{t('Name')}</CustomFormLabel>
                  <CustomTextField
                    id="name"
                    name="name"
                    variant="outlined"
                    fullWidth
                    size="small"
                    disabled={isSubmitting || isMinting}
                    value={values.name}
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
                    disabled={isSubmitting || isMinting}
                    // defaultValue={creatorList && creatorList[0].full_name}
                    value={values.creator_id}
                    onChange={(event) => {
                      setFieldValue('creator_id', event.target.value);
                      setFieldValue('collection', '');
                      setFieldValue('category', '');

                      getCollectionList(event.target.value);
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
                  <CustomFormLabel htmlFor="collection">{t('Collection')}</CustomFormLabel>
                  <CustomSelect
                    labelId="demo-simple-select-label"
                    id="collection"
                    name="collection"
                    value={values.collection}
                    disabled={isSubmitting || isMinting}
                    onChange={(event) => {
                      collectionList.filter((collection) => {
                        if (collection._id === event.target.value) {
                          if (collection.network === 'solana' && solana.address === undefined) {
                            setErrorMessage('connect phantom wallet');
                            return;
                          } else if (
                            ((collection.network === 'klaytn') & (klaytn.address === undefined) &&
                              useKAS === 'false') ||
                            (collection.network === 'ethereum' && ethereum.address === undefined) ||
                            (collection.network === 'binance' && binance.address === undefined)
                          ) {
                            setErrorMessage('connect wallet for ' + collection.network);
                            return;
                          }
                          console.log(useKAS, collection.contract_type);
                          setFieldValue('collection', event.target.value);
                          setTargetNetwork(collection.network);
                          setFieldValue('category', collection.category.toString());
                          setContractAddr(collection.contract_address);
                          setContractType(collection.contract_type);
                          useKAS === 'false' && collection.contract_type === 'KIP17'
                            ? setFieldValue('amount', '1')
                            : setFieldValue('amount', '');
                          setErrorMessage('');
                        }
                      });
                    }}
                    fullWidth
                    size="small"
                  >
                    {collectionList &&
                      collectionList.map((item) => (
                        <MenuItem key={item._id} value={item._id}>
                          {item.name}
                        </MenuItem>
                      ))}
                  </CustomSelect>
                  {touched.collection && errors.collection && (
                    <FormHelperText htmlFor="render-select" error>
                      {errors.collection}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item lg={6} md={12} sm={12} xs={12}>
                  <CustomFormLabel htmlFor="category">{t('Category')}</CustomFormLabel>
                  <CustomTextField
                    id="category"
                    name="category"
                    variant="outlined"
                    disabled={isSubmitting || isMinting}
                    fullWidth
                    size="small"
                    value={values.category}
                  />
                  {touched.category && errors.category && (
                    <FormHelperText htmlFor="render-select" error>
                      {errors.category}
                    </FormHelperText>
                  )}
                </Grid>

                {contractType !== 'SPLToken' && (
                  <Grid item lg={6} md={12} sm={12} xs={12}>
                    <CustomFormLabel htmlFor="content">{t('Content')}</CustomFormLabel>
                    <CustomTextField
                      id="contentFiled"
                      name="contentFiled"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={values.content == null ? '' : values.content.name}
                      // onChange={handleChange}
                      InputProps={{
                        startAdornment: (
                          <Button
                            component="label"
                            variant="contained"
                            size="small"
                            disabled={isSubmitting || isMinting}
                            style={{ marginRight: '1rem' }}
                          >
                            <DriveFileMoveOutlinedIcon fontSize="small" />
                            <input
                              id="content"
                              style={{ display: 'none' }}
                              type="file"
                              name="image"
                              onChange={(event) => {
                                setFieldValue('content', event.currentTarget.files[0]);
                              }}
                            />
                          </Button>
                        ),
                      }}
                    />
                    {touched.content && errors.content && (
                      <FormHelperText htmlFor="render-select" error>
                        {errors.content}
                      </FormHelperText>
                    )}
                  </Grid>
                )}

                <Grid item lg={6} md={12} sm={12} xs={12}>
                  <CustomFormLabel htmlFor="amount">{t('Amount')}</CustomFormLabel>
                  <CustomTextField
                    id="amount"
                    name="amount"
                    type="number"
                    variant="outlined"
                    fullWidth
                    size="small"
                    disabled={isSubmitting || isMinting || contractType === 'KIP17'}
                    value={values.amount}
                    onChange={
                      process.env.REACT_APP_USE_KAS === 'false' && contractType === 'KIP17'
                        ? null
                        : handleChange
                    }
                  />
                  {touched.amount && errors.amount && (
                    <FormHelperText htmlFor="render-select" error>
                      {errors.amount}
                    </FormHelperText>
                  )}
                </Grid>

                {contractType !== 'SPLToken' && (
                  <Grid item lg={6} md={12} sm={12} xs={12}>
                    <CustomFormLabel htmlFor="thumbnail">{t('Thumbnail')}</CustomFormLabel>
                    <CustomTextField
                      id="thumbnailFiled"
                      name="thumbnailFiled"
                      variant="outlined"
                      fullWidth
                      size="small"
                      value={values.thumbnail == null ? '' : values.thumbnail.name}
                      InputProps={{
                        startAdornment: (
                          <Button
                            component="label"
                            variant="contained"
                            size="small"
                            disabled={isSubmitting || isMinting}
                            style={{ marginRight: '1rem' }}
                          >
                            <DriveFileMoveOutlinedIcon fontSize="small" />
                            <input
                              id="thumbnail"
                              style={{ display: 'none' }}
                              type="file"
                              name="image"
                              onChange={(event) => {
                                setFieldValue('thumbnail', event.currentTarget.files[0]);
                              }}
                            />
                          </Button>
                        ),
                      }}
                    />
                    {touched.thumbnail && errors.thumbnail && (
                      <FormHelperText htmlFor="render-select" error>
                        {errors.thumbnail}
                      </FormHelperText>
                    )}
                  </Grid>
                )}

                <Grid item lg={6} md={12} sm={12} xs={12}>
                  <CustomFormLabel htmlFor="price">{t('Unit Price')}</CustomFormLabel>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-start',
                      alignItems: 'top',
                      gap: 2,
                    }}
                  >
                    <Box>
                      <Select
                        sx={{
                          minWidth: 90,
                          borderColor: `${
                            theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : '#dee3e9'
                          }`,
                          opacity: '1',
                        }}
                        value={values.quote}
                        size="small"
                        onChange={(event) => {
                          setFieldValue('quote', event.target.value);
                        }}
                      >
                        {priceTypes.map((item, index) => (
                          <MenuItem key={index} value={item.value}>
                            {item.caption}
                          </MenuItem>
                        ))}
                      </Select>
                      {touched.quote && errors.quote && (
                        <FormHelperText htmlFor="render-select" error>
                          {errors.quote}
                        </FormHelperText>
                      )}
                    </Box>
                    <Box sx={{ width: '100%' }}>
                      <CustomTextField
                        id="price"
                        name="price"
                        variant="outlined"
                        type="number"
                        fullWidth
                        inputProps={{ pattern: '[0-9]([.]([0-9]){6})?' }}
                        size="small"
                        disabled={isSubmitting || isMinting}
                        value={values.price}
                        // onChange={handleChange}
                        onChange={(event) => {
                          const validated = event.target.value.match(/^(\d*\.{0,1}\d{0,6}$)/);
                          if (validated) {
                            setFieldValue('price', event.target.value);
                          }
                        }}
                      />
                      {touched.price && errors.price && (
                        <FormHelperText htmlFor="render-select" error>
                          {errors.price}
                        </FormHelperText>
                      )}
                    </Box>
                  </Box>
                </Grid>
                {targetNetwork !== 'solana' && (
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
                      disabled={isSubmitting || isMinting}
                      value={values.description}
                      onChange={handleChange}
                    />
                    {touched.description && errors.description && (
                      <FormHelperText htmlFor="render-select" error>
                        {errors.description}
                      </FormHelperText>
                    )}
                  </Grid>
                )}

                <Grid item lg={6} md={12} sm={12} xs={12}>
                  <CustomFormLabel htmlFor="externalURL">{t('External URL')}</CustomFormLabel>
                  <CustomTextField
                    id="externalURL"
                    name="externalURL"
                    variant="outlined"
                    fullWidth
                    disabled={isSubmitting || isMinting}
                    size="small"
                    value={values.externalURL}
                    onChange={handleChange}
                  />
                  {touched.externalURL && errors.externalURL && (
                    <FormHelperText htmlFor="render-select" error>
                      {errors.externalURL}
                    </FormHelperText>
                  )}
                </Grid>

                <Snackbar
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  open={successRegister && !isMinting}
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
                    Success in Collection nfts!
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
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    {/*{contractType === 'KIP37' && (*/}
                    <Box
                      sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}
                    >
                      {/*<FormControlLabel*/}
                      {/*  control={*/}
                      {/*    <Checkbox*/}
                      {/*      value={isBatchMint}*/}
                      {/*      onChange={() => {*/}
                      {/*        setIsBatch((cur) => !cur);*/}
                      {/*        setFieldValue('batch', '');*/}
                      {/*      }}*/}
                      {/*    />*/}
                      {/*  }*/}
                      {/*  label="Use Batch Mint"*/}
                      {/*/>*/}
                      <Checkbox
                        value={isBatchMint}
                        onChange={() => {
                          setIsBatch((cur) => !cur);
                          setFieldValue('batch', '');
                        }}
                      />
                      <Typography variant="h6" sx={{ marginRight: '20px' }}>
                        Use Batch Mint
                      </Typography>
                      <CustomTextField
                        id="batch"
                        name="batch"
                        variant="outlined"
                        // fullWidth
                        disabled={!isBatchMint}
                        size="small"
                        value={values.batch}
                        onChange={handleChange}
                        sx={{ width: '80px' }}
                      />
                    </Box>
                    {/*)}*/}

                    <LoadingButton
                      type="submit"
                      loading={isSubmitting || isMinting}
                      variant="contained"
                      sx={{ mt: 2 }}
                    >
                      {t('Confirm')}
                    </LoadingButton>
                  </Box>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={openBackdrop}
          onClick={() => setOpenBackdrop(false)}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <WalletDialog
          isOpenConnectModal={isOpenConnectModal}
          handleCloseModal={handleCloseModal}
          activate={activate}
        />
      </Container>
    </PageContainer>
  );
};

export default NFTMint;
