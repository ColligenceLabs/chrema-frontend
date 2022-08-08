import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full-layout/loadable/Loadable';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full-layout/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank-layout/BlankLayout')));
/* ***End Layouts**** */

const Error = Loadable(lazy(() => import('../views/authentication/Error')));
const Login = Loadable(lazy(() => import('../views/authentication/Login')));
const Register = Loadable(lazy(() => import('../views/authentication/Register')));
const ResetPassword = Loadable(lazy(() => import('../views/authentication/ResetPassword')));

const Dashboard = Loadable(lazy(() => import('../views/Dashboard')));
const Users = Loadable(lazy(() => import('../views/Users')));
const Admins = Loadable(lazy(() => import('../views/Admins')));
const Creator = Loadable(lazy(() => import('../views/Creator/Creator')));
const CreatorRegister = Loadable(lazy(() => import('../views/Creator/CreatorRegister')));
const CreatorUpdate = Loadable(lazy(() => import('../views/Creator/CreatorUpdate')));
const NFTs = Loadable(lazy(() => import('../views/NFTs')));
const NFTMint = Loadable(lazy(() => import('../views/NFTs/NFTMint')));
const AirDrop = Loadable(lazy(() => import('../views/AirDrop')));
const AirDropMint = Loadable(lazy(() => import('../views/AirDrop/AirDropMint')));
const Serials = Loadable(lazy(() => import('../views/Serials')));
const SerialsCreate = Loadable(lazy(() => import('../views/Serials/SerialsCreate')));
const Transaction = Loadable(lazy(() => import('../views/Transaction')));
const Collection = Loadable(lazy(() => import('../views/Collection')));
const CollectionCreate = Loadable(lazy(() => import('../views/Collection/CollectionCreate')));
const CollectionUpdate = Loadable(lazy(() => import('../views/Collection/CollectionUpdate')));
const Reward = Loadable(lazy(() => import('../views/Reward')));
const RewardCreate = Loadable(lazy(() => import('../views/Reward/RewardCreate')));
const UserProfile = Loadable(lazy(() => import('../views/UserProfile/UserProfile')));
const Solana = Loadable(lazy(() => import('../views/Solana')));
const CollectionRequest = Loadable(lazy(() => import('../views/CollectionRequest')));

const NftMarketHome = Loadable(lazy(() => import('../views/NftsMarket/Home')));
const NftMarket = Loadable(lazy(() => import('../views/NftsMarket/NFTsMarket')));
const NftCreateNewItem = Loadable(lazy(() => import('../views/NftsMarket/CreateNewItem')));
const NftCreateNewCollection = Loadable(
  lazy(() => import('../views/NftsMarket/CreateNewCollection')),
);
const NftMyCollection = Loadable(lazy(() => import('../views/NftsMarket/MyCollection')));
const NftCollection = Loadable(lazy(() => import('../views/NftsMarket/NFTCollection')));
const NftDetail = Loadable(lazy(() => import('../views/NftsMarket/NFTDetail')));
const NftMarketByCreator = Loadable(lazy(() => import('../views/NftsMarket/NFTsMarketByCreator')));
const NftMarketRegister = Loadable(lazy(() => import('../views/NftsMarket/MarketRegister')));
const NftMarketUserProfile = Loadable(lazy(() => import('../views/NftsMarket/UserProfile')));
const NftMarketUserProfileSetting = Loadable(
  lazy(() => import('../views/NftsMarket/UserProfileSetting')),
);

/* ****Routes***** */
const Router = (isLoggedIn, level) => [
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      { path: '/', element: <NftMarketHome /> },
      { path: '/market', element: <NftMarket /> },
      { path: '/market/collection/:id', element: <NftCollection /> },
      { path: '/market/create', element: <NftCreateNewItem /> },
      { path: '/market/mycollection', element: <NftMyCollection /> },
      { path: '/market/collection/create', element: <NftCreateNewCollection /> },
      // { path: '/market/collection/:id/:onSale', element: <NftCollection /> },
      { path: '/market/detail/:id', element: <NftDetail /> },
      { path: '/market/detail', element: <NftDetail /> },
      { path: '/market/creator/:id', element: <NftMarketByCreator /> },
      { path: '/market/profile', element: <NftMarketUserProfile /> },
      { path: '/market/profile/setting', element: <NftMarketUserProfileSetting /> },
    ],
  },
  {
    path: '/',
    element: isLoggedIn && level === 'administrator' ? <FullLayout /> : <Navigate to="/" />,
    children: [
      { path: '/admins', exact: true, element: <Admins /> },
      { path: '/users', exact: true, element: <Users /> },
      { path: '/creator', exact: true, element: <Creator /> },
      { path: '/creator/register', exact: true, element: <CreatorRegister /> },
      { path: '/creator/update', exact: true, element: <CreatorUpdate /> },
      { path: '/trace', exact: true, element: <Serials /> },
      { path: '/trace/create', exact: true, element: <SerialsCreate /> },
      { path: '/solana', exact: true, element: <Solana /> },
      { path: '/collection-request', exact: true, element: <CollectionRequest /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },

  {
    path: '/',
    element:
      isLoggedIn && (level === 'administrator' || level === 'Creator') ? (
        <FullLayout />
      ) : (
        <Navigate to="/" />
      ),
    children: [
      // { path: '/', element: <NftMarket /> },
      { path: '/dashboard', exact: true, element: <Dashboard /> },
      { path: '/nfts', exact: true, element: <NFTs /> },
      { path: '/nfts/mint', exact: true, element: <NFTMint /> },
      { path: '/airdrop', exact: true, element: <AirDrop /> },
      { path: '/airdrop/mint', exact: true, element: <AirDropMint /> },
      { path: '/transaction', exact: true, element: <Transaction /> },
      { path: '/collection', exact: true, element: <Collection /> },
      { path: '/collection/update', exact: true, element: <CollectionUpdate /> },
      { path: '/collection/create', exact: true, element: <CollectionCreate /> },
      { path: '/reward', exact: true, element: <Reward /> },
      { path: '/reward/create', exact: true, element: <RewardCreate /> },
      { path: '/profile', exact: true, element: <UserProfile /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: 'auth',
    element: <BlankLayout />,
    children: [
      { path: '404', element: <Error /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'market-register', element: <NftMarketRegister /> },
      { path: 'reset-password', element: <ResetPassword /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

export default Router;
