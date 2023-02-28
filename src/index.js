import React, { Suspense, useEffect } from 'react';
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

import { useWeb3React, Web3ReactHooks, Web3ReactProvider } from '@web3-react/core';

import { coinbaseWallet, hooks as coinbaseWalletHooks } from './connectors/coinbaseWallet';
import { hooks as metaMaskHooks, metaMask } from './connectors/metaMask';
import { hooks as networkHooks, network } from './connectors/network';
import { hooks as walletConnectV2Hooks, walletConnectV2 } from './connectors/walletConnect';
import { hooks as kaikasHooks, kaikas } from './connectors/kaikas';
import { getConnector, getName } from './utils';

// import { Web3ReactProvider } from '@web3-react/core';
// import { Web3Provider } from '@ethersproject/providers';

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

const connectors = [
  [metaMask, metaMaskHooks],
  [walletConnectV2, walletConnectV2Hooks],
  [coinbaseWallet, coinbaseWalletHooks],
  [network, networkHooks],
  [kaikas, kaikasHooks],
];

function Child() {
  const { connector } = useWeb3React();
  console.log('=========== connector ===>', connector);
  console.log(`Priority Connector is: ${getName(connector)}`);
  useEffect(() => {
    // const connection = getConnector();
    console.log('..... Rune Eager Connect .....');
    void connector.connectEagerly().catch(() => {
      console.debug('Failed to connect eagerly to metamask');
    });
  }, []);
  return null;
}

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
      <Web3ReactProvider connectors={connectors}>
        <Child />
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
      <Web3ReactProvider connectors={connectors}>
        <Child />
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
