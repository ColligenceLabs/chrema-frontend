import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { Hero } from './components';
import MarketLayout from '../../layouts/market-layout/MarketLayout';
import TrendingAllCategory from './components/TrendingAllCategory/TrendingAllCategory';
import TopCollections from './components/TopCollections';
import Introduction from './components/Introduction';
import AllCollectionList from './components/AllCollectionList';

const Home = (): JSX.Element => {
  return (
    <MarketLayout colorInvert={true}>
      <Hero />
      <Box bgcolor={'alternate.main'}>
        <TrendingAllCategory />
      </Box>
      <Box bgcolor={'alternate.main'}>
        <AllCollectionList />
      </Box>
      <Box bgcolor={'alternate.main'}>
        <TopCollections />
      </Box>
      <Box bgcolor={'primary.main'}>
        <Introduction />
      </Box>
    </MarketLayout>
  );
};

export default Home;
