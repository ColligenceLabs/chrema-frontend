import React, { Suspense } from 'react';
import { ethers } from 'taalswap-ethers';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import { configureStore } from './redux/Store';
import * as serviceWorker from './serviceWorker';
import reportWebVitals from './reportWebVitals';
import Spinner from './components/spinner/Spinner';
import './localization';

import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

// import {
//   AccountsProvider,
//   ConnectionProvider,
//   StoreProvider,
//   WalletProvider,
//   MetaProvider,
// } from '@colligence/metaplex-common';

// function getLibrary(provider) {
//   const library = new Web3Provider(provider);
//   library.pollingInterval = 12000;
//   return library;
// }

if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
  console.error = () => {};
  console.debug = () => {};
}

const getLibrary = (provider) => {
  const library = new ethers.providers.Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
};

ReactDOM.render(
  process.env.REACT_APP_USE_SOLANA === 'true' ? (
    <BrowserRouter>
      {/*<ConnectionProvider>*/}
      {/*<WalletProvider>*/}
      {/*<AccountsProvider>*/}
      {/*<StoreProvider*/}
      {/*  ownerAddress={process.env.REACT_APP_STORE_OWNER_ADDRESS_ADDRESS}*/}
      {/*  storeAddress={process.env.REACT_APP_STORE_ADDRESS}*/}
      {/*>*/}
      {/*<MetaProvider>*/}
      <Web3ReactProvider getLibrary={getLibrary}>
        <Provider store={configureStore()}>
          <Suspense fallback={<Spinner />}>
            <App />
          </Suspense>
        </Provider>
      </Web3ReactProvider>
      {/*</MetaProvider>*/}
      {/*</StoreProvider>*/}
      {/*</AccountsProvider>*/}
      {/*</WalletProvider>*/}
      {/*</ConnectionProvider>*/}
    </BrowserRouter>
  ) : (
    <BrowserRouter>
      {/*<StoreProvider*/}
      {/*  ownerAddress={process.env.REACT_APP_STORE_OWNER_ADDRESS_ADDRESS}*/}
      {/*  storeAddress={process.env.REACT_APP_STORE_ADDRESS}*/}
      {/*>*/}
      <Web3ReactProvider getLibrary={getLibrary}>
        <Provider store={configureStore()}>
          <Suspense fallback={<Spinner />}>
            <App />
          </Suspense>
        </Provider>
      </Web3ReactProvider>
      {/*</StoreProvider>*/}
    </BrowserRouter>
  ),
  document.getElementById('root'),
);

// If you want to enable client cache, register instead.
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
