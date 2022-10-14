import React, { useState, useEffect } from 'react';
import MarketLayout from '../../layouts/market-layout/MarketLayout';
import Container from '../../layouts/market-layout/components/Container';
import { Alert, Box, Button, Grid, Snackbar, Typography, useTheme } from '@mui/material';
import { Formik } from 'formik';
import { RegisterForm } from './types';
import { updater } from '../../services/market.service';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import DriveFileMoveOutlinedIcon from '@mui/icons-material/DriveFileMoveOutlined';
import { useTranslation } from 'react-i18next';
import useMediaQuery from '@mui/material/useMediaQuery';
import useUserInfo from '../../hooks/useUserInfo';
import CustomTextarea from '../../components/forms/custom-elements/CustomTextarea';
import { LoadingButton } from '@mui/lab';
import adminUpdateSchema from '../../config/schema/adminUpdateSchema';
import { useNavigate } from 'react-router';
import defaultUserImage from '../../assets/images/users/user.png';
import defaultBannerImage from '../../assets/images/users/banner.png';
import { loginWithAddress } from '../../redux/slices/auth';
import marketService from '../../services/market.service';
import { useWeb3React } from '@web3-react/core';
import { useDispatch } from 'react-redux';
import { signMessage } from '../../utils/signMessage';
import { verifyMessage } from '../../utils/verifyMessage';
import ImageSelector from '../../components/ImageSelector/ImageSelector';
import { styled } from '@mui/material/styles';

const ProfileContainer = styled(Container)`
  max-width: 646px !important;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 10rem;
`;

const UserProfileSetting = () => {
  const navigate = useNavigate();
  const context = useWeb3React();
  const { library, account, chainId } = context;

  const [errorMessage, setErrorMessage] = useState<any>();
  const [successRegister, setSuccessRegister] = useState(false);
  const { t } = useTranslation();
  const { full_name, email, description, image: userImage, id, banner } = useUserInfo();

  // useEffect(() => {
  //   console.log(userImage);
  // }, [userImage]);

  return (
    <MarketLayout>
      <Container>
        {id && (
          <Formik
            validationSchema={adminUpdateSchema}
            initialValues={{
              id: id,
              full_name: full_name,
              image: userImage,
              banner: banner,
              description: description,
              email: email,
              password: '',
              repeatPassword: '',
              level: '',
            }}
            onSubmit={async (data: RegisterForm, { setSubmitting }) => {
              setSubmitting(true);

              let signedMessage;
              try {
                signedMessage = await signMessage(library, account);
                console.log(typeof signedMessage);
                if (typeof signedMessage === 'object') {
                  // Todo 에러 메세지 처리 필요
                  throw new Error(signedMessage.message);
                  return;
                }
                const verifyResult = await verifyMessage(library, account, signedMessage);
                if (verifyResult !== account) {
                  console.log(account, verifyResult);
                  throw new Error('verify fail.');
                  return;
                }
              } catch (e) {
                console.log(e);
                alert(e);
                return;
              }
              const formData = new FormData();

              formData.append('id', data.id!);
              formData.append('name', data.full_name!);
              formData.append('image', data.image!);
              formData.append('banner', data.banner!);
              formData.append('email', data.email!);
              formData.append('description', data.description);
              formData.append('signedMessage', signedMessage);

              const res = await updater(formData);
              if (res?.data.status === 1) {
                const res = await marketService.loginWidthAddress(account, chainId);
                console.log(res);
                setErrorMessage(null);
                setSuccessRegister(true);
              } else {
                setErrorMessage(res?.data.message);
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
            }) => (
              <form onSubmit={handleSubmit}>
                <ProfileContainer
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1rem',
                    // flexDirection: mdDown ? 'column' : 'rows',
                    flexDirection: 'column',
                  }}
                >
                  <Typography
                    variant={'h1'}
                    // sx={{ pl: mdDown ? '0px' : '180px', textAlign: 'left' }}
                  >
                    Profile Settings
                  </Typography>
                  <Box>
                    <Box>
                      <CustomFormLabel htmlFor="image">{t('Image')}</CustomFormLabel>
                      <ImageSelector
                        image={values.image}
                        handleImageSelect={(image: any) => setFieldValue('image', image)}
                        width="200px"
                        height="200px"
                      />

                      {touched.image && errors.image && (
                        <Typography variant={'caption'} color={'red'}>
                          {errors.image}
                        </Typography>
                      )}
                    </Box>
                    <Box>
                      <CustomFormLabel htmlFor="banner">{t('Banner')}</CustomFormLabel>
                      <ImageSelector
                        image={values.banner}
                        handleImageSelect={(image: any) => setFieldValue('banner', image)}
                        width="500px"
                        height="200px"
                      />

                      {touched.banner && errors.banner && (
                        <Typography variant={'caption'} color={'red'}>
                          {errors.banner}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  <Box sx={{ flex: 0.6 }}>
                    <Box>
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
                    </Box>
                    <Box>
                      <CustomFormLabel htmlFor="email">Wallet Address</CustomFormLabel>
                      <CustomTextField
                        id="email"
                        name="email"
                        variant="outlined"
                        fullWidth
                        size="small"
                        value={values.email || ''}
                        onChange={handleChange}
                      />
                      {touched.email && errors.email && (
                        <Typography variant={'caption'} color={'red'}>
                          {errors.email}
                        </Typography>
                      )}
                    </Box>
                    <Box>
                      <CustomFormLabel htmlFor="description">{t('Description')}</CustomFormLabel>
                      <CustomTextarea
                        maxRows={5}
                        minRows={5}
                        id="description"
                        name="description"
                        value={values.description || ''}
                        onChange={handleChange}
                      />
                      {touched.description && errors.description && (
                        <Typography variant={'caption'} color={'red'}>
                          {errors.description}
                        </Typography>
                      )}
                    </Box>
                    <Snackbar
                      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                      open={successRegister}
                      autoHideDuration={1000}
                      onClose={() => {
                        navigate('/market/profile');
                        setSuccessRegister(false);
                      }}
                    >
                      <Alert
                        onClose={() => {
                          setSuccessRegister(false);
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
                    <Box sx={{ mt: '10px', textAlign: 'right' }}>
                      <LoadingButton type="submit" loading={isSubmitting} variant="contained">
                        {t('Confirm')}
                      </LoadingButton>
                    </Box>
                  </Box>
                </ProfileContainer>
              </form>
            )}
          </Formik>
        )}
      </Container>
    </MarketLayout>
  );
};

export default UserProfileSetting;
