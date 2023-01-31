import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { Hero } from './components';
import MarketLayout from '../../layouts/market-layout/MarketLayout';
import TrendingAllCategory from './components/TrendingAllCategory/TrendingAllCategory';
import TopCollections from './components/TopCollections';
import Introduction from './components/Introduction';
import AllCollectionList from './components/AllCollectionList';
import CategorySection from './components/CategorySection/CategorySection';
import HomeLayout from '../../layouts/home-layout/HomeLayout';

const Home = (): JSX.Element => {
  return (
    <HomeLayout colorInvert={true}>
      <Hero />
      {/*<CategorySection title="Art" category="art" />*/}
      {/*<CategorySection title="Game Item" category="gameItem" />*/}
      {/*<CategorySection title="Music" category="music" />*/}
      {/*<CategorySection title="Car" category="car" />*/}
      {/*<CategorySection title="House" category="house" />*/}
      {/*<CategorySection title="NFT Project" category="nftProject" />*/}
      {/*<CategorySection title="MetaVerse" category="metaVerse" />*/}
      {/*<Box bgcolor={'alternate.main'}>*/}
      {/*  <TrendingAllCategory />*/}
      {/*</Box>*/}
      <Box bgcolor={'alternate.main'}>
        <AllCollectionList />
      </Box>
      <Box bgcolor={'alternate.main'}>
        <TopCollections />
      </Box>
      <Box bgcolor={'primary.main'}>
        <Introduction />
      </Box>
    </HomeLayout>
  );
};

export default Home;
