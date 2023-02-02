import React, { useState } from 'react';
import MarketLayout from '../../layouts/market-layout/MarketLayout';
import Container from './components/Container';
import CollectionList from './components/CollectionList/CollectionList';
import { Box, useTheme, Typography } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import CategorySelector from './components/CategorySelector/CategorySelector';

const NFTsMarket = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // const handleChange = (e: any) => {
  //   const value = e.target.value;
  //   const temp = categories.filter((category) => category.value === value);
  //   console.log(temp);
  //   setSelectedCategory(temp[0]);
  // };

  return (
    <MarketLayout>
      {/*<Container sx={{ maxWidth: '1500px' }}>*/}
      <Container>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1.5rem',
            marginBottom: '20px',
          }}
        >
          <Typography fontWeight={800} sx={{ fontSize: '48px' }}>
            Marketplace
          </Typography>
          <CategorySelector
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </Box>
        {/*{mdDown ? (*/}
        {/*  <Box*/}
        {/*    sx={{*/}
        {/*      display: 'flex',*/}
        {/*      justifyContent: 'flex-end',*/}
        {/*      borderBottom: '1px solid',*/}
        {/*      borderColor: `#d9d9d9`,*/}
        {/*      mt: 5,*/}
        {/*      mb: 0,*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    <Select*/}
        {/*      value={selectedCategory}*/}
        {/*      onChange={handleChange}*/}
        {/*      sx={{ m: mdDown ? '0px 30px 15px 0px' : '0px', minWidth: '150px', height: '40px' }}*/}
        {/*    >*/}
        {/*      {categories.map((category, index) => (*/}
        {/*        <MenuItem key={index} value={category.value}>*/}
        {/*          {category.category}*/}
        {/*        </MenuItem>*/}
        {/*      ))}*/}
        {/*    </Select>*/}
        {/*  </Box>*/}
        {/*) : (*/}
        {/*  <Box*/}
        {/*    sx={{*/}
        {/*      borderBottom: '1px solid',*/}
        {/*      borderColor: `#d9d9d9`,*/}
        {/*      width: '100%',*/}
        {/*      mt: 7,*/}
        {/*      // ml:3,*/}
        {/*      // pl:3,*/}
        {/*      display: 'flex',*/}
        {/*      justifyContent: 'flexStart',*/}
        {/*      flexDirection: 'row',*/}
        {/*      gap: smDown ? '0.2rem' : '2rem',*/}
        {/*    }}*/}
        {/*  >*/}
        {/*    {categories.map((category, index) => (*/}
        {/*      <Box*/}
        {/*        key={index}*/}
        {/*        sx={{*/}
        {/*          borderBottom:*/}
        {/*            selectedCategory.id === category.id*/}
        {/*              ? `2px solid ${theme.palette.primary.main}`*/}
        {/*              : '',*/}
        {/*          pb: '5px',*/}
        {/*          px: '5px',*/}
        {/*          cursor: 'pointer',*/}
        {/*          color:*/}
        {/*            selectedCategory.id === category.id*/}
        {/*              ? `${theme.palette.text.primary}`*/}
        {/*              : `${theme.palette.text.secondary}`,*/}
        {/*        }}*/}
        {/*        onClick={() => setSelectedCategory(category)}*/}
        {/*      >*/}
        {/*        <Typography*/}
        {/*          variant={'h5'}*/}
        {/*          fontWeight={selectedCategory.id === category.id ? 800 : ''}*/}
        {/*        >*/}
        {/*          {category.category}*/}
        {/*        </Typography>*/}
        {/*      </Box>*/}
        {/*    ))}*/}
        {/*  </Box>*/}
        {/*)}*/}
        <CollectionList selectedCategory={selectedCategory} />
      </Container>
    </MarketLayout>
  );
};

export default NFTsMarket;
