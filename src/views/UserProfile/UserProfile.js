import React from 'react';
import { Box } from '@mui/material';
import Breadcrumb from '../../layouts/full-layout/breadcrumb/Breadcrumb';
import PageContainer from '../../components/container/PageContainer';
import UserInfo from './UserInfo';
import PasswordChange from './PasswordChange';

const UserProfile = () => {
  return (
    <PageContainer title="Creator Register" description="this is Creator Register Form page">
      <Breadcrumb title="User Profile" subtitle="User Profile Information" />
      <Box style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <UserInfo />
        <PasswordChange />
      </Box>
    </PageContainer>
  );
};

export default UserProfile;
