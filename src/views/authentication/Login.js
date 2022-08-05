import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, FormGroup, FormControlLabel, Button, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import CustomCheckbox from '../../components/forms/custom-elements/CustomCheckbox';
import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';
import PageContainer from '../../components/container/PageContainer';
import { useDispatch } from 'react-redux';
import { clearMessage } from '../../redux/slices/message';
import { login } from '../../redux/slices/auth';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };
  const loginHandler = () => {
    dispatch(login({ email, password }))
      .unwrap()
      .then((res) => {
        if (res.status === 1) {
          setErrorMessage('');
          if (res.user.infor.level === 'user') {
            navigate('/');
          } else {
            navigate('/dashboard');
          }
        } else {
          setErrorMessage(res.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  return (
    <PageContainer title="Login" description="this is Login page">
      <Grid container spacing={0} sx={{ height: '100vh', justifyContent: 'center' }}>
        <Grid item xs={12} sm={8} lg={8} display="flex" alignItems="center">
          <Grid container spacing={0} display="flex" justifyContent="center">
            <Grid item xs={12} lg={9} xl={6}>
              <Box
                sx={{
                  p: 4,
                }}
              >
                <Typography fontWeight="700" variant="h2">
                  NFT Management System
                </Typography>
                <Box display="flex" alignItems="center" sx={{ pt: 2 }}>
                  <Typography
                    color="textSecondary"
                    variant="h6"
                    fontWeight="500"
                    sx={{
                      mr: 1,
                    }}
                  >
                    Create Account.
                  </Typography>
                </Box>
                <Box display={'flex'} gap={'0.5rem'}>
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
                    Are you Admin or Creator?
                  </Typography>
                  <Typography color="textSecondary" variant="h6" fontWeight="500">
                    or
                  </Typography>
                  <Typography
                    variant="h6"
                    component={Link}
                    to="/auth/market-register"
                    fontWeight="500"
                    sx={{
                      display: 'block',
                      textDecoration: 'none',
                      color: 'primary.main',
                    }}
                  >
                    Are you Market User?
                  </Typography>
                </Box>
                <Box
                  sx={{
                    mt: 4,
                  }}
                >
                  <CustomFormLabel htmlFor="email">Email Address</CustomFormLabel>
                  <CustomTextField
                    id="email"
                    value={email}
                    onChange={onChangeEmail}
                    variant="outlined"
                    fullWidth
                  />
                  <CustomFormLabel htmlFor="password">Password</CustomFormLabel>
                  <CustomTextField
                    id="password"
                    value={password}
                    type="password"
                    variant="outlined"
                    fullWidth
                    onChange={onChangePassword}
                    sx={{
                      mb: 3,
                    }}
                  />
                  {errorMessage && (
                    <Alert
                      sx={{
                        mb: 4,
                      }}
                      variant="filled"
                      severity="error"
                    >
                      {t(errorMessage)}
                    </Alert>
                  )}
                  <Box
                    sx={{
                      display: {
                        xs: 'block',
                        sm: 'flex',
                        lg: 'flex',
                      },
                      alignItems: 'center',
                    }}
                  >
                    <FormGroup>
                      <FormControlLabel
                        control={<CustomCheckbox defaultChecked />}
                        label="Remeber this Device"
                        sx={{
                          mb: 2,
                        }}
                      />
                    </FormGroup>
                    <Box
                      sx={{
                        ml: 'auto',
                      }}
                    >
                      <Typography
                        component={Link}
                        to="/auth/reset-password"
                        fontWeight="500"
                        sx={{
                          display: 'block',
                          textDecoration: 'none',
                          mb: '16px',
                          color: 'primary.main',
                        }}
                      >
                        Forgot Password ?
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    color="secondary"
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={loginHandler}
                    to="/"
                    sx={{
                      mt: '10px',
                      pt: '10px',
                      pb: '10px',
                    }}
                  >
                    Login
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Login;
