import React, { useState, useEffect } from 'react';
import { Box, Button, Divider, Drawer, IconButton, MenuItem, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CustomFormLabel from '../forms/custom-elements/CustomFormLabel';
import CustomSelect from '../forms/custom-elements/CustomSelect';
import { useTranslation } from 'react-i18next';
import { getCollectionData } from '../../services/collections.service';
import CustomTextField from '../forms/custom-elements/CustomTextField';
import useCreator from '../../hooks/useCreator';
import { getNFTData } from '../../services/nft.service';

const FiltersDrawer = ({ showDrawer, setShowDrawer, setFilters, currentRoute }) => {
  const { t } = useTranslation();
  const [collectionList, setCollectionList] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('');
  const [nftList, setNftList] = useState([]);
  const [selectedNft, setSelectedNft] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [status, setStatus] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEamil] = useState('');
  const [level, setLevel] = useState('');
  const [creatorId, setCreatorId] = useState('');
  const creatorList = useCreator();

  const handleSelectedNft = (e) => {
    setSelectedNft(e.target.value);
  };
  const handleSearchCreator = (e) => {
    setCreatorId(e.target.value);
  };
  const handleSearchKeyword = (e) => {
    setSearchKeyword(e.target.value);
  };
  const handleSelectedCollection = (e) => {
    setSelectedCollection(e.target.value);
  };
  const handleUserStatus = (e) => {
    setStatus(e.target.value);
  };

  const handleFullName = (e) => {
    setFullName(e.target.value);
  };

  const handleEmail = (e) => {
    setEamil(e.target.value);
  };

  const handleLevel = (e) => {
    setLevel(e.target.value);
  };

  useEffect(async () => {
    if (currentRoute === 'nfts') {
      await getCollectionData().then(({ data: { items } }) => {
        const collectionArray = items.map((item) => ({ id: item._id, value: item.name }));
        setCollectionList(collectionArray);
      });
    } else if (currentRoute === 'trace') {
      await getNFTData(0).then(({ data: { items } }) => {
        const nftArray = items.map((item) => ({ id: item._id, value: item.metadata.name }));
        setNftList(nftArray);
      });
    }
  }, [currentRoute]);

  return (
    <Drawer
      anchor="right"
      open={showDrawer}
      onClose={() => setShowDrawer(false)}
      PaperProps={{
        sx: {
          width: '300px',
        },
      }}
    >
      <Box p={2} style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h3">Filters</Typography>
        <IconButton size="small" onClick={() => setShowDrawer(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <Box p={2}>
        {/* ------------ trace ------------- */}
        {currentRoute === 'trace' && (
          <>
            <CustomFormLabel htmlFor="status">{t('Status')}</CustomFormLabel>
            <CustomSelect
              labelId="demo-simple-select-label"
              id="status"
              name="status"
              onChange={handleUserStatus}
              value={status}
              fullWidth
              size="small"
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </CustomSelect>
            <Box pt={3} />
            <CustomFormLabel htmlFor="nft">{t('NFT')}</CustomFormLabel>
            <CustomSelect
              labelId="demo-simple-select-label"
              id="nft"
              name="nft"
              onChange={handleSelectedNft}
              value={selectedNft}
              fullWidth
              size="small"
            >
              {nftList !== undefined &&
                nftList.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.value}
                  </MenuItem>
                ))}
            </CustomSelect>
          </>
        )}
        {/* ------------ collection ------------- */}
        {currentRoute === 'collection' && (
          <>
            <CustomFormLabel htmlFor="searchKeyword">{t('Name')}</CustomFormLabel>
            <CustomTextField
              id="searchKeyword"
              name="searchKeyword"
              variant="outlined"
              fullWidth
              size="small"
              value={searchKeyword}
              onChange={handleSearchKeyword}
            />
            <CustomFormLabel htmlFor="creator">{t('Creator')}</CustomFormLabel>
            <CustomSelect
              labelId="demo-simple-select-label"
              id="creator"
              name="creator"
              value={creatorId}
              onChange={handleSearchCreator}
              fullWidth
              size="small"
            >
              {creatorList &&
                creatorList.map((creator) => (
                  <MenuItem key={creator._id} value={creator._id}>
                    {creator.full_name}
                  </MenuItem>
                ))}
            </CustomSelect>
            <Box pt={3} />
            <CustomFormLabel htmlFor="status">{t('Status')}</CustomFormLabel>
            <CustomSelect
              labelId="demo-simple-select-label"
              id="status"
              name="status"
              onChange={handleUserStatus}
              value={status}
              fullWidth
              size="small"
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="suspend">Suspend</MenuItem>
            </CustomSelect>
            <Box pt={3} />
          </>
        )}

        {/* ------------ admins, creator, users ------------- */}
        {(currentRoute === 'admins' || currentRoute === 'creator' || currentRoute === 'users') && (
          <>
            {/*<CustomFormLabel htmlFor="level">{t('Level')}</CustomFormLabel>*/}
            {/*<CustomSelect*/}
            {/*  labelId="demo-simple-select-label"*/}
            {/*  id="level"*/}
            {/*  name="level"*/}
            {/*  onChange={handleLevel}*/}
            {/*  value={level}*/}
            {/*  fullWidth*/}
            {/*  size="small"*/}
            {/*>*/}
            {/*  <MenuItem value="administrator">Administrator</MenuItem>*/}
            {/*  <MenuItem value="creator">Creator</MenuItem>*/}
            {/*  <MenuItem value="operator">Operator</MenuItem>*/}
            {/*</CustomSelect>*/}
            {/*<Box pt={3} />*/}
            <CustomFormLabel htmlFor="fullName">{t('Name')}</CustomFormLabel>
            <CustomTextField
              id="fullName"
              name="fullName"
              variant="outlined"
              fullWidth
              size="small"
              value={fullName}
              onChange={handleFullName}
            />
            <Box pt={3} />
            <CustomFormLabel htmlFor="email">{t('Email')}</CustomFormLabel>
            <CustomTextField
              id="email"
              name="email"
              variant="outlined"
              fullWidth
              size="small"
              value={email}
              onChange={handleEmail}
            />
          </>
        )}

        {/* ------------ nfts ------------- */}
        {currentRoute === 'nfts' && (
          <>
            <CustomFormLabel htmlFor="collection">{t('Collection')}</CustomFormLabel>
            <CustomSelect
              labelId="demo-simple-select-label"
              id="collection"
              name="collection"
              onChange={handleSelectedCollection}
              value={selectedCollection}
              fullWidth
              size="small"
            >
              {collectionList !== undefined &&
                collectionList.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.value}
                  </MenuItem>
                ))}
            </CustomSelect>
            <Box pt={3} />
            <CustomFormLabel htmlFor="searchKeyword">{t('Search Keyword')}</CustomFormLabel>
            <CustomTextField
              id="searchKeyword"
              name="searchKeyword"
              variant="outlined"
              fullWidth
              size="small"
              value={searchKeyword}
              onChange={handleSearchKeyword}
            />
          </>
        )}

        {/* ------------ airdrop ------------- */}
        {currentRoute === 'airdrop' && (
          <>
            <CustomFormLabel htmlFor="searchKeyword">{t('Search Keyword')}</CustomFormLabel>
            <CustomTextField
              id="searchKeyword"
              name="searchKeyword"
              variant="outlined"
              fullWidth
              size="small"
              value={searchKeyword}
              onChange={handleSearchKeyword}
            />
          </>
        )}

        {/* ------------user ------------- */}
        {currentRoute === 'user' && (
          <>
            <CustomFormLabel htmlFor="status">{t('Status')}</CustomFormLabel>
            <CustomSelect
              labelId="demo-simple-select-label"
              id="status"
              name="status"
              onChange={handleUserStatus}
              value={status}
              fullWidth
              size="small"
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
              <MenuItem value="suspend">Suspend</MenuItem>
            </CustomSelect>
            <Box pt={3} />
            <CustomFormLabel htmlFor="searchKeyword">{t('Search Keyword')}</CustomFormLabel>
            <CustomTextField
              id="searchKeyword"
              name="searchKeyword"
              variant="outlined"
              fullWidth
              size="small"
              value={searchKeyword}
              onChange={handleSearchKeyword}
            />
          </>
        )}

        <Box pt={3} />
        <Box
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1rem',
          }}
        >
          <Button
            variant="outlined"
            onClick={() => {
              setStatus('');
              setCreatorId('');
              setSelectedCollection('');
              setSearchKeyword('');
              setFullName('');
              setEamil('');
              setLevel('');
              setSelectedNft('');
            }}
          >
            Reset
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setFilters({
                full_name: fullName,
                level,
                email,
                collectionId: selectedCollection,
                searchKeyword: searchKeyword,
                status,
                creatorId,
                selectedNft,
              });
              setShowDrawer(false);
            }}
          >
            Confirm
          </Button>
        </Box>
        <Box pt={3} />
      </Box>
    </Drawer>
  );
};

export default FiltersDrawer;
