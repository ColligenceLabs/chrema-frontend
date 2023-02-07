import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import React from 'react';

export const Menuitems = [
  {
    title: 'Home',
    icon: <HomeOutlinedIcon width="20" height="20" />,
    href: '/',
  },
  {
    title: 'Marketplace',
    icon: <StorefrontOutlinedIcon width="20" height="20" />,
    href: '/market',
  },
  {
    title: 'Create',
    icon: <AddCircleOutlineIcon width="20" height="20" />,
    href: '/market/create',
  },
];

export default { Menuitems };
