import React, { useState } from 'react';
import { Formik } from 'formik';
import { Alert, FormHelperText, Grid, Paper, Snackbar } from '@mui/material';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import { LoadingButton } from '@mui/lab';
import { useTranslation } from 'react-i18next';
import { styled } from '@mui/material/styles';
import changePasswordSchema from '../../config/schema/changePasswordSchema';
import useUserInfo from '../../hooks/useUserInfo';
import { changePassword } from '../../services/auth.service';

const Container = styled(Paper)(({ theme }) => ({
  padding: '20px',
  borderRadius: '7px',
}));

const PasswordChange = () => {
  const { t } = useTranslation();
  const { id } = useUserInfo();
  const [errorMessage, setErrorMessage] = useState();
  const [successRegister, setSuccessRegister] = useState(false);

  return (
    <Container>
      <Formik
        validationSchema={changePasswordSchema}
        initialValues={{
          old_password: '',
          new_password: '',
          new_repassword: '',
        }}
        onSubmit={async (data, { setSubmitting }) => {
          setSubmitting(true);
          const res = await changePassword(id, data.old_password, data.new_password);
          if (res.status === 1) {
            setErrorMessage(null);
            setSuccessRegister(true);
          } else {
            setErrorMessage(res.message);
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
                <CustomFormLabel htmlFor="new_password">{t('New Password')}</CustomFormLabel>
                <CustomTextField
                  id="new_password"
                  name="new_password"
                  variant="outlined"
                  type="password"
                  fullWidth
                  size="small"
                  value={values.new_password}
                  onChange={handleChange}
                />
                {touched.new_password && errors.new_password && (
                  <FormHelperText htmlFor="render-select" error>
                    {errors.new_password}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item lg={6} md={12} sm={12} xs={12}>
                <CustomFormLabel htmlFor="new_repassword">Confirm Password</CustomFormLabel>
                <CustomTextField
                  id="new_repassword"
                  name="new_repassword"
                  variant="outlined"
                  type="password"
                  fullWidth
                  size="small"
                  value={values.new_repassword}
                  onChange={handleChange}
                  // error={touched.email && Boolean(errors.email)}
                  // helperText={touched.email && errors.email}
                />
                {touched.new_repassword && errors.new_repassword && (
                  <FormHelperText htmlFor="render-select" error>
                    {errors.new_repassword}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item lg={6} md={12} sm={12} xs={12}>
                <CustomFormLabel htmlFor="old_password">Old Password</CustomFormLabel>
                <CustomTextField
                  id="old_password"
                  name="old_password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={values.old_password}
                  onChange={handleChange}
                  // error={touched.email && Boolean(errors.email)}
                  // helperText={touched.email && errors.email}
                />
                {touched.old_password && errors.old_password && (
                  <FormHelperText htmlFor="render-select" error>
                    {errors.old_password}
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
                  Success changed the password!
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
                  loading={isSubmitting}
                  variant="outlined"
                  variant="contained"
                >
                  {t('Change Password')}
                </LoadingButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </Container>
  );
};

export default PasswordChange;
