import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import { Grid, MenuItem, Button, Paper, FormHelperText, Snackbar, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
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
import { registerNFT, batchRegisterNFT } from '../../services/nft.service';
import useUserInfo from '../../hooks/useUserInfo';
import WalletDialog from '../../components/WalletDialog';
import airdropMintSchema from '../../config/schema/airdropMintSchema';
import { FAILURE, SUCCESS } from '../../config/constants/consts';
import { useSelector } from 'react-redux';

const Container = styled(Paper)(({ theme }) => ({
  padding: '20px',
  borderRadius: '7px',
}));

const AirDropMint = () => {
  const { t } = useTranslation();

  // TODO : change for mainnet 1001 -> 8217
  const [contractAddr, setContractAddr] = useState(contracts.kip17[1001]);
  const [contractType, setContractType] = useState('KIP17');
  const { account, activate, library } = useWeb3React();
  const kipContract = useKipContract(contractAddr, contractType);
  const kasContract = useKipContractWithKaikas(contractAddr, contractType);
  const { mintNFT17, mintNFT17WithKaikas, mintNFT37, mintNFT37WithKaikas, isMinting } = useNFT(
    kipContract,
    kasContract,
    account,
  );
  const [collectionList, setCollectionList] = useState([]);
  const [errorMessage, setErrorMessage] = useState();
  const [successRegister, setSuccessRegister] = useState(false);
  const [isOpenConnectModal, setIsOpenConnectModal] = useState(false);
  const { ethereum, klaytn, solana } = useSelector((state) => state.wallets);

  const creatorList = useCreator();
  const { level, id, full_name } = useUserInfo();
  const useKAS = process.env.REACT_APP_USE_KAS ?? 'false';

  const handleCloseModal = async () => {
    setIsOpenConnectModal(false);
  };

  const getCollectionList = async (id) => {
    await getCollectionsByCreatorId(id)
      .then(({ data }) => {
        setCollectionList(data.filter((row) => row.status === 'active'));
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (level.toLowerCase() === 'creator') {
      getCollectionList(id);
    }
  }, [level]);

  return (
    <PageContainer title="Airdrop Mint" description="this is Airdrop Mint Form page">
      <Breadcrumb title="Airdrop Mint" subtitle="Airdrop Mint Information" />
      <Container>
        <Formik
          validationSchema={airdropMintSchema}
          enableReinitialize
          initialValues={{
            name: '',
            creator_id: level.toLowerCase() === 'creator' ? id : '',
            category: ['airdrop'],
            collection: '',
            content: null,
            amount: '',
            thumbnail: null,
            externalURL: '',
            description: '',
            contract_type: '',
            auto: 'false',
            type: '1',
          }}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);

            if (account === undefined) {
              setIsOpenConnectModal(true);
              return;
            }

            let formData = new FormData();
            for (let value in values) {
              if (
                ['name', 'external_url', 'contract_type', 'auto', 'type', 'description'].includes(
                  value,
                )
              ) {
                formData.append(value, values[value]);
              }
            }
            formData.append('quantity', values['amount']);
            formData.append('collection_id', values['collection']);
            formData.append('file', values['content']);
            formData.append('thumbnail', values['thumbnail']);
            // formData.append('category', values['category']);

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
              await registerNFT(formData)
                .then(async (res) => {
                  if (res.data.status === 1) {
                    setErrorMessage(null);
                    setSuccessRegister(true);

                    const nftId = res.data.data._id;
                    const tokenId = res.data.data.metadata.tokenId;
                    const tokenUri = res.data.data.ipfs_link;
                    const quantity = res.data.data.quantity;

                    // TODO : Actual NFT Minting here
                    let result = SUCCESS;
                    if (contractType === 'KIP17') {
                      if (library.connection.url !== 'metamask' && library.connection.url !== 'eip-1193:') {
                        result = await mintNFT17WithKaikas(tokenId, tokenUri, nftId);
                      } else {
                        result = await mintNFT17(tokenId, tokenUri, nftId);
                      }
                      if (result === FAILURE) {
                        setErrorMessage('Transaction failed or cancelled.');
                        setSuccessRegister(false);
                      }
                    } else {
                      if (library.connection.url !== 'metamask' && library.connection.url !== 'eip-1193:') {
                        result = await mintNFT37WithKaikas(tokenId, quantity, tokenUri, nftId);
                      } else {
                        result = await mintNFT37(tokenId, quantity, tokenUri, nftId);
                      }
                      if (result === FAILURE) {
                        setErrorMessage('Transaction failed or cancelled.');
                        setSuccessRegister(false);
                      }
                    }
                  } else {
                    setErrorMessage(res.data.message);
                    setSuccessRegister(false);
                  }
                })
                .catch((error) => console.log(error));
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
                      setFieldValue('collection', event.target.value);
                      collectionList.filter((collection) => {
                        if (collection._id === event.target.value) {
                          if (collection.network === 'solana' && solana.address === undefined) {
                            setErrorMessage('connect phantom wallet');
                            return;
                          } else if (
                            collection.network === 'klaytn' &&
                            klaytn.address === undefined && !useKAS
                          ) {
                            setErrorMessage('connect wallet for klaytn');
                            return;
                          } else if (
                            collection.network === 'ethereum' &&
                            ethereum.address === undefined
                          ) {
                            setErrorMessage('connect wallet for ethereum');
                            return;
                          }
                          console.log(useKAS, collection.contract_type);
                          setContractAddr(collection.contract_address);
                          setContractType(collection.contract_type);
                          useKAS === 'false' && collection.contract_type === 'KIP17'
                            ? setFieldValue('amount', '1')
                            : setFieldValue('amount', '');
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

                <Grid item lg={6} md={12} sm={12} xs={12}>
                  <CustomFormLabel htmlFor="amount">{t('Amount')}</CustomFormLabel>
                  <CustomTextField
                    id="amount"
                    name="amount"
                    type="number"
                    variant="outlined"
                    fullWidth
                    size="small"
                    disabled={isSubmitting || isMinting}
                    value={values.amount}
                    onChange={
                      useKAS === 'false' && contractType === 'KIP17'
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
                <Grid item lg={6} md={12} sm={12} xs={12}>
                  <CustomFormLabel htmlFor="description">{t('Description')}</CustomFormLabel>
                  <CustomTextField
                    id="description"
                    name="description"
                    variant="outlined"
                    fullWidth
                    size="small"
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
                    Success in Create AirDrop!
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
                  <LoadingButton
                    type="submit"
                    loading={isSubmitting || isMinting}
                    variant="contained"
                    sx={{ mt: 2 }}
                  >
                    {t('Confirm')}
                  </LoadingButton>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
        <WalletDialog
          isOpenConnectModal={isOpenConnectModal}
          handleCloseModal={handleCloseModal}
          activate={activate}
        />
      </Container>
    </PageContainer>
  );
};

export default AirDropMint;
