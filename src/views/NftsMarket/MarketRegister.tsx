import React, { useCallback, useMemo, useState } from 'react';
import PageContainer from '../../components/container/PageContainer';
import { Alert, Box, Button, CardMedia, Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import adminRegisterSchema from '../../config/schema/adminRegisterSchema';
import { register } from '../../services/auth.service';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import DriveFileMoveOutlinedIcon from '@mui/icons-material/DriveFileMoveOutlined';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@colligence/metaplex-common';
import { getPhantomWallet } from '@solana/wallet-adapter-wallets';
import { useTranslation } from 'react-i18next';
import { RegisterForm } from './types';
import { useNavigate } from 'react-router';

const MarketRegister = () => {
  const [errorMessage, setErrorMessage] = useState<any>();
  const [successRegister, setSuccessRegister] = useState(false);
  const wallet = useWallet();
  const navigate = useNavigate();
  const { setVisible } = useWalletModal();
  const phatomWallet = useMemo(() => getPhantomWallet(), []);
  const { t } = useTranslation();

  const connectPhantom = useCallback(async () => {
    await wallet.select(phatomWallet.name);
    await (wallet.wallet ? wallet.connect().catch() : setVisible(true));
  }, [wallet.wallet, wallet.connect, setVisible]);

  const initialValue: RegisterForm = {
    full_name: '',
    email: '',
    password: '',
    repeatPassword: '',
    level: 'user',
    image: null,
    description: '',
  };

  return (
    <PageContainer title="Register" description="this is Register page">
      <Grid container spacing={0} sx={{ height: '100vh', justifyContent: 'center' }}>
        <Grid item xs={12} sm={8} lg={6} xl={6} display="flex" alignItems="center">
          <Grid container spacing={0} display="flex" justifyContent="center">
            <Grid item xs={12} lg={12} xl={12}>
              <Box
                sx={{
                  p: 4,
                }}
              >
                <Typography fontWeight="700" variant="h2">
                  Welcome to NFT Market
                </Typography>
                {successRegister ? (
                  <Box display="flex" alignItems="center">
                    <Typography
                      color="textSecondary"
                      variant="h6"
                      fontWeight="400"
                      sx={{
                        mr: 1,
                      }}
                    >
                      Success in sign up
                    </Typography>
                    <Typography
                      variant="h6"
                      component={Link}
                      to="/auth/login"
                      fontWeight="500"
                      sx={{
                        display: 'block',
                        textDecoration: 'none',
                        color: 'primary.main',
                      }}
                    >
                      Login
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
                      <Typography
                        color="textSecondary"
                        variant="h6"
                        fontWeight="400"
                        sx={{
                          mr: 1,
                        }}
                      >
                        Already have an Account?
                      </Typography>
                      <Typography
                        variant="h6"
                        component={Link}
                        to="/auth/login"
                        fontWeight="500"
                        sx={{
                          display: 'block',
                          textDecoration: 'none',
                          color: 'primary.main',
                        }}
                      >
                        Login
                      </Typography>
                    </Box>
                    <Box display={'flex'}>
                      <Typography
                        color="textSecondary"
                        variant="h6"
                        fontWeight="400"
                        sx={{
                          mr: 1,
                        }}
                      >
                        Register creator or admin?
                      </Typography>
                      <Typography
                        variant="h6"
                        component={Link}
                        to="/auth/register"
                        fontWeight="500"
                        sx={{
                          display: 'block',
                          textDecoration: 'none',
                          color: 'primary.main',
                        }}
                      >
                        Become a creator
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        mt: 4,
                      }}
                    >
                      <Formik
                        validationSchema={adminRegisterSchema}
                        initialValues={initialValue}
                        onSubmit={async (data: RegisterForm, { setSubmitting }) => {
                          setSubmitting(true);

                          const formData = new FormData();
                          for (const value in data) {
                            // @ts-ignore
                            formData.append(value, data[value]);
                          }

                          const res = await register(formData);
                          console.log(res);
                          if (res?.data.status === 1) {
                            setErrorMessage(null);
                            // navigate('/auth/login');
                            setSuccessRegister(true);
                          } else {
                            setErrorMessage(res?.data.message);
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
                        }) => (
                          <form onSubmit={handleSubmit}>
                            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                              <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                                <CustomFormLabel htmlFor="full_name">Name</CustomFormLabel>
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
                                  <Typography variant={'caption'} color={'red'}>
                                    {errors.full_name}
                                  </Typography>
                                )}
                              </Grid>
                              <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
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
                                  <Typography variant={'caption'} color={'red'}>
                                    {errors.email}
                                  </Typography>
                                )}
                              </Grid>
                              <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
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
                                  <Typography variant={'caption'} color={'red'}>
                                    {errors.password}
                                  </Typography>
                                )}
                              </Grid>
                              <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                                <CustomFormLabel htmlFor="password">
                                  Password Confirm
                                </CustomFormLabel>
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
                                  <Typography variant={'caption'} color={'red'}>
                                    {errors.repeatPassword}
                                  </Typography>
                                )}
                              </Grid>

                              <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                                <CustomFormLabel htmlFor="description">
                                  {t('Description')}
                                </CustomFormLabel>
                                <CustomTextField
                                  id="description"
                                  name="description"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  value={values.description}
                                  onChange={handleChange}
                                  error={touched.description && Boolean(errors.description)}
                                  helperText={touched.description && errors.description}
                                />
                              </Grid>
                              <Grid item xl={6} lg={6} md={6} sm={12} xs={12}>
                                <CustomFormLabel htmlFor="image">{t('Image')}</CustomFormLabel>
                                <CustomTextField
                                  id="image"
                                  name="image"
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  value={values.image == null ? '' : values.image.name}
                                  // onChange={handleChange}
                                  InputProps={{
                                    startAdornment: (
                                      <Button
                                        variant="contained"
                                        component="label"
                                        size="small"
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
                                            // @ts-ignore
                                            setFieldValue('image', event.currentTarget.files[0]);
                                          }}
                                        />
                                      </Button>
                                    ),
                                  }}
                                />
                                {touched.image && errors.image && (
                                  <Typography variant={'caption'} color={'red'}>
                                    {errors.image}
                                  </Typography>
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
                            </Grid>
                            {errorMessage && (
                              <Alert
                                sx={{
                                  mt: 3,
                                }}
                                variant="filled"
                                severity="error"
                              >
                                {errorMessage}
                              </Alert>
                            )}
                            <Button
                              type="submit"
                              color="secondary"
                              variant="contained"
                              size="large"
                              fullWidth
                              sx={{
                                mt: 3,
                              }}
                              disabled={isSubmitting}
                            >
                              Register
                            </Button>
                          </form>
                        )}
                      </Formik>
                    </Box>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default MarketRegister;
