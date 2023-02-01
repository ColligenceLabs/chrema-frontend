import React, { useEffect, useState } from 'react';
import { Box, Button, IconButton, InputAdornment, MenuItem, useTheme } from '@mui/material';
import CustomTextField from '../../../../components/forms/custom-elements/CustomTextField';
import SearchIcon from '@mui/icons-material/Search';
import CustomSelect from '../../../../components/forms/custom-elements/CustomSelect';
import useMediaQuery from '@mui/material/useMediaQuery';
import ViewModeSelector from '../ViewModeSelector';

interface ItemFilterProp {
  filterSet: object;
  setFilterSet: React.Dispatch<React.SetStateAction<FilterSetType>>;
  showLarge: boolean;
  onClickViewMode: (flag: boolean) => void;
}

interface FilterSetType {
  searchKeyword: string;
  createAt: string;
  price: string;
  tokenId: string;
  minPrice: string;
  maxPrice: string;
}

const SORTING_CATEGORY = [
  { id: 0, value: 'recent', caption: 'Recent' },
  { id: 1, value: 'oldest', caption: 'Oldest' },
  { id: 2, value: 'priceLowToHigh', caption: 'Price Low to High' },
  { id: 3, value: 'priceHighToLow', caption: 'Price High to Low' },
  { id: 4, value: 'tokenIdHighToLow', caption: 'Token ID High to Low' },
  { id: 5, value: 'tokenIdLowToHigh', caption: 'Token ID Low to High' },
];

const ItemFilter: React.FC<ItemFilterProp> = ({
  filterSet,
  setFilterSet,
  showLarge,
  onClickViewMode,
}) => {
  const theme = useTheme();
  const mdDown = useMediaQuery(theme.breakpoints.down('md'), {
    defaultMatches: true,
  });
  const smDown = useMediaQuery(theme.breakpoints.down('sm'), {
    defaultMatches: true,
  });

  const [sorting, setSorting] = useState(SORTING_CATEGORY[5].value);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [createAt, setCreateAt] = useState('0');
  const [price, setPrice] = useState('0');
  const [tokenId, setTokenId] = useState('1');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [disableButton, setDisableButton] = useState(true);

  const onChangeSearchKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKeyword(e.target.value);
  };

  const onChangeMinPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinPrice(e.target.value);
  };

  const onChangeMaxPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxPrice(e.target.value);
  };

  const onSelectSortingCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSortingType = e.target.value;

    if (selectedSortingType === 'recent' || selectedSortingType === 'oldest') {
      if (selectedSortingType === 'recent') setCreateAt('-1');
      if (selectedSortingType === 'oldest') setCreateAt('1');
      setPrice('0');
      setTokenId('0');
    }
    if (selectedSortingType === 'priceLowToHigh' || selectedSortingType === 'priceHighToLow') {
      if (selectedSortingType === 'priceLowToHigh') setPrice('1');
      if (selectedSortingType === 'priceHighToLow') setPrice('-1');
      setCreateAt('0');
      setTokenId('0');
    }
    setSorting(selectedSortingType);

    if (selectedSortingType === 'tokenIdLowToHigh' || selectedSortingType === 'tokenIdHighToLow') {
      if (selectedSortingType === 'tokenIdLowToHigh') setTokenId('1');
      if (selectedSortingType === 'tokenIdHighToLow') setTokenId('-1');
      setCreateAt('0');
      setPrice('0');
    }
    setSorting(selectedSortingType);
  };

  const clearFilter = () => {
    setSearchKeyword('');
    setSorting(SORTING_CATEGORY[0].value);
    setCreateAt('-1');
    setTokenId('-1');
    setPrice('0');
    setMinPrice('');
    setMaxPrice('');
  };

  useEffect(() => {
    if (
      searchKeyword !== '' ||
      createAt !== '-1' ||
      price !== '0' ||
      minPrice !== '' ||
      maxPrice !== ''
    ) {
      setDisableButton(false);
    } else {
      setDisableButton(true);
    }
    setFilterSet({ ...filterSet, searchKeyword, createAt, price, tokenId, minPrice, maxPrice });
  }, [sorting, searchKeyword, createAt, price, tokenId, minPrice, maxPrice]);

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: mdDown ? 'column' : 'row',
        flex: '1',
        width: '100%',
        px: '10px',
        mt: '-10px',
        mb: '25px',
        gap: 2,
      }}
    >
      <Box
        sx={
          smDown
            ? {
                display: 'flex',
                justifyContent: 'space-between',
                gap: 2,
              }
            : { flex: 1 }
        }
      >
        <CustomTextField
          fullWidth
          sx={{ flexGrow: 1 }}
          size={'small'}
          placeholder={'Search'}
          onChange={onChangeSearchKeyword}
          value={searchKeyword}
          InputProps={{
            startAdornment: (
              <InputAdornment position={'start'}>
                <IconButton>
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {smDown && <ViewModeSelector showLarge={showLarge} onClickViewMode={onClickViewMode} />}
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          flexDirection: smDown ? 'column' : 'row',
          gap: 2,
        }}
      >
        <CustomSelect
          value={sorting}
          onChange={onSelectSortingCategory}
          variant="outlined"
          size="small"
          sx={{ minWidth: '185px' }}
          inputProps={{
            sx: { backgroundColor: '#F7FBFD' },
          }}
        >
          {SORTING_CATEGORY.map((category, index) => (
            <MenuItem key={index} value={category.value}>
              {category.caption}
            </MenuItem>
          ))}
        </CustomSelect>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <CustomTextField
            size={'small'}
            type={'number'}
            value={minPrice}
            InputProps={{ inputProps: { min: 0 } }}
            placeholder={'Min Price'}
            onChange={onChangeMinPrice}
            sx={{ flexGrow: 1, maxWidth: mdDown ? '100%' : '120px' }}
          />
          <Box sx={{ flexGrow: 0 }}>~</Box>
          <CustomTextField
            size={'small'}
            type={'number'}
            value={maxPrice}
            InputProps={{ inputProps: { min: 0 } }}
            placeholder={'Max Price'}
            onChange={onChangeMaxPrice}
            sx={{ flexGrow: 1, maxWidth: mdDown ? '100%' : '120px' }}
          />
        </Box>

        <Button size={'small'} variant={'contained'} disabled={disableButton} onClick={clearFilter}>
          Clear
        </Button>
        {!smDown && <ViewModeSelector showLarge={showLarge} onClickViewMode={onClickViewMode} />}
      </Box>
    </Box>
  );
};

export default ItemFilter;
