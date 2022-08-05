import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import { Alert, FormHelperText, Grid, MenuItem, Paper, Snackbar } from '@mui/material';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import CustomSelect from '../../components/forms/custom-elements/CustomSelect';
import { LoadingButton } from '@mui/lab';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { useWeb3React } from '@web3-react/core';
import useUserInfo from '../../hooks/useUserInfo';

const Container = styled(Paper)(({ theme }) => ({
  padding: '20px',
  borderRadius: '7px',
}));

const UserInfo = () => {
  const { t } = useTranslation();
  const context = useWeb3React();
  const { account } = context;
  const [userInfor, setUserInfor] = useState({});
  const [errorMessage, setErrorMessage] = useState();
  const [successRegister, setSuccessRegister] = useState(false);
  const { full_name, level, email, description } = useUserInfo();

  useEffect(() => {
    setUserInfor({
      full_name,
      level: level.toLowerCase(),
      email,
      description,
      address: account,
    });
  }, [account]);

  return (
    <Container>
      <Formik
        // validationSchema={adminRegisterSchema}
        enableReinitialize
        initialValues={{ ...userInfor }}
        onSubmit={async (data, { setSubmitting }) => {
          setSubmitting(true);

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
                <CustomFormLabel htmlFor="full_name">{t('Name')}</CustomFormLabel>
                <CustomTextField
                  id="full_name"
                  name="full_name"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={values.full_name || ''}
                  // onChange={handleChange}
                />
                {touched.full_name && errors.full_name && (
                  <FormHelperText htmlFor="render-select" error>
                    {errors.full_name}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item lg={6} md={12} sm={12} xs={12}>
                <CustomFormLabel htmlFor="address">Address</CustomFormLabel>
                <CustomTextField
                  id="address"
                  name="address"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={values.address || ''}
                  // error={touched.email && Boolean(errors.email)}
                  // helperText={touched.email && errors.email}
                />
                {touched.address && errors.address && (
                  <FormHelperText htmlFor="render-select" error>
                    {errors.address}
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
                  value={values.email || ''}
                  // onChange={handleChange}
                  // error={touched.email && Boolean(errors.email)}
                  // helperText={touched.email && errors.email}
                />
                {touched.email && errors.email && (
                  <FormHelperText htmlFor="render-select" error>
                    {errors.email}
                  </FormHelperText>
                )}
              </Grid>

              <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                <CustomFormLabel htmlFor="level">Level</CustomFormLabel>
                <CustomSelect
                  labelId="demo-simple-select-label"
                  id="level"
                  name="level"
                  // onChange={handleChange}
                  value={values.level || ''}
                  disabled={level.toLowerCase() === 'creator'}
                  defaultValue="creator"
                  fullWidth
                  size="small"
                  // error={touched.level && Boolean(errors.level)}
                  // helperText={touched.repeatPassword && errors.repeatPassword}
                >
                  <MenuItem value="administrator">Administrator</MenuItem>
                  <MenuItem value="creator">Creator</MenuItem>
                  <MenuItem value="operator">Operator</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                </CustomSelect>
                {touched.level && errors.level && (
                  <FormHelperText htmlFor="render-select" error>
                    {errors.level}
                  </FormHelperText>
                )}
              </Grid>

              <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                <CustomFormLabel htmlFor="description">{t('Description')}</CustomFormLabel>
                <CustomTextField
                  id="description"
                  name="description"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={values.description || ''}
                  // onChange={handleChange}
                  error={touched.description && Boolean(errors.description)}
                  helperText={touched.description && errors.description}
                />
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

              {/*<Grid item lg={12} md={12} sm={12} xs={12} textAlign="right" gap="1rem">*/}
              {/*  <LoadingButton*/}
              {/*    type="submit"*/}
              {/*    loading={isSubmitting || true}*/}
              {/*    variant="outlined"*/}
              {/*    variant="contained"*/}
              {/*  >*/}
              {/*    {t('Confirm')}*/}
              {/*  </LoadingButton>*/}
              {/*</Grid>*/}
            </Grid>
          </form>
        )}
      </Formik>
    </Container>
  );
};

export default UserInfo;
