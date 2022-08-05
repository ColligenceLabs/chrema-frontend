import React from 'react';
import { Grid, Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import CustomTextField from '../../components/forms/custom-elements/CustomTextField';
import CustomFormLabel from '../../components/forms/custom-elements/CustomFormLabel';

import PageContainer from '../../components/container/PageContainer';

const ResetPassword = () => (
  <PageContainer title="Reset Password" description="this is Reset Password page">
    <Grid container spacing={0} sx={{ height: '100vh', justifyContent: 'center' }}>
      <Grid item xs={12} sm={8} lg={6} display="flex" alignItems="center">
        <Grid container spacing={0} display="flex" justifyContent="center">
          <Grid item xs={12} lg={9} xl={6}>
            <Box
              sx={{
                p: 4,
              }}
            >
              <Typography variant="h2" fontWeight="700">
                Forgot your password?
              </Typography>

              <Typography
                color="textSecondary"
                variant="h5"
                fontWeight="400"
                sx={{
                  mt: 2,
                }}
              >
                Please enter the email address associated with your account and We will email you a
                link to reset your password.
              </Typography>

              <Box
                sx={{
                  mt: 4,
                }}
              >
                <CustomFormLabel htmlFor="reset-email">Email Adddress</CustomFormLabel>
                <CustomTextField id="reset-email" variant="outlined" fullWidth />

                <Button
                  color="secondary"
                  variant="contained"
                  size="large"
                  fullWidth
                  component={Link}
                  to="/"
                  sx={{
                    pt: '10px',
                    pb: '10px',
                    mt: 4,
                  }}
                >
                  Reset Password
                </Button>
                <Button
                  color="secondary"
                  size="large"
                  fullWidth
                  component={Link}
                  to="/auth/login"
                  sx={{
                    pt: '10px',
                    pb: '10px',
                    mt: 2,
                  }}
                >
                  Back to Login
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  </PageContainer>
);

export default ResetPassword;
