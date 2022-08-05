import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { Hero } from './components';
import Container from './components/Container';
import MarketLayout from '../../layouts/market-layout/MarketLayout';
import TrendingAllCategory from './components/TrendingAllCategory/TrendingAllCategory';
import TopCollections from './components/TopCollections';
import Introduction from './components/Introduction';
import Footer from '../../layouts/market-layout/components/Footer';
import AllCollectionList from './components/AllCollectionList';

const Home = (): JSX.Element => {
  return (
    <MarketLayout colorInvert={true}>
      <Container>
        <Hero />
      </Container>
      <Box bgcolor={'alternate.main'}>
        <Container>
          <TrendingAllCategory />
        </Container>
      </Box>
      <Box bgcolor={'alternate.main'}>
        <Container>
          <AllCollectionList />
        </Container>
      </Box>
      <Box bgcolor={'alternate.main'}>
        <Container>
          <TopCollections />
        </Container>
      </Box>
      <Box bgcolor={'primary.main'}>
        <Container>
          <Introduction />
        </Container>
      </Box>
    </MarketLayout>
  );
};

export default Home;
