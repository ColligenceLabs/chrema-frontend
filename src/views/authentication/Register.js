import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Grid,
  Box,
  Typography,
  Button,
  MenuItem,
  Alert,
  TextField,
  FormHelperText,
  CardMedia,
  FormControlLabel,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Formik } from 'formik';
import { register } from '../../services/auth.service';

import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import PageContainer from '../../components/container/PageContainer';
import CustomSelect from '../../components/forms/custom-elements/CustomSelect';
import DriveFileMoveOutlinedIcon from '@mui/icons-material/DriveFileMoveOutlined';
import adminRegisterSchema from '../../config/schema/adminRegisterSchema';
import CustomCheckbox from '../../components/forms/custom-elements/CustomCheckbox';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@colligence/metaplex-common';
import { getPhantomWallet } from '@solana/wallet-adapter-wallets';
import { useNavigate } from 'react-router';

const Register = () => {
  const [errorMessage, setErrorMessage] = useState();
  const [successRegister, setSuccessRegister] = useState(false);
  const wallet = useWallet();
  const { setVisible } = useWalletModal();
  const navigate = useNavigate();
  const phatomWallet = useMemo(() => getPhantomWallet(), []);
  const { t } = useTranslation();

  // useEffect(() => {
  //   console.log('=====', wallet.publicKey?.toBase58());
  // }, [wallet.publicKey]);

  const connectPhantom = useCallback(async () => {
    await wallet.select(phatomWallet.name);
    await (wallet.wallet ? wallet.connect().catch() : setVisible(true));
  }, [wallet.wallet, wallet.connect, setVisible]);

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
                  Welcome to NFT Management System
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
                  <div>
                    <Box display="flex" alignItems="center">
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

                    <Box
                      sx={{
                        mt: 4,
                      }}
                    >
                      <Formik
                        validationSchema={adminRegisterSchema}
                        initialValues={{
                          full_name: '',
                          email: '',
                          password: '',
                          repeatPassword: '',
                          level: '',
                          image: null,
                          description: '',
                          useSolana: false,
                          solana_address: '',
                        }}
                        onSubmit={async (data, { setSubmitting }) => {
                          setSubmitting(true);

                          if (data.useSolana) data.solana_address = wallet.publicKey?.toBase58();

                          let formData = new FormData();
                          for (let value in data) {
                            formData.append(value, data[value]);
                          }

                          const res = await register(formData);

                          if (res.data.status === 1) {
                            setErrorMessage(null);
                            // navigate('/auth/login');
                            setSuccessRegister(true);
                          } else {
                            setErrorMessage(res.data.message);
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
                                  <FormHelperText htmlFor="render-select" error>
                                    {errors.full_name}
                                  </FormHelperText>
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
                                  <FormHelperText htmlFor="render-select" error>
                                    {errors.email}
                                  </FormHelperText>
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
                                  <FormHelperText htmlFor="render-select" error>
                                    {errors.password}
                                  </FormHelperText>
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
                                  value={values.level}
                                  fullWidth
                                  size="small"
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
                              <Grid item xl={6} lg={6} md={6} sm={12} xs={12} marginTop={5}>
                                <FormControlLabel
                                  control={<CustomCheckbox />}
                                  checked={values.useSolana}
                                  onChange={async (event) => {
                                    console.log('=====>1', event.target.checked);
                                    try {
                                      setFieldValue('useSolana', event.target.checked);
                                      await connectPhantom();
                                      console.log('=====>2', event.target.checked);
                                      console.log('=====>', wallet);
                                      console.log('=====>', wallet.publicKey?.toBase58());
                                    } catch (e) {
                                      console.log(e);
                                      setFieldValue('useSolana', false);
                                    }
                                  }}
                                  label="Use Solana?"
                                  sx={{
                                    mb: 2,
                                  }}
                                />
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
                  </div>
                )}
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Register;
