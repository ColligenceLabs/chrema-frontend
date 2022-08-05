import React, { useState } from 'react';
import { Formik } from 'formik';
import { Grid, Button, Paper, MenuItem, Alert, FormHelperText, Snackbar } from '@mui/material';
import { styled } from '@mui/material/styles';
import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import DriveFileMoveOutlinedIcon from '@mui/icons-material/DriveFileMoveOutlined';
import { useTranslation } from 'react-i18next';
import { register } from '../../services/auth.service';
import CustomSelect from '../../components/forms/custom-elements/CustomSelect';
import { LoadingButton } from '@mui/lab';
import adminRegisterSchema from '../../config/schema/adminRegisterSchema';
import CustomTextarea from '../../components/forms/custom-elements/CustomTextarea';

const Container = styled(Paper)(({ theme }) => ({
  padding: '20px',
  borderRadius: '7px',
}));

const CreatorRegister = () => {
  const { t } = useTranslation();

  const [errorMessage, setErrorMessage] = useState();
  const [successRegister, setSuccessRegister] = useState(false);

  return (
    <PageContainer title="Creator Register" description="this is Creator Register Form page">
      <Breadcrumb title="Creator Register" subtitle="Creator Register Information" />
      <Container>
        <Formik
          validationSchema={adminRegisterSchema}
          initialValues={{
            full_name: '',
            email: '',
            password: '',
            repeatPassword: '',
            level: 'Creator',
            image: null,
            description: '',
            solana_address: '',
          }}
          onSubmit={async (data, { setSubmitting }) => {
            setSubmitting(true);

            let formData = new FormData();
            for (let value in data) {
              formData.append(value, data[value]);
            }

            const res = await register(formData);

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
                  />
                  {touched.email && errors.email && (
                    <FormHelperText htmlFor="render-select" error>
                      {errors.email}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item lg={6} md={12} sm={12} xs={12}>
                  <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
                  <CustomTextField
                    id="password"
                    name="password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={values.password}
                    onChange={handleChange}
                  />
                  {touched.password && errors.password && (
                    <FormHelperText htmlFor="render-select" error>
                      {errors.password}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item lg={6} md={12} sm={12} xs={12}>
                  <CustomFormLabel htmlFor="password">Password Confirm</CustomFormLabel>
                  <CustomTextField
                    id="repeatPassword"
                    name="repeatPassword"
                    type="password"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={values.repeatPassword}
                    onChange={handleChange}
                  />
                  {touched.repeatPassword && errors.repeatPassword && (
                    <FormHelperText htmlFor="render-select" error>
                      {errors.repeatPassword}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                  <CustomFormLabel htmlFor="level">Level</CustomFormLabel>
                  <CustomSelect
                    labelId="demo-simple-select-label"
                    id="level"
                    name="level"
                    onChange={handleChange}
                    // value={values.level}
                    defaultValue="creator"
                    fullWidth
                    size="small"
                  >
                    <MenuItem value="creator">Creator</MenuItem>
                  </CustomSelect>
                  {touched.level && errors.level && (
                    <FormHelperText htmlFor="render-select" error>
                      {errors.level}
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
                    value={values.image == null ? '' : values.image.name}
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
                    // error={touched.description && Boolean(errors.description)}
                    // helperText={touched.description && errors.description}
                  />
                  {touched.description && errors.description && (
                    <FormHelperText htmlFor="render-select" error>
                      {errors.description}
                    </FormHelperText>
                  )}
                </Grid>

                <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                  <CustomFormLabel htmlFor="solana_address">
                    {t('Phantom Wallet Address')}
                  </CustomFormLabel>
                  <CustomTextField
                    id="solana_address"
                    name="solana_address"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={values.solana_address}
                    onChange={handleChange}
                  />
                  {touched.solana_address && errors.solana_address && (
                    <FormHelperText htmlFor="render-select" error>
                      {errors.solana_address}
                    </FormHelperText>
                  )}
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
      </Container>
    </PageContainer>
  );
};

export default CreatorRegister;
