import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageContainer from '../../components/container/PageContainer';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import { Formik } from 'formik';

import {
  Alert,
  Button,
  Divider,
  FormHelperText,
  Grid,
  MenuItem,
  Paper,
  Snackbar,
  Typography,
} from '@mui/material';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import CustomTextarea from '../../components/forms/custom-elements/CustomTextarea';
import DriveFileMoveOutlinedIcon from '@mui/icons-material/DriveFileMoveOutlined';
import { LoadingButton } from '@mui/lab';
import { COLLECTION_CATEGORY } from './catetories';
import { styled } from '@mui/material/styles';
import collectionUpdateSchema from '../../config/schema/collectionUpdateSchema';
import { updateCollection } from '../../services/collections.service';

const Container = styled(Paper)(({ theme }) => ({
  padding: '20px',
  borderRadius: '7px',
}));

const CollectionUpdate = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState();
  const [successRegister, setSuccessRegister] = useState(false);
  const [collectionInfo, setCollectionInfo] = useState({
    ...location.state,
    imageSrc: location.state.image_link,
  });

  const encodeFileToBase64 = (fileBlob) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileBlob);
    return new Promise((resolve) => {
      reader.onload = () => {
        setCollectionInfo({ ...collectionInfo, imageSrc: reader.result });
        resolve();
      };
    });
  };

  return (
    <PageContainer title="Collection Update" description="this is Collection Update Form page">
      <Breadcrumb title="Collection Update" subtitle="Collection Update Information" />
      <Container>
        <Formik
          validationSchema={collectionUpdateSchema}
          initialValues={{
            image: '',
            category: collectionInfo.category,
            imageSrc: collectionInfo.image,
            description: collectionInfo.description,
          }}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);

            let formData = new FormData();

            for (let value in values) {
              if (['image', 'description'].includes(value)) {
                formData.append(value, values[value]);
              } else if (['category'].includes(value)) {
                values[value].forEach((category) => formData.append(value, category));
              }
            }

            const res = await updateCollection(collectionInfo._id, formData);

            if (res.status === 1) {
              setErrorMessage(null);
              setSuccessRegister(true);
            } else {
              setErrorMessage(res.data.message);
              setSuccessRegister(false);
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
                  <CustomFormLabel htmlFor="network">{t('Network')}</CustomFormLabel>
                  <CustomTextField
                    id="network"
                    name="network"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={collectionInfo.network}
                    disabled
                  />
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
                    value={collectionInfo.name}
                    disabled
                  />
                </Grid>
                <Grid item lg={6} md={12} sm={12} xs={12}>
                  <CustomFormLabel htmlFor="creator">{t('Creator')}</CustomFormLabel>
                  <CustomTextField
                    id="creator"
                    name="creator"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={collectionInfo?.creator_id?.full_name}
                    disabled
                  />
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
                    value={values.image.name || ''}
                    InputProps={{
                      startAdornment: (
                        <Button
                          component="label"
                          variant="contained"
                          size="small"
                          style={{ marginRight: '1rem' }}
                        >
                          <DriveFileMoveOutlinedIcon fontSize="small" />
                          <input
                            id="image"
                            style={{ display: 'none' }}
                            type="file"
                            name="image"
                            onChange={(event) => {
                              setFieldValue('image', event.currentTarget.files[0]);
                              encodeFileToBase64(event.currentTarget.files[0]);
                            }}
                          />
                        </Button>
                      ),
                    }}
                  />
                  <img
                    src={collectionInfo.imageSrc}
                    alt="logo"
                    style={{
                      objectFit: 'cover',
                      width: '100%',
                      marginTop: '10px',
                    }}
                  />
                  {touched.image && errors.image && (
                    <FormHelperText htmlFor="render-select" error>
                      {errors.image}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item lg={6} md={12} sm={12} xs={12}>
                  <CustomFormLabel htmlFor="description">{t('Description')}</CustomFormLabel>
                  <CustomTextarea
                    id="description"
                    name="description"
                    maxRows={7}
                    minRows={7}
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
                    disabled
                    value={collectionInfo.fee_percentage / 10}
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
                    disabled
                    value={
                      collectionInfo.fee_payout === '0x0000000000000000000000000000000000000000'
                        ? ''
                        : collectionInfo.fee_payout
                    }
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
                {collectionInfo.network !== 'solana' ? (
                  <>
                    <Grid item lg={6} md={12} sm={12} xs={12}>
                      <CustomFormLabel>{t('Type')}</CustomFormLabel>
                      <CustomTextField
                        id="type"
                        name="type"
                        variant="outlined"
                        fullWidth
                        size="small"
                        disabled
                        value={collectionInfo.contract_type}
                      />
                    </Grid>

                    {collectionInfo.contract_type === 'KIP17' && (
                      <Grid item lg={6} md={12} sm={12} xs={12}>
                        <CustomFormLabel htmlFor="symbol">{t('Symbol')}</CustomFormLabel>
                        <CustomTextField
                          id="symbol"
                          name="symbol"
                          variant="outlined"
                          fullWidth
                          size="small"
                          disabled
                          value={collectionInfo.symbol}
                        />
                      </Grid>
                    )}

                    {collectionInfo.contract_type === 'KIP37' && (
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
                          disabled
                          value={collectionInfo.tokenUri}
                        />
                      </Grid>
                    )}
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
                        disabled
                        value={collectionInfo.symbol}
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
                        disabled
                        value={collectionInfo.maximum_supply}
                      />
                    </Grid>
                  </>
                )}

                <Snackbar
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  open={successRegister}
                  autoHideDuration={2000}
                  onClose={() => {
                    navigate('/collection');
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
      </Container>
    </PageContainer>
  );
};

export default CollectionUpdate;
