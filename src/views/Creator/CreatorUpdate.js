import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import { Formik } from 'formik';
import { Alert, Button, FormHelperText, Grid, MenuItem, Paper, Snackbar } from '@mui/material';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import CustomSelect from '../../components/forms/custom-elements/CustomSelect';
import DriveFileMoveOutlinedIcon from '@mui/icons-material/DriveFileMoveOutlined';
import CustomTextarea from '../../components/forms/custom-elements/CustomTextarea';
import { LoadingButton } from '@mui/lab';
import PageContainer from '../../components/container/PageContainer';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import adminUpdateSchema from '../../config/schema/adminUpdateSchema';
import { updater } from '../../services/auth.service';

const Container = styled(Paper)(({ theme }) => ({
  padding: '20px',
  borderRadius: '7px',
}));

const CreatorUpdate = () => {
  const location = useLocation();

  const { t } = useTranslation();
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({ ...location.state, imageSrc: location.state.image });
  const [errorMessage, setErrorMessage] = useState();
  const [successRegister, setSuccessRegister] = useState(false);

  const encodeFileToBase64 = (fileBlob) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileBlob);
    return new Promise((resolve) => {
      reader.onload = () => {
        setUserInfo({ ...userInfo, imageSrc: reader.result });
        resolve();
      };
    });
  };

  return (
    <PageContainer title="Creator Update" description="this is Creator Update Form page">
      <Breadcrumb title="Creator Update" subtitle="Creator Update Information" />
      <Container>
        <Formik
          validationSchema={adminUpdateSchema}
          initialValues={{
            full_name: userInfo.full_name,
            email: userInfo.email,
            level: userInfo.level,
            image: '',
            imageSrc: userInfo.image,
            description: userInfo.description,
            solana_address: userInfo.solana_address,
          }}
          onSubmit={async (data, { setSubmitting }) => {
            setSubmitting(true);

            let formData = new FormData();

            formData.append('full_name', data.full_name);
            formData.append('image', data.image);
            formData.append('description', data.description);

            const res = await updater(formData, userInfo._id);

            if (res.data.status === 1) {
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
                  <CustomFormLabel htmlFor="name">{t('Name')}</CustomFormLabel>
                  <CustomTextField
                    id="full_name"
                    name="full_name"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={values.full_name}
                    onChange={handleChange}
                  />
                  {touched.full_name && errors.full_name && (
                    <FormHelperText htmlFor="render-select" error>
                      {errors.full_name}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item lg={6} md={12} sm={12} xs={12}>
                  <CustomFormLabel htmlFor="email">Email Address</CustomFormLabel>
                  <CustomTextField
                    id="email"
                    name="email"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={values.email}
                    onChange={handleChange}
                    disabled
                  />
                  {touched.email && errors.email && (
                    <FormHelperText htmlFor="render-select" error>
                      {errors.email}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                  <CustomFormLabel htmlFor="description">{t('Description')}</CustomFormLabel>
                  <CustomTextarea
                    maxRows={5}
                    minRows={5}
                    id="description"
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                  />
                  {touched.description && errors.description && (
                    <FormHelperText htmlFor="render-select" error>
                      {errors.description}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
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
                    src={userInfo.imageSrc}
                    alt="logo"
                    style={{
                      objectFit: 'cover',
                      width: '100px',
                      height: '100px',
                      borderRadius: '50px',
                      marginTop: '10px',
                    }}
                  />
                  {touched.image && errors.image && (
                    <FormHelperText htmlFor="render-select" error>
                      {errors.image}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                  <CustomFormLabel htmlFor="level">Level</CustomFormLabel>
                  <CustomSelect
                    labelId="demo-simple-select-label"
                    id="level"
                    name="level"
                    defaultValue="creator"
                    fullWidth
                    size="small"
                    disabled
                  >
                    <MenuItem value="creator">Creator</MenuItem>
                  </CustomSelect>
                  {touched.level && errors.level && (
                    <FormHelperText htmlFor="render-select" error>
                      {errors.level}
                    </FormHelperText>
                  )}
                </Grid>

                <Snackbar
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                  open={successRegister}
                  autoHideDuration={2000}
                  onClose={() => {
                    navigate('/creator');
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
                    Success Update!
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

export default CreatorUpdate;
