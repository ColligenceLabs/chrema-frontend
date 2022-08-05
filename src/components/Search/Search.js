import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/material/styles';
import { Box, Button, InputBase } from '@mui/material';
import { useTranslation } from 'react-i18next';

const SearchContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  border: '1px',
  borderRadius: '7px',
  borderStyle: 'solid',
  // borderColor: alpha(theme.palette.primary.main, 0.15),
  // backgroundColor: alpha(theme.palette.primary.main, 0.15),
  width: '70%',
  [theme.breakpoints.up('sm')]: {
    marginRight: theme.spacing(0.5),
    marginBlock: theme.spacing(3),
    width: '300px',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.primary.main,
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',

  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Search = ({ searchKeyword, onChangeSearchQuery, onSearch }) => {
  const { t } = useTranslation();
  return (
    <Box style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
      <SearchContainer>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          value={searchKeyword}
          onChange={onChangeSearchQuery}
          // placeholder={t('Search…')}
          inputProps={{ 'aria-label': 'search' }}
        />
      </SearchContainer>
      <Button style={{ padding: '8px', height: '39px' }} variant="contained" onClick={onSearch}>
        Search
      </Button>
    </Box>
  );
};

export default Search;
