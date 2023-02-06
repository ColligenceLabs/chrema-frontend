import React, { useEffect, useState } from 'react';
import { Avatar, Box, Button, Menu, MenuItem, Typography, Divider, Grid } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import useSWR from 'swr';
import { TrendingCategoryResponse } from '../../types';
import crmc_logo from '../../../../assets/images/logos/crmc-symbol.png';
import Container from '../Container';

const TopCollectionsSection = styled(Container)`
  max-width: 1500px;
`;

interface CategoryTypes {
  id: number;
  value: string;
  caption: string;
}

const CATEGORY: CategoryTypes[] = [
  {
    id: 0,
    value: '1',
    caption: 'last 24 hours',
  },
  {
    id: 1,
    value: '7',
    caption: 'last 7 days',
  },
  {
    id: 2,
    value: '30',
    caption: 'last 30 days',
  },
];

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const TopCollections = () => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [category, setCategory] = useState<CategoryTypes>(CATEGORY[1]);
  const [items, setItems] = useState<any[]>([]);

  const { data } = useSWR<TrendingCategoryResponse>(
    `${process.env.REACT_APP_API_SERVER}/admin-api/collection/top?days=${category.value}d&size=15&page=0`,
    fetcher,
  );

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCategory = (selectedCategory: CategoryTypes) => {
    setCategory(selectedCategory);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // const isMd = useMediaQuery(theme.breakpoints.up('md'), {
  //   defaultMatches: true,
  // });
  // const isLG = useMediaQuery(theme.breakpoints.up('lg'), {
  //   defaultMatches: true,
  // });

  const smDown = useMediaQuery(theme.breakpoints.down('sm'), {
    defaultMatches: true,
  });

  const setEmptyArray = (loopCount: number) => {
    return Array.from({ length: loopCount }, () => {
      return {
        network: null,
        category: null,
        maximum_supply: null,
        status: null,
        _id: null,
        name: null,
        cover_image: null,
        creator_id: null,
        contract_address: null,
        contract_type: null,
        path: null,
        image_link: null,
        description: null,
        createdAt: null,
        updatedAt: null,
        __v: null,
        total_volume: null,
        total_volume_usd: null,
        total_volume_krw: null,
        floorPrice: null,
      };
    });
  };

  useEffect(() => {
    if (data?.data && data?.data.length < 20) {
      const loopCount = !data?.data ? 20 : 20 - data?.data.length;
      const arr = setEmptyArray(loopCount);
      setItems([...data.data, ...arr]);
    } else if (!data?.data) {
      const arr = setEmptyArray(20);
      setItems([...arr]);
    } else if (data?.data) {
      setItems([...data.data]);
    }
  }, [data?.data]);

  useEffect(() => {
    console.log(items);
  }, [items]);

  return (
    <TopCollectionsSection>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: smDown ? 'column' : 'row',
          gap: '0.5rem',
          mb: '50px',
        }}
      >
        <Typography sx={{ fontSize: '38px', fontWeight: 500, lineHeight: '44px' }}>
          Top Collections over
        </Typography>
        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}
          sx={{ fontSize: smDown ? '21px' : '38px', fontWeight: 700, color: 'primary' }}
        >
          {category.caption}
          <KeyboardArrowDownIcon />
        </Button>

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          {CATEGORY.map((item, index) => (
            <Box key={index} sx={{ minWidth: '200px' }}>
              <MenuItem onClick={() => handleCategory(item)}>{item.caption}</MenuItem>
              {index < CATEGORY.length - 1 && <Divider />}
            </Box>
          ))}
        </Menu>
      </Box>
      <Grid container>
        {items.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Box
              key={index}
              sx={{
                m: '10px',
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                // width: smDown ? '300px' : '335px',
                height: '80px',
                border: '1px solid #DFDFDF',
                borderRadius: '10px',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#EDEDED',
                  borderRadius: '50%',
                  width: '50px',
                  height: '50px',
                  marginLeft: '25px',
                  marginRight: '18px',
                  my: '15px',
                }}
              >
                <Avatar src={crmc_logo} sx={{ width: '25px', height: '24px' }} />
              </Box>

              <Box>
                <Box
                  sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                >
                  <Typography
                    sx={{ fontSize: '14px', fontWeight: 700, lineHeight: '22px', color: '#343434' }}
                  >
                    {item.name ? item.name : `Collections ${index}`}
                  </Typography>
                  <Typography
                    sx={{ fontSize: '12px', fontWeight: 400, lineHeight: '22px', color: '#979797' }}
                  >
                    D-day 00:00:00
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </TopCollectionsSection>
  );
};

export default TopCollections;
