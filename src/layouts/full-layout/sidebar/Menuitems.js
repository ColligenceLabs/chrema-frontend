import TokenOutlinedIcon from '@mui/icons-material/TokenOutlined';
import InvertColorsIcon from '@mui/icons-material/InvertColors';
import CollectionsOutlinedIcon from '@mui/icons-material/CollectionsOutlined';
import NumbersIcon from '@mui/icons-material/Numbers';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
import GestureOutlinedIcon from '@mui/icons-material/GestureOutlined';

export const Menuitems = [
  {
    title: 'Dashboard',
    icon: <DashboardOutlinedIcon width="20" height="20" />,
    href: '/dashboard',
  },
  {
    title: 'Admins',
    icon: <SupervisorAccountOutlinedIcon width="20" height="20" />,
    href: '/admins',
  },
  {
    title: 'Creator',
    // icon: 'hard-drive',
    icon: <GestureOutlinedIcon width="20" height="20" />,
    href: '/creator',
  },
  {
    title: 'Users',
    icon: <SupervisorAccountOutlinedIcon width="20" height="20" />,
    href: '/users',
  },

  {
    title: 'Collections',
    // icon: 'hard-drive',
    icon: <CollectionsOutlinedIcon width="20" height="20" />,
    href: '/collection',
  },
  {
    title: 'NFTs',
    // icon: 'users',
    // href: '/nfts',
    icon: <TokenOutlinedIcon width="20" height="20" />,
    collapse: true,
    children: [
      {
        title: 'NFTs',
        icon: <TokenOutlinedIcon width="20" height="20" />,
        href: '/nfts',
      },
      {
        title: 'AirDrop',
        // icon: 'edit',
        icon: <InvertColorsIcon width="20" height="20" />,
        href: '/airdrop',
      },
    ],
  },
  {
    title: 'Trace NFT',
    icon: <NumbersIcon width="20" height="20" />,
    href: '/trace',
  },
  {
    title: 'Transaction',
    icon: <SwapHorizIcon width="20" height="20" />,
    href: '/transaction',
  },
  {
    title: 'UID Mapping',
    icon: <PeopleAltOutlinedIcon width="20" height="20" />,
    href: '/user',
  },
  {
    title: 'Solana',
    icon: <PeopleAltOutlinedIcon width="20" height="20" />,
    href: '/solana',
  },
  {
    title: 'Collection Request',
    icon: <AddPhotoAlternateIcon width="20" height="20" />,
    href: '/collection-request',
  },
  // {
  //   title: 'Reward',
  //   icon: <EmojiEventsOutlinedIcon width="20" height="20" />,
  //   href: '/reward',
  // },
];

export const CreatorMenu = [
  {
    title: 'Dashboard',
    icon: <DashboardOutlinedIcon width="20" height="20" />,
    href: '/dashboard',
  },
  {
    title: 'Collections',
    // icon: 'hard-drive',
    icon: <CollectionsOutlinedIcon width="20" height="20" />,
    href: '/collection',
  },
  {
    title: 'NFTs',
    // icon: 'users',
    // href: '/nfts',
    icon: <TokenOutlinedIcon width="20" height="20" />,
    collapse: true,
    children: [
      {
        title: 'NFTs',
        icon: <TokenOutlinedIcon width="20" height="20" />,
        href: '/nfts',
      },
      {
        title: 'AirDrop',
        // icon: 'edit',
        icon: <InvertColorsIcon width="20" height="20" />,
        href: '/airdrop',
      },
    ],
  },
  {
    title: 'Transaction',
    icon: <SwapHorizIcon width="20" height="20" />,
    href: '/transaction',
  },

  // {
  //   title: 'Reward',
  //   icon: <EmojiEventsOutlinedIcon width="20" height="20" />,
  //   href: '/reward',
  // },
];

export default { Menuitems, CreatorMenu };
