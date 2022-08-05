import React from 'react';
import { useRoutes } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { useSelector } from 'react-redux';
import ThemeSettings from './layouts/full-layout/customizer/ThemeSettings';
import Router from './routes/Router';
import 'react-perfect-scrollbar/dist/css/styles.css';
import useUserInfo from './hooks/useUserInfo';
import ScrollTop from './components/ScrollTop/ScrollTop';

const App = () => {
  const theme = ThemeSettings();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const routing = useRoutes(Router(isLoggedIn, user?.infor?.level));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ScrollTop />
      {routing}
    </ThemeProvider>
  );
};

export default App;
